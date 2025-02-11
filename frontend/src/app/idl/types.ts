import { PublicKey } from '@solana/web3.js';
import { IDL as GameIDL } from './game';
import { IDL as PlayerIDL } from './player';
import { IDL as TerritoryIDL } from './territory';

// Define the tuple type for (u8,u8)
export type U8Tuple = [number, number];

export type RiskGame = typeof GameIDL;
export type Player = typeof PlayerIDL;
export type Territory = typeof TerritoryIDL;

export { GameIDL, PlayerIDL, TerritoryIDL };

// Game account types
export interface GameAccount {
  currentPlayer: PublicKey;
  turn: number;
  state: GameState;
  currentPhase: TurnPhase;
  cardsSetsTurnedIn: number;
  lastAttackDice: AttackDice | null;
  pendingReinforcements: number | null;
  territoryAccount: PublicKey;
  playerAccount: PublicKey;
}

export enum GameState {
  Setup = 'Setup',
  InProgress = 'InProgress',
  Completed = 'Completed'
}

export enum TurnPhase {
  Reinforcement = 'Reinforcement',
  Attack = 'Attack',
  Fortification = 'Fortification'
}

export interface AttackDice {
  attacker: number[];
  defender: number[];
}

export interface RiskCard {
  type: CardType;
  territoryId?: number;
}

export enum CardType {
  Infantry = 'Infantry',
  Cavalry = 'Cavalry',
  Artillery = 'Artillery',
  Wild = 'Wild'
} 