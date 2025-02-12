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
              "defined": "TerritoryPlacement"
            }
          }
        }
      ]
    },
    {
      "name": "attack",
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
          "name": "fromTerritory",
          "type": "u8"
        },
        {
          "name": "toTerritory",
          "type": "u8"
        },
        {
          "name": "attackingDice",
          "type": "u8"
        }
      ]
    },
    {
      "name": "endPhase",
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
      "name": "tradeCards",
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
          "name": "cardIndices",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "distributeInitialTerritories",
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
      "name": "fortify",
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
          "name": "fromTerritory",
          "type": "u8"
        },
        {
          "name": "toTerritory",
          "type": "u8"
        },
        {
          "name": "troops",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
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
      "name": "territoryAccount",
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
      "name": "playerAccount",
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
            "type": "bytes"
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
            "type": "bytes"
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
            "type": "bytes"
          },
          {
            "name": "defender",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "TerritoryPlacement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
            "type": "u8"
          },
          {
            "name": "troops",
            "type": "u8"
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

export const IDL: RiskGame = {
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
              "defined": "TerritoryPlacement"
            }
          }
        }
      ]
    },
    {
      "name": "attack",
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
          "name": "fromTerritory",
          "type": "u8"
        },
        {
          "name": "toTerritory",
          "type": "u8"
        },
        {
          "name": "attackingDice",
          "type": "u8"
        }
      ]
    },
    {
      "name": "endPhase",
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
      "name": "tradeCards",
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
          "name": "cardIndices",
          "type": "bytes"
        }
      ]
    },
    {
      "name": "distributeInitialTerritories",
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
      "name": "fortify",
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
          "name": "fromTerritory",
          "type": "u8"
        },
        {
          "name": "toTerritory",
          "type": "u8"
        },
        {
          "name": "troops",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "game",
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
      "name": "territoryAccount",
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
      "name": "playerAccount",
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
            "type": "bytes"
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
            "type": "bytes"
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
            "type": "bytes"
          },
          {
            "name": "defender",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "TerritoryPlacement",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
            "type": "u8"
          },
          {
            "name": "troops",
            "type": "u8"
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
