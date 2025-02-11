use anchor_lang::prelude::*;

declare_id!("2cdfpKZqQxfHKwtZ8WckqdYCT2CHAUaLMkzv1E5CktyQ");

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
    use anchor_lang::solana_program::instruction::AccountMeta;

    pub fn update_territory<'info>(
        program: AccountInfo<'info>,
        territory_state: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        territory_id: u8,
        owner: Option<Pubkey>,
        troops: u8,
    ) -> Result<()> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: program.key(),
            accounts: vec![
                AccountMeta::new(territory_state.key(), false),
                AccountMeta::new_readonly(authority.key(), true),
            ],
            data: anchor_lang::InstructionData::data(&UpdateTerritoryArgs {
                territory_id,
                owner,
                troops,
            }),
        };

        anchor_lang::solana_program::program::invoke_signed(&ix, &[territory_state, authority], &[])
            .map_err(Into::into)
    }

    pub fn are_territories_connected<'info>(
        program: AccountInfo<'info>,
        territory_state: AccountInfo<'info>,
        start: u8,
        end: u8,
        owner: Pubkey,
    ) -> Result<bool> {
        let ix = anchor_lang::solana_program::instruction::Instruction {
            program_id: program.key(),
            accounts: vec![AccountMeta::new(territory_state.key(), false)],
            data: anchor_lang::InstructionData::data(&AreTerritoriesConnectedArgs {
                start,
                end,
                owner,
            }),
        };

        anchor_lang::solana_program::program::invoke_signed(&ix, &[territory_state], &[])
            .map(|_| true)
            .map_err(Into::into)
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct UpdateTerritoryArgs {
        pub territory_id: u8,
        pub owner: Option<Pubkey>,
        pub troops: u8,
    }

    impl anchor_lang::InstructionData for UpdateTerritoryArgs {}

    impl anchor_lang::Discriminator for UpdateTerritoryArgs {
        const DISCRIMINATOR: [u8; 8] = [0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8];
    }

    #[derive(AnchorSerialize, AnchorDeserialize)]
    pub struct AreTerritoriesConnectedArgs {
        pub start: u8,
        pub end: u8,
        pub owner: Pubkey,
    }

    impl anchor_lang::InstructionData for AreTerritoriesConnectedArgs {}

    impl anchor_lang::Discriminator for AreTerritoriesConnectedArgs {
        const DISCRIMINATOR: [u8; 8] = [0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8, 0u8];
    }
}
