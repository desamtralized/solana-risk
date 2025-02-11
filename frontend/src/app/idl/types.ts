import { Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

import gameIdl from './risk_game.json';
import playerIdl from './player.json';
import territoryIdl from './territory.json';

// Cast IDLs with type assertion to unknown first
export const GameIDL = gameIdl as unknown as Idl;
export const PlayerIDL = playerIdl as unknown as Idl;
export const TerritoryIDL = territoryIdl as unknown as Idl;

// Add this before the RiskGame type
export type TupleU8 = {
  "0": number;
  "1": number;
  length: 2;
};

// Re-export the types from the IDLs
export type RiskGame = {
  "version": "0.1.0",
  "name": "risk_game",
  "instructions": [
    {
      "name": "initializeGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "territoryAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        },
        {
          "name": "territories",
          "type": {
            "vec": {
              "defined": "Territory"
            }
          }
        },
        {
          "name": "continents",
          "type": {
            "vec": {
              "defined": "Continent"
            }
          }
        }
      ]
    },
    {
      "name": "joinGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "color",
          "type": "string"
        }
      ]
    },
    {
      "name": "startTurn",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "territoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "territoryProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "territoryState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "placeReinforcements",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "territoryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "territoryProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "territoryState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "playerProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "placements",
          "type": {
            "vec": {
              "defined": "(u8,u8)"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentPlayer",
            "type": "publicKey"
          },
          {
            "name": "turn",
            "type": "u8"
          },
          {
            "name": "state",
            "type": {
              "defined": "GameState"
            }
          },
          {
            "name": "currentPhase",
            "type": {
              "defined": "TurnPhase"
            }
          },
          {
            "name": "cardsSetsTurnedIn",
            "type": "u8"
          },
          {
            "name": "lastAttackDice",
            "type": {
              "option": {
                "defined": "AttackDice"
              }
            }
          },
          {
            "name": "pendingReinforcements",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "territoryAccount",
            "type": "publicKey"
          },
          {
            "name": "playerAccount",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "TerritoryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territories",
            "type": {
              "vec": {
                "defined": "Territory"
              }
            }
          },
          {
            "name": "continents",
            "type": {
              "vec": {
                "defined": "Continent"
              }
            }
          },
          {
            "name": "game",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "PlayerAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "vec": {
                "defined": "PlayerState"
              }
            }
          },
          {
            "name": "game",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "PlayerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "colorId",
            "type": "u8"
          },
          {
            "name": "cards",
            "type": {
              "vec": {
                "defined": "RiskCard"
              }
            }
          },
          {
            "name": "conqueredTerritoryThisTurn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Territory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "continentId",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "troops",
            "type": "u8"
          },
          {
            "name": "adjacentTerritories",
            "type": {
              "array": ["u8", 42]
            }
          }
        ]
      }
    },
    {
      "name": "Continent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "territories",
            "type": {
              "array": ["u8", 42]
            }
          },
          {
            "name": "bonusArmies",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RiskCard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "cardType",
            "type": {
              "defined": "CardType"
            }
          },
          {
            "name": "territoryId",
            "type": {
              "option": "u8"
            }
          }
        ]
      }
    },
    {
      "name": "AttackDice",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "attacker",
            "type": {
              "array": ["u8", 3]
            }
          },
          {
            "name": "defender",
            "type": {
              "array": ["u8", 2]
            }
          }
        ]
      }
    },
    {
      "name": "PlayerColor",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Red"
          },
          {
            "name": "Blue"
          },
          {
            "name": "Green"
          },
          {
            "name": "Yellow"
          },
          {
            "name": "Purple"
          },
          {
            "name": "Orange"
          }
        ]
      }
    },
    {
      "name": "GameState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Setup"
          },
          {
            "name": "InProgress"
          },
          {
            "name": "Completed"
          }
        ]
      }
    },
    {
      "name": "TurnPhase",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Reinforcement"
          },
          {
            "name": "Attack"
          },
          {
            "name": "Fortification"
          }
        ]
      }
    },
    {
      "name": "CardType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Infantry"
          },
          {
            "name": "Cavalry"
          },
          {
            "name": "Artillery"
          },
          {
            "name": "Wild"
          }
        ]
      }
    },
    {
      "name": "(u8,u8)",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "0",
            "type": "u8"
          },
          {
            "name": "1",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameAlreadyStarted"
    },
    {
      "code": 6001,
      "name": "GameNotInProgress"
    },
    {
      "code": 6002,
      "name": "NotPlayerTurn"
    },
    {
      "code": 6003,
      "name": "MaxPlayersReached"
    },
    {
      "code": 6004,
      "name": "NotTerritoryOwner"
    },
    {
      "code": 6005,
      "name": "InsufficientTroops"
    },
    {
      "code": 6006,
      "name": "CannotAttackOwnTerritory"
    },
    {
      "code": 6007,
      "name": "InvalidPhase"
    },
    {
      "code": 6008,
      "name": "InvalidCardSet"
    },
    {
      "code": 6009,
      "name": "InvalidDiceCount"
    },
    {
      "code": 6010,
      "name": "TerritoriesNotAdjacent"
    },
    {
      "code": 6011,
      "name": "NoRemainingMoves"
    },
    {
      "code": 6012,
      "name": "InvalidTroopCount"
    },
    {
      "code": 6013,
      "name": "CardLimitReached"
    },
    {
      "code": 6014,
      "name": "ColorAlreadyTaken"
    },
    {
      "code": 6015,
      "name": "NoReinforcements"
    },
    {
      "code": 6016,
      "name": "InvalidCardIndex"
    },
    {
      "code": 6017,
      "name": "TerritoriesNotConnected"
    },
    {
      "code": 6018,
      "name": "InvalidColor"
    }
  ]
};

export type Player = {
  "version": "0.1.0",
  "name": "player",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "player",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "reinforcements",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export type TerritoryProgram = {
  "version": "0.1.0",
  "name": "territory",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "territory",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "territory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "territories",
            "type": {
              "vec": {
                "defined": "Territory"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Territory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "troops",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export interface TerritoryPlacement {
  territoryId: number;
  troops: number;
}

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

export type GameState = 'Setup' | 'InProgress' | 'Completed';
export type TurnPhase = 'Reinforcement' | 'Attack' | 'Fortification';
export type CardType = 'Infantry' | 'Cavalry' | 'Artillery' | 'Wild';
export type PlayerColor = 'Red' | 'Blue' | 'Green' | 'Yellow' | 'Purple' | 'Orange';

export interface Territory {
  id: number;
  continentId: number;
  owner: PublicKey | null;
  troops: number;
  adjacentTerritories: number[];
}

export interface Continent {
  id: number;
  territories: number[];
  bonusArmies: number;
}

export interface RiskCard {
  cardType: CardType;
  territoryId: number | null;
}

export interface AttackDice {
  attacker: number[];
  defender: number[];
}

export interface PlayerState {
  pubkey: PublicKey;
  colorId: number;
  cards: RiskCard[];
  conqueredTerritoryThisTurn: boolean;
}

export interface TerritoryAccount {
  territories: Territory[];
  continents: Continent[];
  game: PublicKey;
}

export interface PlayerAccount {
  players: PlayerState[];
  game: PublicKey;
} 