export type Player = {
  "version": "0.1.0",
  "name": "player",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "playerState",
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
      "args": [
        {
          "name": "gamePubkey",
          "type": "publicKey"
        },
        {
          "name": "initialPlayer",
          "type": {
            "defined": "Player"
          }
        }
      ]
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newPlayer",
          "type": {
            "defined": "Player"
          }
        }
      ]
    },
    {
      "name": "updatePlayerCards",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "playerPubkey",
          "type": "publicKey"
        },
        {
          "name": "cards",
          "type": {
            "vec": {
              "defined": "Card"
            }
          }
        }
      ]
    },
    {
      "name": "setConqueredTerritory",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "playerPubkey",
          "type": "publicKey"
        },
        {
          "name": "conqueredThisTurn",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "playerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "vec": {
                "defined": "Player"
              }
            }
          },
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddPlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newPlayer",
            "type": {
              "defined": "Player"
            }
          }
        ]
      }
    },
    {
      "name": "UpdatePlayerCardsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerPubkey",
            "type": "publicKey"
          },
          {
            "name": "cards",
            "type": {
              "vec": {
                "defined": "Card"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetConqueredTerritoryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerPubkey",
            "type": "publicKey"
          },
          {
            "name": "conqueredThisTurn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "color",
            "type": "string"
          },
          {
            "name": "cards",
            "type": {
              "vec": {
                "defined": "Card"
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
      "name": "Card",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
            "type": "u8"
          },
          {
            "name": "cardType",
            "type": {
              "defined": "CardType"
            }
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
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6001,
      "name": "PlayerNotFound",
      "msg": "Player not found"
    }
  ]
};

export const IDL: Player = {
  "version": "0.1.0",
  "name": "player",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "playerState",
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
      "args": [
        {
          "name": "gamePubkey",
          "type": "publicKey"
        },
        {
          "name": "initialPlayer",
          "type": {
            "defined": "Player"
          }
        }
      ]
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newPlayer",
          "type": {
            "defined": "Player"
          }
        }
      ]
    },
    {
      "name": "updatePlayerCards",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "playerPubkey",
          "type": "publicKey"
        },
        {
          "name": "cards",
          "type": {
            "vec": {
              "defined": "Card"
            }
          }
        }
      ]
    },
    {
      "name": "setConqueredTerritory",
      "accounts": [
        {
          "name": "playerState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "playerPubkey",
          "type": "publicKey"
        },
        {
          "name": "conqueredThisTurn",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "playerState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "vec": {
                "defined": "Player"
              }
            }
          },
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "authority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AddPlayerArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "newPlayer",
            "type": {
              "defined": "Player"
            }
          }
        ]
      }
    },
    {
      "name": "UpdatePlayerCardsArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerPubkey",
            "type": "publicKey"
          },
          {
            "name": "cards",
            "type": {
              "vec": {
                "defined": "Card"
              }
            }
          }
        ]
      }
    },
    {
      "name": "SetConqueredTerritoryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "playerPubkey",
            "type": "publicKey"
          },
          {
            "name": "conqueredThisTurn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "Player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "pubkey",
            "type": "publicKey"
          },
          {
            "name": "color",
            "type": "string"
          },
          {
            "name": "cards",
            "type": {
              "vec": {
                "defined": "Card"
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
      "name": "Card",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
            "type": "u8"
          },
          {
            "name": "cardType",
            "type": {
              "defined": "CardType"
            }
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
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6001,
      "name": "PlayerNotFound",
      "msg": "Player not found"
    }
  ]
};
