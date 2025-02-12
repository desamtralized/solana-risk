import { PublicKey } from '@solana/web3.js';

if (!process.env.NEXT_PUBLIC_PLAYER_PROGRAM_ID) {
  throw new Error('NEXT_PUBLIC_PLAYER_PROGRAM_ID environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_TERRITORY_PROGRAM_ID) {
  throw new Error('NEXT_PUBLIC_TERRITORY_PROGRAM_ID environment variable is not set');
}

if (!process.env.NEXT_PUBLIC_GAME_PROGRAM_ID) {
  throw new Error('NEXT_PUBLIC_GAME_PROGRAM_ID environment variable is not set');
}

export const PLAYER_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PLAYER_PROGRAM_ID);
export const TERRITORY_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_TERRITORY_PROGRAM_ID);
export const GAME_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_GAME_PROGRAM_ID); 