use anchor_lang::prelude::*;
use anchor_lang::solana_program;

declare_id!("A3MkCuY8bq8MkoD62dBu9n6e54PLxuK8u6vpopExApMg");

#[program]
pub mod territory {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        territories: Vec<Territory>,
        continents: Vec<Continent>,
        game_pubkey: Pubkey,
    ) -> Result<()> {
        let territory_state = &mut ctx.accounts.territory_state;
        territory_state.territories = territories;
        territory_state.continents = continents;
        territory_state.game = game_pubkey;
        territory_state.authority = ctx.accounts.authority.key();
        Ok(())
    }

    pub fn update_territory(
        ctx: Context<UpdateTerritory>,
        territory_id: u8,
        owner: Option<Pubkey>,
        troops: u8,
    ) -> Result<()> {
        let territory_state = &mut ctx.accounts.territory_state;
        require!(
            territory_state.authority == ctx.accounts.authority.key(),
            TerritoryError::InvalidAuthority
        );

        let territory = &mut territory_state.territories[territory_id as usize];
        territory.owner = owner;
        territory.troops = troops;
        Ok(())
    }

    pub fn get_continent_bonus(ctx: Context<GetBonus>, continent_id: u8) -> Result<u8> {
        let territory_state = &ctx.accounts.territory_state;
        let continent = &territory_state.continents[continent_id as usize];
        Ok(continent.bonus_armies)
    }

    pub fn are_territories_connected(
        ctx: Context<CheckConnection>,
        start: u8,
        end: u8,
        owner: Pubkey,
    ) -> Result<bool> {
        let territory_state = &ctx.accounts.territory_state;
        let mut visited = vec![false; territory_state.territories.len()];
        let mut stack = vec![start];
        visited[start as usize] = true;

        while let Some(current) = stack.pop() {
            if current == end {
                return Ok(true);
            }

            for &adj in &territory_state.territories[current as usize].adjacent_territories {
                if !visited[adj as usize]
                    && territory_state.territories[adj as usize].owner == Some(owner)
                {
                    visited[adj as usize] = true;
                    stack.push(adj);
                }
            }
        }

        Ok(false)
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + TerritoryState::SPACE)]
    pub territory_state: Account<'info, TerritoryState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTerritory<'info> {
    #[account(mut)]
    pub territory_state: Account<'info, TerritoryState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetBonus<'info> {
    pub territory_state: Account<'info, TerritoryState>,
}

#[derive(Accounts)]
pub struct CheckConnection<'info> {
    pub territory_state: Account<'info, TerritoryState>,
}

#[account]
pub struct TerritoryState {
    pub territories: Vec<Territory>,
    pub continents: Vec<Continent>,
    pub game: Pubkey,
    pub authority: Pubkey,
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

impl TerritoryState {
    pub const SPACE: usize = 4 + (50 * 42) + // territories vec (42 territories, ~50 bytes each)
        4 + (20 * 6) + // continents vec (6 continents, ~20 bytes each)
        32 + // game pubkey
        32; // authority pubkey
}

#[error_code]
pub enum TerritoryError {
    #[msg("Invalid authority")]
    InvalidAuthority,
}

// CPI Interface
#[cfg(feature = "cpi")]
pub mod cpi_interface {
    use super::*;

    #[derive(Accounts)]
    pub struct UpdateTerritoryCpi<'info> {
        #[account(mut)]
        pub territory_state: Account<'info, TerritoryState>,
        pub authority: Signer<'info>,
    }

    #[derive(Accounts)]
    pub struct AreTerritoriesConnectedCpi<'info> {
        pub territory_state: Account<'info, TerritoryState>,
    }

    pub fn update_territory<'info>(
        cpi_ctx: CpiContext<'_, '_, '_, 'info, UpdateTerritoryCpi<'info>>,
        territory_id: u8,
        owner: Option<Pubkey>,
        troops: u8,
    ) -> Result<()> {
        let accounts = cpi_ctx.to_account_metas(None);
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: cpi_ctx.program.key(),
            accounts,
            data: anchor_lang::InstructionData::data(&crate::instruction::UpdateTerritory {
                territory_id,
                owner,
                troops,
            }),
        };
        
        solana_program::program::invoke_signed(
            &ix,
            &[
                cpi_ctx.accounts.territory_state.to_account_info(),
                cpi_ctx.accounts.authority.to_account_info(),
            ],
            cpi_ctx.signer_seeds,
        ).map_err(Into::into)
    }

    pub fn are_territories_connected<'info>(
        cpi_ctx: CpiContext<'_, '_, '_, 'info, AreTerritoriesConnectedCpi<'info>>,
        start: u8,
        end: u8,
        owner: Pubkey,
    ) -> Result<bool> {
        let accounts = cpi_ctx.to_account_metas(None);
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: cpi_ctx.program.key(),
            accounts,
            data: anchor_lang::InstructionData::data(&crate::instruction::AreTerritoriesConnected {
                start,
                end,
                owner,
            }),
        };

        solana_program::program::invoke_signed(
            &ix,
            &[cpi_ctx.accounts.territory_state.to_account_info()],
            cpi_ctx.signer_seeds,
        ).map(|_| true).map_err(Into::into)
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct UpdateTerritoryArgs {
        pub territory_id: u8,
        pub owner: Option<Pubkey>,
        pub troops: u8,
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct AreTerritoriesConnectedArgs {
        pub start: u8,
        pub end: u8,
        pub owner: Pubkey,
    }
}
