import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { GameAccount } from '../types/game';
import IDL from './risk_game.json';

// Import the IDL (you'll need to generate this after building the program)
// import { RiskGame } from '../types/risk_game';

// Program ID from Anchor.toml
const PROGRAM_ID = new PublicKey('G4irLCSNHfxh2eCVpXowciffLtbnwGm1mGXU28afPsPJ');

export class GameService {
  private program: Program;

  constructor(
    connection: Connection,
    wallet: AnchorWallet
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    this.program = new Program(IDL as Idl, PROGRAM_ID, provider);
  }

  async initializeGame(): Promise<{ gameAccount: PublicKey }> {
    const gameAccount = PublicKey.unique();
    
    await this.program.methods
      .initializeGame()
      .accounts({
        game: gameAccount,
        creator: this.program.provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    return { gameAccount };
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