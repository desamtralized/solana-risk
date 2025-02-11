import { PublicKey } from "@solana/web3.js";

export enum GameState {
  Setup = "Setup",
  InProgress = "InProgress",
  Completed = "Completed"
}

export enum TurnPhase {
  Reinforcement = "Reinforcement",
  Attack = "Attack",
  Fortification = "Fortification"
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
  color: string;
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
  cardSetsTurnedIn: number; // To track increasing card set values
  lastAttackDice?: {
    attacker: number[];
    defender: number[];
  };
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
    [60, -140], [60, -60], [30, -60], [30, -140]
  ],
  "South America": [
    [10, -80], [10, -35], [-50, -35], [-50, -80]
  ],
  "Africa": [
    [35, -20], [35, 50], [-35, 50], [-35, -20]
  ],
  "Europe": [
    [70, -10], [70, 40], [45, 40], [45, -10]
  ],
  "Asia": [
    [70, 40], [70, 170], [0, 170], [0, 40]
  ],
  "Australia": [
    [-10, 110], [-10, 155], [-40, 155], [-40, 110]
  ]
}; 