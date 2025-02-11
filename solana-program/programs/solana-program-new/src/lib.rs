use anchor_lang::prelude::*;

declare_id!("5FDsqVcV8xgdNR4d3iqs9TwUBddSxUfhN2Dte9oWj5We");

#[program]
pub mod solana_program_new {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
