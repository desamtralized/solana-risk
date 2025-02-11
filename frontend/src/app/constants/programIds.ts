import { PublicKey } from '@solana/web3.js';

export const PLAYER_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PLAYER_PROGRAM_ID || 'Crw8PgBMPQ8xHmLnT7oMdp4ePpAcHHPyZeJXZQmAU6Lf'
);

export const TERRITORY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_TERRITORY_PROGRAM_ID || '6YK2ZBHN2tCqbhYFPat3iLqYqSySSiVkMRjSfPUHS9sm'
);

export const GAME_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_GAME_PROGRAM_ID || '7GTG5YucwCqnmcHoeTVs8vwt9MhXjQdCXs8yToHpHPHC'
); 