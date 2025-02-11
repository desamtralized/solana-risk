import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { INITIAL_TERRITORIES } from '../constants/gameData';
import { GAME_PROGRAM_ID, PLAYER_PROGRAM_ID, TERRITORY_PROGRAM_ID } from '../constants/programIds';
import { GameIDL, PlayerIDL, TerritoryIDL, RiskGame, Player, Territory as TerritoryProgram, GameAccount } from '../idl/types';

// Custom error class for game-specific errors
export class GameError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'GameError';
  }
}

interface ProgramTerritory {
  id: number;
  continentId: number;
  owner: PublicKey | null;
  troops: number;
  adjacentTerritories: Buffer;
}

interface ProgramContinent {
  id: number;
  territories: Buffer;
  bonusArmies: number;
}

export class GameService {
  private program: Program<RiskGame>;
  private playerProgram: Program<Player>;
  private territoryProgram: Program<TerritoryProgram>;

  constructor(
    connection: Connection,
    wallet: AnchorWallet
  ) {
    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
      preflightCommitment: 'confirmed',
    });
    this.program = new Program(GameIDL, GAME_PROGRAM_ID, provider);
    this.playerProgram = new Program(PlayerIDL, PLAYER_PROGRAM_ID, provider);
    this.territoryProgram = new Program(TerritoryIDL, TERRITORY_PROGRAM_ID, provider);
  }

  private transformTerritories(territories: typeof INITIAL_TERRITORIES): ProgramTerritory[] {
    return territories.map(t => ({
      id: t.id,
      continentId: parseInt(t.continent),
      owner: null,
      troops: 0,
      adjacentTerritories: Buffer.from(t.adjacentTerritories),
    }));
  }

  private transformContinents(continents: { id: string; territories: number[]; bonusArmies: number }[]): ProgramContinent[] {
    return continents.map(c => ({
      id: parseInt(c.id),
      territories: Buffer.from(c.territories),
      bonusArmies: c.bonusArmies,
    }));
  }

  async initializeGame(playerColor: string): Promise<{ gameAccount: PublicKey }> {
    try {
      const gameKeypair = Keypair.generate();
      const territoryKeypair = Keypair.generate();
      const playerKeypair = Keypair.generate();
      
      const provider = this.program.provider as AnchorProvider;
      if (!provider.wallet.publicKey) {
        throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
      }

      const walletPublicKey = provider.wallet.publicKey;

      // Initialize game account
      await this.program.methods
        .initializeGame(
          playerColor,
          this.transformTerritories(INITIAL_TERRITORIES),
          this.transformContinents(INITIAL_TERRITORIES.map(t => ({
            id: t.continent,
            territories: [t.id],
            bonusArmies: 1 // This should come from your game config
          })))
        )
        .accounts({
          game: gameKeypair.publicKey,
          territoryAccount: territoryKeypair.publicKey,
          playerAccount: playerKeypair.publicKey,
          creator: walletPublicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([gameKeypair, territoryKeypair, playerKeypair])
        .rpc();

      return { gameAccount: gameKeypair.publicKey };
    } catch (error) {
      console.error('Error details:', error);
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          throw new GameError('Insufficient SOL to create game. Please fund your wallet.', 'INSUFFICIENT_FUNDS');
        }
        throw new GameError(`Failed to initialize game: ${error.message}`, 'INITIALIZATION_FAILED');
      }
      throw new GameError('An unknown error occurred while initializing the game', 'UNKNOWN_ERROR');
    }
  }

  async joinGame(gameAccount: PublicKey, playerColor: string): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;

    await this.program.methods
      .joinGame(playerColor)
      .accounts({
        game: gameAccount,
        playerAccount: await this.findPlayerAccountPDA(gameAccount),
        player: walletPublicKey,
      })
      .rpc();
  }

  private async findPlayerAccountPDA(gameAccount: PublicKey): Promise<PublicKey> {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from('player'), gameAccount.toBuffer()],
      this.playerProgram.programId
    );
    return pda;
  }

  private async findTerritoryAccountPDA(gameAccount: PublicKey): Promise<PublicKey> {
    const [pda] = await PublicKey.findProgramAddress(
      [Buffer.from('territory'), gameAccount.toBuffer()],
      this.territoryProgram.programId
    );
    return pda;
  }

  async placeReinforcements(
    gameAccount: PublicKey,
    placements: { territoryId: number, troops: number }[]
  ): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;
    const playerAccount = await this.findPlayerAccountPDA(gameAccount);
    const territoryAccount = await this.findTerritoryAccountPDA(gameAccount);

    const formattedPlacements = placements.map(p => [p.territoryId, p.troops]);

    await this.program.methods
      .placeReinforcements(formattedPlacements)
      .accounts({
        game: gameAccount,
        territoryAccount,
        playerAccount,
        player: walletPublicKey,
        territoryProgram: this.territoryProgram.programId,
        territoryState: territoryAccount,
        playerProgram: this.playerProgram.programId,
        playerState: playerAccount,
      })
      .rpc();
  }

  async attack(
    gameAccount: PublicKey,
    fromTerritory: number,
    toTerritory: number,
    attackingDice: number
  ): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;
    const playerAccount = await this.findPlayerAccountPDA(gameAccount);
    const territoryAccount = await this.findTerritoryAccountPDA(gameAccount);

    await this.program.methods
      .attack(fromTerritory, toTerritory, attackingDice)
      .accounts({
        game: gameAccount,
        territoryAccount,
        playerAccount,
        player: walletPublicKey,
        territoryProgram: this.territoryProgram.programId,
        territoryState: territoryAccount,
        playerProgram: this.playerProgram.programId,
        playerState: playerAccount,
      })
      .rpc();
  }

  async fortify(
    gameAccount: PublicKey,
    fromTerritory: number,
    toTerritory: number,
    troops: number
  ): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;
    const playerAccount = await this.findPlayerAccountPDA(gameAccount);
    const territoryAccount = await this.findTerritoryAccountPDA(gameAccount);

    await this.program.methods
      .fortify(fromTerritory, toTerritory, troops)
      .accounts({
        game: gameAccount,
        territoryAccount,
        playerAccount,
        player: walletPublicKey,
        territoryProgram: this.territoryProgram.programId,
        territoryState: territoryAccount,
        playerProgram: this.playerProgram.programId,
        playerState: playerAccount,
      })
      .rpc();
  }

  async endPhase(gameAccount: PublicKey): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;
    const playerAccount = await this.findPlayerAccountPDA(gameAccount);
    const territoryAccount = await this.findTerritoryAccountPDA(gameAccount);

    await this.program.methods
      .endPhase()
      .accounts({
        game: gameAccount,
        territoryAccount,
        playerAccount,
        player: walletPublicKey,
        territoryProgram: this.territoryProgram.programId,
        territoryState: territoryAccount,
        playerProgram: this.playerProgram.programId,
        playerState: playerAccount,
      })
      .rpc();
  }

  async tradeCards(
    gameAccount: PublicKey,
    cardIndices: number[]
  ): Promise<void> {
    const provider = this.program.provider as AnchorProvider;
    if (!provider.wallet.publicKey) {
      throw new GameError('Wallet not connected', 'WALLET_NOT_CONNECTED');
    }

    const walletPublicKey = provider.wallet.publicKey;
    const playerAccount = await this.findPlayerAccountPDA(gameAccount);
    const territoryAccount = await this.findTerritoryAccountPDA(gameAccount);

    await this.program.methods
      .tradeCards(Buffer.from(cardIndices))
      .accounts({
        game: gameAccount,
        territoryAccount,
        playerAccount,
        player: walletPublicKey,
        territoryProgram: this.territoryProgram.programId,
        territoryState: territoryAccount,
        playerProgram: this.playerProgram.programId,
        playerState: playerAccount,
      })
      .rpc();
  }

  async getGameState(gameAccount: PublicKey): Promise<GameAccount> {
    const account = await this.program.account.game.fetch(gameAccount);
    return account as unknown as GameAccount;
  }
} 