export type Territory = {
  "version": "0.1.0",
  "name": "territory",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "territoryState",
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
          "name": "gamePubkey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateTerritory",
      "accounts": [
        {
          "name": "territoryState",
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
          "name": "territoryId",
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
        }
      ]
    },
    {
      "name": "getContinentBonus",
      "accounts": [
        {
          "name": "territoryState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "continentId",
          "type": "u8"
        }
      ],
      "returns": "u8"
    },
    {
      "name": "areTerritoriesConnected",
      "accounts": [
        {
          "name": "territoryState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u8"
        },
        {
          "name": "end",
          "type": "u8"
        },
        {
          "name": "owner",
          "type": "publicKey"
        }
      ],
      "returns": "bool"
    }
  ],
  "accounts": [
    {
      "name": "territoryState",
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
      "name": "UpdateTerritoryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
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
          }
        ]
      }
    },
    {
      "name": "AreTerritoriesConnectedArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "start",
            "type": "u8"
          },
          {
            "name": "end",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    }
  ]
};

export const IDL: Territory = {
  "version": "0.1.0",
  "name": "territory",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "territoryState",
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
          "name": "gamePubkey",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "updateTerritory",
      "accounts": [
        {
          "name": "territoryState",
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
          "name": "territoryId",
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
        }
      ]
    },
    {
      "name": "getContinentBonus",
      "accounts": [
        {
          "name": "territoryState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "continentId",
          "type": "u8"
        }
      ],
      "returns": "u8"
    },
    {
      "name": "areTerritoriesConnected",
      "accounts": [
        {
          "name": "territoryState",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "start",
          "type": "u8"
        },
        {
          "name": "end",
          "type": "u8"
        },
        {
          "name": "owner",
          "type": "publicKey"
        }
      ],
      "returns": "bool"
    }
  ],
  "accounts": [
    {
      "name": "territoryState",
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
      "name": "UpdateTerritoryArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "territoryId",
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
          }
        ]
      }
    },
    {
      "name": "AreTerritoriesConnectedArgs",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "start",
            "type": "u8"
          },
          {
            "name": "end",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "publicKey"
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
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAuthority",
      "msg": "Invalid authority"
    }
  ]
};
