import { PublicKey } from '@solana/web3.js';

export const PLAYER_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PLAYER_PROGRAM_ID || '2TcRcBCwoYbEuidD1DDaL2rn5MRarM473Hjx6yBv28Sm'
);

export const TERRITORY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_TERRITORY_PROGRAM_ID || '4SK3vbMtEHJEU9VyoEFTJkWwjAb4CFCF1zgWdPon2w3z'
);

export const GAME_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_GAME_PROGRAM_ID || 'BkFXBJBnzYRDEcpqB1tmkMfNMePsYcP4jNFAdVM3XVsZ'
); 