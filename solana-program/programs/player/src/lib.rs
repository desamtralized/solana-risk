use anchor_lang::prelude::*;
use anchor_lang::solana_program;

declare_id!("31axM9hfTEAvD9Kx8CUQCHXdETYBK8L3Pnzf7usQutbB");

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

    #[derive(Accounts)]
    pub struct AddPlayerCpi<'info> {
        #[account(mut)]
        pub player_state: Account<'info, PlayerState>,
        pub authority: Signer<'info>,
    }

    #[derive(Accounts)]
    pub struct UpdatePlayerCardsCpi<'info> {
        #[account(mut)]
        pub player_state: Account<'info, PlayerState>,
        pub authority: Signer<'info>,
    }

    #[derive(Accounts)]
    pub struct SetConqueredTerritoryCpi<'info> {
        #[account(mut)]
        pub player_state: Account<'info, PlayerState>,
        pub authority: Signer<'info>,
    }

    pub fn add_player<'info>(
        cpi_ctx: CpiContext<'_, '_, '_, 'info, AddPlayerCpi<'info>>,
        new_player: Player,
    ) -> Result<()> {
        let accounts = cpi_ctx.to_account_metas(None);
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: cpi_ctx.program.key(),
            accounts,
            data: anchor_lang::InstructionData::data(&crate::instruction::AddPlayer {
                new_player,
            }),
        };
        
        solana_program::program::invoke_signed(
            &ix,
            &[
                cpi_ctx.accounts.player_state.to_account_info(),
                cpi_ctx.accounts.authority.to_account_info(),
            ],
            cpi_ctx.signer_seeds,
        ).map_err(Into::into)
    }

    pub fn update_player_cards<'info>(
        cpi_ctx: CpiContext<'_, '_, '_, 'info, UpdatePlayerCardsCpi<'info>>,
        player_pubkey: Pubkey,
        cards: Vec<Card>,
    ) -> Result<()> {
        let accounts = cpi_ctx.to_account_metas(None);
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: cpi_ctx.program.key(),
            accounts,
            data: anchor_lang::InstructionData::data(&crate::instruction::UpdatePlayerCards {
                player_pubkey,
                cards,
            }),
        };
        
        solana_program::program::invoke_signed(
            &ix,
            &[
                cpi_ctx.accounts.player_state.to_account_info(),
                cpi_ctx.accounts.authority.to_account_info(),
            ],
            cpi_ctx.signer_seeds,
        ).map_err(Into::into)
    }

    pub fn set_conquered_territory<'info>(
        cpi_ctx: CpiContext<'_, '_, '_, 'info, SetConqueredTerritoryCpi<'info>>,
        player_pubkey: Pubkey,
        conquered_this_turn: bool,
    ) -> Result<()> {
        let accounts = cpi_ctx.to_account_metas(None);
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: cpi_ctx.program.key(),
            accounts,
            data: anchor_lang::InstructionData::data(&crate::instruction::SetConqueredTerritory {
                player_pubkey,
                conquered_this_turn,
            }),
        };
        
        solana_program::program::invoke_signed(
            &ix,
            &[
                cpi_ctx.accounts.player_state.to_account_info(),
                cpi_ctx.accounts.authority.to_account_info(),
            ],
            cpi_ctx.signer_seeds,
        ).map_err(Into::into)
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct AddPlayerArgs {
        pub new_player: Player,
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct UpdatePlayerCardsArgs {
        pub player_pubkey: Pubkey,
        pub cards: Vec<Card>,
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct SetConqueredTerritoryArgs {
        pub player_pubkey: Pubkey,
        pub conquered_this_turn: bool,
    }
}
