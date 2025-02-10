# Solana Risk Game

A decentralized implementation of the classic Risk board game built on the Solana blockchain. This project combines the strategic depth of Risk with the transparency and fairness of blockchain technology.

## Project Overview

This project implements a fully decentralized version of the Risk board game where all game logic and state management are handled on the Solana blockchain. Players can join games, manage territories, engage in battles, and earn rewards in a trustless environment.

### Key Features

- Decentralized game logic and state management
- Real-time interactive game map
- Territory control and troop management
- Blockchain-based combat resolution
- Wallet integration for player authentication
- Modern, responsive user interface

## Repository Structure

This is a monorepo containing two main components:

- `frontend/`: Next.js web application that provides the user interface
- `solana-program/`: Solana smart contract written in Rust using Anchor

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/solana-risk.git
   cd solana-risk
   ```

2. Set up the Solana program:
   ```bash
   cd solana-program
   npm install
   anchor build
   anchor deploy
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. Create frontend environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your deployed program ID
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Prerequisites

- Node.js 16+ and npm
- Rust and Cargo
- Solana CLI tools (v1.17.0 or later)
- Anchor Framework (v0.28.0 or later)
- Phantom Wallet browser extension

## Documentation

- Frontend documentation is available in the [frontend/README.md](frontend/README.md)
- Solana program documentation is available in the [solana-program/README.md](solana-program/README.md)

## Development Workflow

1. Make changes to the Solana program
2. Build and deploy the program to devnet
3. Update the program ID in the frontend environment
4. Test the changes through the frontend interface

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions and support, please open an issue in the repository. 
