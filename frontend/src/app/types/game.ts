import { PublicKey } from "@solana/web3.js";

export enum GameState {
  Setup = "Setup",
  InProgress = "InProgress",
  Completed = "Completed"
}

export interface Territory {
  id: number;
  name: string;
  owner: PublicKey | null;
  troops: number;
  adjacentTerritories: number[];
}

export interface GameAccount {
  currentPlayer: PublicKey;
  players: PublicKey[];
  turn: number;
  state: GameState;
  territories: Territory[];
}

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