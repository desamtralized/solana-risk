import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { GameAccount } from '../types/game';
import IDL from './risk_game.json';

// Custom error class for game-specific errors
export class GameError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'GameError';
  }
}

// Program ID from Anchor.toml
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || 'G4irLCSNHfxh2eCVpXowciffLtbnwGm1mGXU28afPsPJ');

export class GameService {
  private program: Program;

  constructor(
    connection: Connection,
    wallet: AnchorWallet
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });
    this.program = new Program(IDL as Idl, PROGRAM_ID, provider);
  }

  async initializeGame(): Promise<{ gameAccount: PublicKey }> {
    try {
      // Create a new keypair for the game account
      const gameKeypair = Keypair.generate();
      
      await this.program.methods
        .initializeGame()
        .accounts({
          game: gameKeypair.publicKey,
          creator: this.program.provider.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([gameKeypair])
        .rpc();

      return { gameAccount: gameKeypair.publicKey };
    } catch (error: unknown) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          throw new GameError('Insufficient SOL to create game. Please fund your wallet.', 'INSUFFICIENT_FUNDS');
        } else if (error.message.includes('Account not found')) {
          throw new GameError('Game account not found. Please try again.', 'ACCOUNT_NOT_FOUND');
        }
        throw new GameError(`Failed to initialize game: ${error.message}`, 'INITIALIZATION_FAILED');
      }
      throw new GameError('An unknown error occurred while initializing the game', 'UNKNOWN_ERROR');
    }
  }

  async joinGame(gameAccount: PublicKey): Promise<void> {
    await this.program.methods
      .joinGame()
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async placeTroops(
    gameAccount: PublicKey,
    territoryId: number,
    troops: number
  ): Promise<void> {
    await this.program.methods
      .placeTroops(territoryId, troops)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async makeMove(
    gameAccount: PublicKey,
    fromTerritory: number,
    toTerritory: number,
    troops: number
  ): Promise<void> {
    await this.program.methods
      .attackTerritory(fromTerritory, toTerritory, troops)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async getGameState(gameAccount: PublicKey): Promise<GameAccount> {
    const account = await this.program.account.game.fetch(gameAccount);
    return account as unknown as GameAccount;
  }
} 