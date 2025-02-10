# Solana Risk Game

A decentralized implementation of the classic Risk board game built on the Solana blockchain. This project combines the strategic depth of Risk with the transparency and fairness of blockchain technology.

## Project Overview

The Solana Risk Game is a fully decentralized version of the classic Risk board game where all game logic and state management are handled on the Solana blockchain. Players can join games, manage territories, engage in battles, and earn rewards in a trustless environment.

### Key Features

- Decentralized game logic and state management on Solana blockchain
- Real-time interactive game map with territory control visualization
- Secure territory ownership and troop management
- Blockchain-based combat resolution system
- Wallet integration for secure player authentication
- Modern, responsive user interface built with Next.js

## Repository Structure

This monorepo contains two main components:

- `frontend/`: Next.js web application that provides the user interface and game interaction
- `solana-program/`: Solana smart contract written in Rust using the Anchor framework

## Environment Setup

### Prerequisites

1. Install Node.js (v16 or later):
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 16
   nvm use 16
   ```

2. Install Rust and Cargo:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

3. Install Solana CLI tools:
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
   ```

4. Install Anchor Framework:
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install latest
   avm use latest
   ```

5. Install Phantom Wallet browser extension

### Development Setup

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
   cp .env.example .env.local
   # Edit .env.local with your deployed program ID
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Make changes to the Solana program
2. Build and deploy the program to devnet
3. Update the program ID in the frontend environment
4. Test the changes through the frontend interface

## Testing

### Solana Program Tests
```bash
cd solana-program
anchor test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Documentation

- For detailed frontend documentation, see [frontend/README.md](frontend/README.md)
- For Solana program documentation, see [solana-program/README.md](solana-program/README.md)

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch
3. Write tests for new features
4. Commit your changes
5. Push to the branch
6. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support:
- Open an issue in the repository
- Join our Discord community (coming soon)
- Check the documentation in the respective component directories 