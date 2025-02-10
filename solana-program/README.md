# Solana Risk Game Program

A blockchain-based implementation of the Risk board game built on Solana blockchain. This program handles the game logic, state management, and player interactions on-chain.

## Overview

The Solana Risk Game program is a smart contract written in Rust using the Anchor framework. It manages the game state, validates moves, and ensures fair gameplay in a decentralized manner.

## Features

- Game state management on-chain
- Player authentication and turn management
- Territory ownership and troop placement
- Combat resolution system
- Move validation and game rules enforcement
- Territory adjacency verification

## Prerequisites

- Rust and Cargo
- Solana CLI tools (v1.17.0 or later)
- Anchor Framework (v0.28.0 or later)
- Node.js 16+ and npm
- Phantom Wallet browser extension

## Technical Architecture

The program consists of several key components:
- Game state management using PDA (Program Derived Addresses)
- Territory management system
- Combat resolution logic
- Player state tracking
- Turn-based action validation

## Setup and Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the program:
   ```bash
   anchor build
   ```

3. Deploy to devnet:
   ```bash
   anchor deploy
   ```

4. Run tests:
   ```bash
   anchor test
   ```

## Program Instructions

The program supports the following instructions:
- Initialize game
- Join game
- Place troops
- Attack territory
- Fortify position
- End turn
- Claim rewards

## State Management

The program uses the following account structures:
- Game Account: Stores global game state
- Player Account: Tracks individual player state
- Territory Account: Manages territory ownership and troops

## Security Considerations

- Program validation of all player actions
- Secure random number generation for combat
- Protection against common attack vectors
- Access control for game actions

## Testing

The program includes comprehensive tests:
- Unit tests for game logic
- Integration tests for instruction flow
- PDA validation tests
- Error condition tests

## Contributing

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Commit your changes
5. Push to the branch
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 