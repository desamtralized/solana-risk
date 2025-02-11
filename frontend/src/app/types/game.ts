import { PublicKey } from "@solana/web3.js";

export enum GameState {
  Initializing = "Initializing",
  Setup = "Setup",
  InProgress = "InProgress",
  Completed = "Completed"
}

export enum TurnPhase {
  Reinforcement = "Reinforcement",
  Attack = "Attack",
  Fortification = "Fortification"
}

export enum PlayerColor {
  Red = "Red",
  Blue = "Blue",
  Green = "Green",
  Yellow = "Yellow",
  Purple = "Purple",
  Orange = "Orange"
}

export enum CardType {
  Infantry = "Infantry",
  Cavalry = "Cavalry",
  Artillery = "Artillery",
  Wild = "Wild"
}

export interface RiskCard {
  type: CardType;
  territoryId?: number; // Optional as wild cards don't have territories
}

export interface Player {
  publicKey: PublicKey;
  color: PlayerColor;
  cards: RiskCard[];
  conqueredTerritoryThisTurn: boolean;
}

export interface Territory {
  id: number;
  name: string;
  owner: PublicKey | null;
  troops: number;
  adjacentTerritories: number[];
  continent: string;
}

export interface Continent {
  name: string;
  territories: number[]; // Array of territory IDs
  bonusArmies: number;
}

export interface GameAccount {
  currentPlayer: PublicKey;
  players: Player[];
  turn: number;
  state: GameState;
  currentPhase: TurnPhase;
  territories: Territory[];
  continents: Continent[];
  cardsSetsTurnedIn: number;
  lastAttackDice: {
    attacker: number[];
    defender: number[];
  } | null;
  pendingReinforcements: number | null;
  territoryAccount: PublicKey;
  playerAccount: PublicKey;
}

export const CONTINENTS: Continent[] = [
  {
    name: "North America",
    territories: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    bonusArmies: 5
  },
  {
    name: "South America",
    territories: [9, 10, 11, 12],
    bonusArmies: 2
  },
  {
    name: "Europe",
    territories: [13, 14, 15, 16, 17, 18, 19],
    bonusArmies: 5
  },
  {
    name: "Africa",
    territories: [20, 21, 22, 23, 24, 25],
    bonusArmies: 3
  },
  {
    name: "Asia",
    territories: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    bonusArmies: 7
  },
  {
    name: "Australia",
    territories: [37, 38, 39, 40, 41],
    bonusArmies: 2
  }
];

export const TERRITORY_COORDINATES: Record<string, [number, number][]> = {
  "North America": [
    [75, -170], // Alaska
    [75, -100], // Northwest Territory
    [75, -40],  // Greenland
    [45, -170], // Western edge
    [45, -40],  // Eastern edge
    [30, -170], // Southern edge
    [30, -40]   // Southern edge
  ],
  "South America": [
    [10, -85],  // Northern edge
    [10, -35],  // Northern edge
    [-55, -75], // Southern edge
    [-55, -35]  // Southern edge
  ],
  "Europe": [
    [70, -25],  // Iceland
    [70, 40],   // Northern edge
    [45, -10],  // Western edge
    [45, 40]    // Eastern edge
  ],
  "Africa": [
    [35, -15],  // Northern edge
    [35, 50],   // Northern edge
    [-35, 50],  // Southern edge
    [-35, -15]  // Southern edge
  ],
  "Asia": [
    [75, 40],   // Northern edge
    [75, 170],  // Northern edge
    [15, 170],  // Southern edge
    [15, 40]    // Southern edge
  ],
  "Australia": [
    [-10, 110], // Northern edge
    [-10, 180], // Northern edge
    [-45, 180], // Southern edge
    [-45, 110]  // Southern edge
  ]
}; 