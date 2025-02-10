use anchor_lang::prelude::*;

use std::hash::Hash;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod risk_game {
    use super::*;

    pub fn initialize_game(ctx: Context<InitializeGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.current_player = ctx.accounts.creator.key();
        game.turn = 1;
        game.state = GameState::Setup;
        game.territories = initialize_territories();
        game.players = Vec::new();
        Ok(())
    }

    pub fn join_game(ctx: Context<JoinGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::Setup,
            ErrorCode::GameAlreadyStarted
        );
        require!(game.players.len() < 6, ErrorCode::MaxPlayersReached);

        game.players.push(ctx.accounts.player.key());

        if game.players.len() >= 2 {
            game.state = GameState::InProgress;
            distribute_territories(game);
        }
        Ok(())
    }

    pub fn place_troops(ctx: Context<MakeMove>, territory_id: u8, troops: u8) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(
            game.state == GameState::InProgress,
            ErrorCode::GameNotInProgress
        );
        require!(
            game.current_player == ctx.accounts.player.key(),
            ErrorCode::NotPlayerTurn
        );

        let territory = &mut game.territories[territory_id as usize];
        require!(
            territory.owner == Some(ctx.accounts.player.key()),
            ErrorCode::NotTerritoryOwner
        );

        territory.troops += troops;
        next_turn(game);
        Ok(())
    }

    pub fn attack_territory(
        ctx: Context<MakeMove>,
        from_territory: u8,
        to_territory: u8,
        attacking_troops: u8,
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

        // Validate ownership and troops before getting mutable references
        let from_territory_ref = &game.territories[from_territory as usize];
        require!(
            from_territory_ref.owner == Some(ctx.accounts.player.key()),
            ErrorCode::NotTerritoryOwner
        );
        require!(
            from_territory_ref.troops > attacking_troops,
            ErrorCode::InsufficientTroops
        );

        let to_territory_ref = &game.territories[to_territory as usize];
        require!(
            from_territory_ref.owner != to_territory_ref.owner,
            ErrorCode::CannotAttackOwnTerritory
        );

        // Now perform the attack with mutable references
        let defending_troops = to_territory_ref.troops;
        let territories = &mut game.territories;

        if attacking_troops > defending_troops {
            territories[to_territory as usize].owner = Some(ctx.accounts.player.key());
            territories[to_territory as usize].troops = attacking_troops - defending_troops;
            territories[from_territory as usize].troops -= attacking_troops;
        } else {
            territories[from_territory as usize].troops -= attacking_troops;
        }

        check_victory_condition(game);
        next_turn(game);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeGame<'info> {
    #[account(init, payer = creator, space = 8 + Game::SPACE)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct JoinGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct MakeMove<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    pub player: Signer<'info>,
}

#[account]
pub struct Game {
    pub current_player: Pubkey,
    pub players: Vec<Pubkey>,
    pub turn: u8,
    pub state: GameState,
    pub territories: Vec<Territory>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Territory {
    pub id: u8,
    pub name: String,
    pub owner: Option<Pubkey>,
    pub troops: u8,
    pub adjacent_territories: Vec<u8>,
}

impl Game {
    pub const SPACE: usize = 32 + // current_player
                            32 * 6 + // players (max 6 players)
                            1 + // turn
                            1 + // state
                            1000; // territories (approximate space)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameState {
    Setup,
    InProgress,
    Completed,
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
}

// Helper functions
fn initialize_territories() -> Vec<Territory> {
    vec![
        Territory {
            id: 0,
            name: String::from("North America"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![1, 3],
        },
        Territory {
            id: 1,
            name: String::from("South America"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![0, 2],
        },
        Territory {
            id: 2,
            name: String::from("Africa"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![1, 4],
        },
        Territory {
            id: 3,
            name: String::from("Europe"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![0, 2, 4],
        },
        Territory {
            id: 4,
            name: String::from("Asia"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![2, 3, 5],
        },
        Territory {
            id: 5,
            name: String::from("Australia"),
            owner: None,
            troops: 0,
            adjacent_territories: vec![4],
        },
    ]
}

fn distribute_territories(game: &mut Game) {
    let seed: Vec<u8> = game.players.iter().flat_map(|p| p.to_bytes()).collect();

    let mut territories: Vec<_> = game.territories.iter_mut().collect();
    let player_count = game.players.len();

    for (i, territory) in territories.iter_mut().enumerate() {
        let player_index = (hash_to_index(&seed, i) % player_count) as usize;
        territory.owner = Some(game.players[player_index]);
        territory.troops = 3; // Initial troops per territory
    }
}

fn hash_to_index(seed: &[u8], counter: usize) -> usize {
    let mut hasher = std::collections::hash_map::DefaultHasher::new();
    seed.hash(&mut hasher);
    counter.hash(&mut hasher);
    std::hash::Hasher::finish(&hasher) as usize
}

fn next_turn(game: &mut Game) {
    let current_index = game
        .players
        .iter()
        .position(|p| *p == game.current_player)
        .unwrap();
    game.current_player = game.players[(current_index + 1) % game.players.len()];
    game.turn += 1;
}

fn check_victory_condition(game: &mut Game) {
    let first_owner = game.territories[0].owner;
    if game.territories.iter().all(|t| t.owner == first_owner) {
        game.state = GameState::Completed;
        if let Some(winner) = first_owner {
            game.current_player = winner;
        }
    }
}
