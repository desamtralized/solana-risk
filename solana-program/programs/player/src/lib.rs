use anchor_lang::prelude::*;

declare_id!("Crw8PgBMPQ8xHmLnT7oMdp4ePpAcHHPyZeJXZQmAU6Lf");

#[program]
pub mod player {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        game_pubkey: Pubkey,
        initial_player: Player,
    ) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        player_state.players = vec![initial_player];
        player_state.game = game_pubkey;
        player_state.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn add_player(ctx: Context<UpdatePlayers>, new_player: Player) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        require!(
            player_state.authority == ctx.accounts.authority.key(),
            PlayerError::InvalidAuthority
        );

        player_state.players.push(new_player);
        Ok(())
    }

    pub fn update_player_cards(
        ctx: Context<UpdatePlayers>,
        player_pubkey: Pubkey,
        cards: Vec<Card>,
    ) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        require!(
            player_state.authority == ctx.accounts.authority.key(),
            PlayerError::InvalidAuthority
        );

        if let Some(player) = player_state
            .players
            .iter_mut()
            .find(|p| p.pubkey == player_pubkey)
        {
            player.cards = cards;
            Ok(())
        } else {
            Err(PlayerError::PlayerNotFound.into())
        }
    }

    pub fn set_conquered_territory(
        ctx: Context<UpdatePlayers>,
        player_pubkey: Pubkey,
        conquered_this_turn: bool,
    ) -> Result<()> {
        let player_state = &mut ctx.accounts.player_state;
        require!(
            player_state.authority == ctx.accounts.authority.key(),
            PlayerError::InvalidAuthority
        );

        if let Some(player) = player_state
            .players
            .iter_mut()
            .find(|p| p.pubkey == player_pubkey)
        {
            player.conquered_territory_this_turn = conquered_this_turn;
            Ok(())
        } else {
            Err(PlayerError::PlayerNotFound.into())
        }
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + PlayerState::SPACE)]
    pub player_state: Account<'info, PlayerState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePlayers<'info> {
    #[account(mut)]
    pub player_state: Account<'info, PlayerState>,
    pub authority: Signer<'info>,
}

#[account]
pub struct PlayerState {
    pub players: Vec<Player>,
    pub game: Pubkey,
    pub authority: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Player {
    pub pubkey: Pubkey,
    pub color: String,
    pub cards: Vec<Card>,
    pub conquered_territory_this_turn: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Card {
    pub territory_id: u8,
    pub card_type: CardType,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum CardType {
    Infantry,
    Cavalry,
    Artillery,
    Wild,
}

impl PlayerState {
    pub const SPACE: usize = 4 + (6 * 100) + // players vec (6 players max, ~100 bytes each)
        32 + // game pubkey
        32; // authority pubkey
}

#[error_code]
pub enum PlayerError {
    #[msg("Invalid authority")]
    InvalidAuthority,
    #[msg("Player not found")]
    PlayerNotFound,
}

// Rename CPI module
#[cfg(feature = "cpi")]
pub mod cpi_interface {
    use super::*;
    use anchor_lang::solana_program::instruction::AccountMeta;

    pub fn add_player<'info>(
        program: AccountInfo<'info>,
        player_state: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        new_player: Player,
    ) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: program.key(),
            accounts: vec![
                AccountMeta::new(player_state.key(), false),
                AccountMeta::new_readonly(authority.key(), true),
            ],
            data: anchor_lang::InstructionData::data(&AddPlayerArgs { new_player }),
        };

        anchor_lang::solana_program::program::invoke_signed(&ix, &[player_state, authority], &[])
            .map_err(Into::into)
    }

    pub fn update_player_cards<'info>(
        program: AccountInfo<'info>,
        player_state: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        player_pubkey: Pubkey,
        cards: Vec<Card>,
    ) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: program.key(),
            accounts: vec![
                AccountMeta::new(player_state.key(), false),
                AccountMeta::new_readonly(authority.key(), true),
            ],
            data: anchor_lang::InstructionData::data(&UpdatePlayerCardsArgs {
                player_pubkey,
                cards,
            }),
        };

        anchor_lang::solana_program::program::invoke_signed(&ix, &[player_state, authority], &[])
            .map_err(Into::into)
    }

    pub fn set_conquered_territory<'info>(
        program: AccountInfo<'info>,
        player_state: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        player_pubkey: Pubkey,
        conquered_this_turn: bool,
    ) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: program.key(),
            accounts: vec![
                AccountMeta::new(player_state.key(), false),
                AccountMeta::new_readonly(authority.key(), true),
            ],
            data: anchor_lang::InstructionData::data(&SetConqueredTerritoryArgs {
                player_pubkey,
                conquered_this_turn,
            }),
        };

        anchor_lang::solana_program::program::invoke_signed(&ix, &[player_state, authority], &[])
            .map_err(Into::into)
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct AddPlayerArgs {
        pub new_player: Player,
    }

    impl anchor_lang::InstructionData for AddPlayerArgs {}

    impl anchor_lang::Discriminator for AddPlayerArgs {
        const DISCRIMINATOR: [u8; 8] = [0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8];
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct UpdatePlayerCardsArgs {
        pub player_pubkey: Pubkey,
        pub cards: Vec<Card>,
    }

    impl anchor_lang::InstructionData for UpdatePlayerCardsArgs {}

    impl anchor_lang::Discriminator for UpdatePlayerCardsArgs {
        const DISCRIMINATOR: [u8; 8] = [0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8];
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct SetConqueredTerritoryArgs {
        pub player_pubkey: Pubkey,
        pub conquered_this_turn: bool,
    }

    impl anchor_lang::InstructionData for SetConqueredTerritoryArgs {}

    impl anchor_lang::Discriminator for SetConqueredTerritoryArgs {
        const DISCRIMINATOR: [u8; 8] = [0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8];
    }
}
