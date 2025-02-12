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

export const PLAYER_PROGRAM_ID = new PublicKey("31axM9hfTEAvD9Kx8CUQCHXdETYBK8L3Pnzf7usQutbB");
export const TERRITORY_PROGRAM_ID = new PublicKey("A3MkCuY8bq8MkoD62dBu9n6e54PLxuK8u6vpopExApMg");
export const GAME_PROGRAM_ID = new PublicKey("7WWspBhgdSxJHdvuBXsBffFM4Ls6LwtXjYeZ4o6T7kry");
export const TERRITORY_PROGRAM_ID_OLD = "A3MkCuY8bq8MkoD62dBu9n6e54PLxuK8u6vpopExApMg";
export const PLAYER_PROGRAM_ID_OLD = "31axM9hfTEAvD9Kx8CUQCHXdETYBK8L3Pnzf7usQutbB"; 