use anchor_lang::prelude::*;

use std::hash::Hash;

declare_id!("7GTG5YucwCqnmcHoeTVs8vwt9MhXjQdCXs8yToHpHPHC");

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PlayerColor {
    Red = 0,
    Blue = 1,
    Green = 2,
    Yellow = 3,
    Purple = 4,
    Orange = 5,
}

fn string_to_color(color: &str) -> Result<PlayerColor> {
    match color.to_lowercase().as_str() {
        "red" => Ok(PlayerColor::Red),
        "blue" => Ok(PlayerColor::Blue),
        "green" => Ok(PlayerColor::Green),
        "yellow" => Ok(PlayerColor::Yellow),
        "purple" => Ok(PlayerColor::Purple),
        "orange" => Ok(PlayerColor::Orange),
        _ => Err(error!(ErrorCode::InvalidColor)),
    }
}

#[program]
pub mod risk_game {
    use super::*;

    pub fn initialize_game(
        ctx: Context<InitializeGame>,
        color: String,
        territories: Vec<Territory>,
        continents: Vec<Continent>,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let territory_account = &mut ctx.accounts.territory_account;
        let player_account = &mut ctx.accounts.player_account;

        // Initialize game account
        game.current_player = ctx.accounts.creator.key();
        game.turn = 1;
        game.state = GameState::Setup;
        game.current_phase = TurnPhase::Reinforcement;
        game.cards_sets_turned_in = 0;
        game.territory_account = territory_account.key();
        game.player_account = player_account.key();

        // Initialize territory account
        territory_account.territories = territories;
        territory_account.continents = continents;
        territory_account.game = game.key();

        // Initialize player account with color enum
        let color_enum = string_to_color(&color)?;
        player_account.players = vec![PlayerState {
            pubkey: ctx.accounts.creator.key(),
            color_id: color_enum as u8,
            cards: Vec::new(),
            conquered_territory_this_turn: false,
        }];
        player_account.game = game.key();

        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>, color: String) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let player_account = &mut ctx.accounts.player_account;

        require!(
            game.state == GameState::Setup,
            ErrorCode::GameAlreadyStarted
        );
        require!(
            player_account.players.len() < 6,
            ErrorCode::MaxPlayersReached
        );

        let color_enum = string_to_color(&color)?;
        let color_id = color_enum as u8;

        // Validate color is not already taken
        require!(
            !player_account
                .players
                .iter()
                .any(|p| p.color_id == color_id),
            ErrorCode::ColorAlreadyTaken
        );

        player_account.players.push(PlayerState {
            pubkey: ctx.accounts.player.key(),
            color_id,
            cards: Vec::new(),
            conquered_territory_this_turn: false,
        });

        if player_account.players.len() >= 2 {
            game.state = GameState::InProgress;
        }
        Ok(())
    }

    pub fn start_turn(ctx: Context<MakeMove>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );
        require!(
            game.current_phase == TurnPhase::Reinforcement,
            ErrorCode::InvalidPhase
        );

        let reinforcements = calculate_reinforcements(
            &ctx.accounts.territory_account,
            &ctx.accounts.player_account,
            &ctx.accounts.player.key(),
        );
        msg!("Player receives {} reinforcements", reinforcements);

        game.pending_reinforcements = Some(reinforcements);

        Ok(())
    }

    pub fn place_reinforcements(
        ctx: Context<MakeMove>,
        placements: Vec<(u8, u8)>, // Vec of (territory_id, troops)
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );
        require!(
            game.current_phase == TurnPhase::Reinforcement,
            ErrorCode::InvalidPhase
        );

        let reinforcements = game
            .pending_reinforcements
            .ok_or(ErrorCode::NoReinforcements)?;

        // Validate total troops being placed matches reinforcements
        let total_troops: u8 = placements.iter().map(|(_, troops)| troops).sum();
        require!(total_troops == reinforcements, ErrorCode::InvalidTroopCount);

        // Place troops
        for (territory_id, troops) in placements {
            let territory = &mut ctx.accounts.territory_account.territories[territory_id as usize];
            require!(
                territory.owner == Some(ctx.accounts.player.key()),
                ErrorCode::NotTerritoryOwner
            );
            territory.troops += troops;
        }

        // Clear pending reinforcements and move to attack phase
        game.pending_reinforcements = None;
        game.current_phase = TurnPhase::Attack;

        Ok(())
    }

    pub fn attack(
        ctx: Context<MakeMove>,
        from_territory: u8,
        to_territory: u8,
        attacking_dice: u8,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );
        require!(
            game.current_phase == TurnPhase::Attack,
            ErrorCode::InvalidPhase
        );

        // Use territory program to validate and update territories
        let territory_program = ctx.accounts.territory_program.to_account_info();
        let territory_state = ctx.accounts.territory_state.to_account_info();
        let authority = ctx.accounts.player.to_account_info();

        // Get territory information
        let from_territory_ref = &ctx.accounts.territory_state.territories[from_territory as usize];
        require!(
            from_territory_ref.owner == Some(ctx.accounts.player.key()),
            ErrorCode::NotTerritoryOwner
        );
        require!(
            from_territory_ref.troops > attacking_dice,
            ErrorCode::InsufficientTroops
        );
        require!(attacking_dice <= 3, ErrorCode::InvalidDiceCount);

        let to_territory_ref = &ctx.accounts.territory_state.territories[to_territory as usize];
        require!(
            to_territory_ref.owner != Some(ctx.accounts.player.key()),
            ErrorCode::CannotAttackOwnTerritory
        );

        // Roll dice and resolve combat
        let attacker_dice = roll_dice(attacking_dice);
        let defender_dice = roll_dice(std::cmp::min(2, to_territory_ref.troops));

        game.last_attack_dice = Some(AttackDice {
            attacker: attacker_dice.clone(),
            defender: defender_dice.clone(),
        });

        let (attacker_losses, defender_losses) = resolve_combat(&attacker_dice, &defender_dice);

        // Update territories using CPI
        territory::cpi_interface::update_territory(
            territory_program.clone(),
            territory_state.clone(),
            authority.clone(),
            from_territory,
            Some(ctx.accounts.player.key()),
            from_territory_ref.troops - attacker_losses,
        )?;

        let defending_territory =
            &mut ctx.accounts.territory_state.territories[to_territory as usize];
        if defending_territory.troops <= defender_losses {
            // Territory conquered
            territory::cpi_interface::update_territory(
                territory_program.clone(),
                territory_state.clone(),
                authority.clone(),
                to_territory,
                Some(ctx.accounts.player.key()),
                attacking_dice - attacker_losses,
            )?;

            // Update player state using CPI
            let player_program = ctx.accounts.player_program.to_account_info();
            let player_state = ctx.accounts.player_state.to_account_info();

            player::cpi_interface::set_conquered_territory(
                player_program,
                player_state,
                authority.clone(),
                ctx.accounts.player.key(),
                true,
            )?;
        } else {
            // Territory not conquered
            territory::cpi_interface::update_territory(
                territory_program.clone(),
                territory_state.clone(),
                authority.clone(),
                to_territory,
                defending_territory.owner,
                defending_territory.troops - defender_losses,
            )?;
        }

        check_victory_condition(game, &ctx.accounts.territory_state);
        Ok(())
    }

    pub fn end_phase(ctx: Context<MakeMove>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );

        match game.current_phase {
            TurnPhase::Reinforcement => {
                game.current_phase = TurnPhase::Attack;
            }
            TurnPhase::Attack => {
                game.current_phase = TurnPhase::Fortification;
            }
            TurnPhase::Fortification => {
                // Award card if territory was conquered
                let player = ctx
                    .accounts
                    .player_account
                    .players
                    .iter_mut()
                    .find(|p| p.pubkey == ctx.accounts.player.key())
                    .unwrap();

                if player.conquered_territory_this_turn {
                    require!(player.cards.len() < 5, ErrorCode::CardLimitReached);
                    player.cards.push(generate_risk_card());
                    player.conquered_territory_this_turn = false;
                }

                // Move to next player's turn
                game.current_phase = TurnPhase::Reinforcement;
                next_turn(game, &ctx.accounts.player_account);
            }
        }

        Ok(())
    }

    pub fn trade_cards(ctx: Context<MakeMove>, card_indices: Vec<u8>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );
        require!(
            game.current_phase == TurnPhase::Reinforcement,
            ErrorCode::InvalidPhase
        );

        let bonus_armies = match game.cards_sets_turned_in {
            0 => 4,
            1 => 6,
            2 => 8,
            3 => 10,
            4 => 12,
            _ => 15,
        };

        let player = ctx
            .accounts
            .player_account
            .players
            .iter_mut()
            .find(|p| p.pubkey == ctx.accounts.player.key())
            .unwrap();

        // Validate indices
        require!(card_indices.len() == 3, ErrorCode::InvalidCardSet);
        for &idx in &card_indices {
            require!(
                (idx as usize) < player.cards.len(),
                ErrorCode::InvalidCardIndex
            );
        }

        // Get the cards to trade
        let cards: Vec<_> = card_indices
            .iter()
            .map(|&idx| player.cards[idx as usize].clone())
            .collect();

        // Validate card set
        require!(is_valid_card_set(&cards), ErrorCode::InvalidCardSet);

        // Remove cards from player's hand (remove from highest index first to maintain validity)
        let mut sorted_indices = card_indices.clone();
        sorted_indices.sort_by(|a, b| b.cmp(a));
        for idx in sorted_indices {
            player.cards.remove(idx as usize);
        }

        // Award bonus armies
        game.pending_reinforcements = Some(game.pending_reinforcements.unwrap_or(0) + bonus_armies);
        game.cards_sets_turned_in += 1;

        Ok(())
    }

    pub fn distribute_initial_territories(ctx: Context<MakeMove>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let territory_account = &mut ctx.accounts.territory_account;
        let player_account = &ctx.accounts.player_account;

        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );

        distribute_territories(territory_account, player_account);
        Ok(())
    }

    pub fn fortify(
        ctx: Context<MakeMove>,
        from_territory: u8,
        to_territory: u8,
        troops: u8,
    ) -> Result<()> {
        let game = &mut ctx.accounts.game;
        let territory_account = &mut ctx.accounts.territory_account;

        // Basic state validations
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );
        require!(
            game.current_phase == TurnPhase::Fortification,
            ErrorCode::InvalidPhase
        );

        // Validate territory ownership and troops
        let from_territory_ref = &territory_account.territories[from_territory as usize];
        require!(
            from_territory_ref.owner == Some(ctx.accounts.player.key()),
            ErrorCode::NotTerritoryOwner
        );
        require!(
            from_territory_ref.troops > troops,
            ErrorCode::InsufficientTroops
        );

        let to_territory_ref = &territory_account.territories[to_territory as usize];
        require!(
            to_territory_ref.owner == Some(ctx.accounts.player.key()),
            ErrorCode::NotTerritoryOwner
        );

        // Validate connectivity
        let are_connected = are_territories_connected(
            territory_account,
            from_territory,
            to_territory,
            &ctx.accounts.player.key(),
        );
        require!(are_connected, ErrorCode::TerritoriesNotConnected);

        // Move troops
        territory_account.territories[from_territory as usize].troops -= troops;
        territory_account.territories[to_territory as usize].troops += troops;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = creator, space = 8 + Game::SPACE)]
    pub game: Account<'info, Game>,
    #[account(init, payer = creator, space = 8 + TerritoryAccount::SPACE)]
    pub territory_account: Account<'info, TerritoryAccount>,
    #[account(init, payer = creator, space = 8 + PlayerAccount::SPACE)]
    pub player_account: Account<'info, PlayerAccount>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut, constraint = player_account.game == game.key())]
    pub player_account: Account<'info, PlayerAccount>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut, constraint = territory_account.game == game.key())]
    pub territory_account: Account<'info, TerritoryAccount>,
    #[account(mut, constraint = player_account.game == game.key())]
    pub player_account: Account<'info, PlayerAccount>,
    pub player: Signer<'info>,
    pub territory_program: Program<'info, territory::program::Territory>,
    #[account(mut)]
    pub territory_state: Account<'info, territory::TerritoryState>,
    pub player_program: Program<'info, player::program::Player>,
    #[account(mut)]
    pub player_state: Account<'info, player::PlayerState>,
}

#[account]
pub struct Game {
    pub current_player: Pubkey,
    pub turn: u8,
    pub state: GameState,
    pub current_phase: TurnPhase,
    pub cards_sets_turned_in: u8,
    pub last_attack_dice: Option<AttackDice>,
    pub pending_reinforcements: Option<u8>,
    pub territory_account: Pubkey,
    pub player_account: Pubkey,
}

#[account]
pub struct TerritoryAccount {
    pub territories: Vec<Territory>,
    pub continents: Vec<Continent>,
    pub game: Pubkey,
}

#[account]
pub struct PlayerAccount {
    pub players: Vec<PlayerState>,
    pub game: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct PlayerState {
    pub pubkey: Pubkey,
    pub color_id: u8,
    pub cards: Vec<RiskCard>,
    pub conquered_territory_this_turn: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Territory {
    pub id: u8,
    pub continent_id: u8,
    pub owner: Option<Pubkey>,
    pub troops: u8,
    pub adjacent_territories: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Continent {
    pub id: u8,
    pub territories: Vec<u8>,
    pub bonus_armies: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct RiskCard {
    pub card_type: CardType,
    pub territory_id: Option<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AttackDice {
    pub attacker: Vec<u8>,
    pub defender: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameState {
    Setup,
    InProgress,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum TurnPhase {
    Reinforcement,
    Attack,
    Fortification,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Hash)]
pub enum CardType {
    Infantry,
    Cavalry,
    Artillery,
    Wild,
}

#[error_code]
pub enum ErrorCode {
    GameAlreadyStarted,
    GameNotInProgress,
    NotPlayerTurn,
    MaxPlayersReached,
    NotTerritoryOwner,
    InsufficientTroops,
    CannotAttackOwnTerritory,
    InvalidPhase,
    InvalidCardSet,
    InvalidDiceCount,
    TerritoriesNotAdjacent,
    NoRemainingMoves,
    InvalidTroopCount,
    CardLimitReached,
    ColorAlreadyTaken,
    NoReinforcements,
    InvalidCardIndex,
    TerritoriesNotConnected,
    InvalidColor,
}

impl Game {
    pub const SPACE: usize = 32 + // current_player
        1 + // turn
        1 + // state enum
        1 + // current_phase enum
        1 + // cards_sets_turned_in
        1 + (10) + // last_attack_dice Option
        1 + // pending_reinforcements Option
        32 + // territory_account pubkey
        32; // player_account pubkey
}

impl TerritoryAccount {
    pub const SPACE: usize = 4 + (50 * 42) + // territories vec (42 territories, ~50 bytes each)
        4 + (20 * 6) + // continents vec (6 continents, ~20 bytes each)
        32; // game pubkey
}

impl PlayerAccount {
    pub const SPACE: usize = 4 + (100 * 6) + // players vec (max 6 players, ~100 bytes each)
        32; // game pubkey
}

fn calculate_reinforcements(
    territory_account: &Account<TerritoryAccount>,
    _player_account: &Account<PlayerAccount>,
    player: &Pubkey,
) -> u8 {
    let territories_owned = territory_account
        .territories
        .iter()
        .filter(|t| t.owner == Some(*player))
        .count();

    let base_reinforcements = std::cmp::max(territories_owned as u8 / 3, 3);

    let continent_bonuses = territory_account
        .continents
        .iter()
        .map(|continent| {
            let owns_continent = continent
                .territories
                .iter()
                .all(|&t_id| territory_account.territories[t_id as usize].owner == Some(*player));
            if owns_continent {
                continent.bonus_armies
            } else {
                0
            }
        })
        .sum::<u8>();

    base_reinforcements + continent_bonuses
}

fn roll_dice(count: u8) -> Vec<u8> {
    let mut dice = Vec::new();
    for _ in 0..count {
        // In a real implementation, we'd want to use a secure random number generator
        // This is just for demonstration
        dice.push((Clock::get().unwrap().unix_timestamp as u8 % 6) + 1);
    }
    dice.sort_by(|a, b| b.cmp(a)); // Sort in descending order
    dice
}

fn resolve_combat(attacker_dice: &[u8], defender_dice: &[u8]) -> (u8, u8) {
    let mut attacker_losses = 0;
    let mut defender_losses = 0;

    for i in 0..std::cmp::min(attacker_dice.len(), defender_dice.len()) {
        if attacker_dice[i] > defender_dice[i] {
            defender_losses += 1;
        } else {
            attacker_losses += 1;
        }
    }

    (attacker_losses, defender_losses)
}

fn generate_risk_card() -> RiskCard {
    // In a real implementation, we'd want to use a secure random number generator
    let card_type = match Clock::get().unwrap().unix_timestamp as u8 % 4 {
        0 => CardType::Infantry,
        1 => CardType::Cavalry,
        2 => CardType::Artillery,
        _ => CardType::Wild,
    };

    RiskCard {
        card_type,
        territory_id: None, // For simplicity, not assigning territories to cards
    }
}

fn check_victory_condition(
    game: &mut Account<Game>,
    territory_state: &Account<territory::TerritoryState>,
) {
    let first_owner = territory_state.territories[0].owner;
    if first_owner.is_some()
        && territory_state
            .territories
            .iter()
            .all(|t| t.owner == first_owner)
    {
        game.state = GameState::Completed;
    }
}

fn next_turn(game: &mut Account<Game>, player_account: &Account<PlayerAccount>) {
    let current_player_index = player_account
        .players
        .iter()
        .position(|p| p.pubkey == game.current_player)
        .unwrap();

    let next_player_index = (current_player_index + 1) % player_account.players.len();
    game.current_player = player_account.players[next_player_index].pubkey;
    game.turn += 1;
}

fn distribute_territories(
    territory_account: &mut Account<TerritoryAccount>,
    player_account: &Account<PlayerAccount>,
) {
    let seed: Vec<u8> = player_account
        .players
        .iter()
        .flat_map(|p| p.pubkey.to_bytes())
        .collect();

    let player_count = player_account.players.len();

    for (i, territory) in territory_account.territories.iter_mut().enumerate() {
        let player_index = (hash_to_index(&seed, i) % player_count) as usize;
        territory.owner = Some(player_account.players[player_index].pubkey);
        territory.troops = 3; // Initial troops per territory
    }
}

fn hash_to_index(seed: &[u8], counter: usize) -> usize {
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    seed.hash(&mut hasher);
    counter.hash(&mut hasher);
    std::hash::Hasher::finish(&hasher) as usize
}

fn is_valid_card_set(cards: &[RiskCard]) -> bool {
    if cards.len() != 3 {
        return false;
    }

    // Check for three of a kind
    if cards.iter().all(|c| c.card_type == cards[0].card_type) {
        return true;
    }

    // Check for one of each (excluding wilds)
    let unique_types: std::collections::HashSet<_> = cards.iter().map(|c| &c.card_type).collect();
    if unique_types.len() == 3 && !unique_types.contains(&CardType::Wild) {
        return true;
    }

    // Check for sets with wilds
    let wild_count = cards
        .iter()
        .filter(|c| c.card_type == CardType::Wild)
        .count();
    if wild_count > 0 {
        let non_wild_types: std::collections::HashSet<_> = cards
            .iter()
            .filter(|c| c.card_type != CardType::Wild)
            .map(|c| &c.card_type)
            .collect();
        if wild_count + non_wild_types.len() == 3 {
            return true;
        }
    }

    false
}

fn are_territories_connected(
    territory_account: &Account<TerritoryAccount>,
    start: u8,
    end: u8,
    owner: &Pubkey,
) -> bool {
    let mut visited = vec![false; territory_account.territories.len()];
    let mut stack = vec![start];
    visited[start as usize] = true;

    while let Some(current) = stack.pop() {
        if current == end {
            return true;
        }

        for &adj in &territory_account.territories[current as usize].adjacent_territories {
            if !visited[adj as usize]
                && territory_account.territories[adj as usize].owner == Some(*owner)
            {
                visited[adj as usize] = true;
                stack.push(adj);
            }
        }
    }

    false
}
