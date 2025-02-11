import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, Keypair } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { GameAccount, GameState, TurnPhase, Territory, Player, CardType, RiskCard, CONTINENTS } from '../types/game';
import { INITIAL_TERRITORIES, INITIAL_CONTINENTS } from '../constants/gameData';
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

const CARD_SET_VALUES = [4, 6, 8, 10, 12, 15];
const MIN_ARMIES_PER_TURN = 3;

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

  async initializeGame(playerColor: string): Promise<{ gameAccount: PublicKey }> {
    try {
      const gameKeypair = Keypair.generate();
      
      await this.program.methods
        .initializeGame(
          playerColor,
          INITIAL_TERRITORIES,
          INITIAL_CONTINENTS
        )
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
        }
        throw new GameError(`Failed to initialize game: ${error.message}`, 'INITIALIZATION_FAILED');
      }
      throw new GameError('An unknown error occurred while initializing the game', 'UNKNOWN_ERROR');
    }
  }

  async joinGame(gameAccount: PublicKey, playerColor: string): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    if (gameState.state !== GameState.Setup) {
      throw new GameError('Cannot join game that has already started', 'GAME_STARTED');
    }

    await this.program.methods
      .joinGame({
        publicKey: this.program.provider.publicKey,
        color: playerColor,
        cards: [],
        conqueredTerritoryThisTurn: false
      })
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async calculateReinforcements(gameAccount: PublicKey): Promise<number> {
    const gameState = await this.getGameState(gameAccount);
    const currentPlayer = gameState.players.find(p => p.publicKey.equals(this.program.provider.publicKey));
    if (!currentPlayer) throw new GameError('Not a player in this game', 'NOT_PLAYER');

    // Calculate territory-based reinforcements
    const territoriesOwned = gameState.territories.filter(t => t.owner && t.owner.equals(currentPlayer.publicKey));
    const baseReinforcements = Math.max(Math.floor(territoriesOwned.length / 3), MIN_ARMIES_PER_TURN);

    // Calculate continent bonuses
    const continentBonuses = CONTINENTS.reduce((total, continent) => {
      const ownsContinent = continent.territories.every(tId => {
        const owner = gameState.territories[tId].owner;
        return owner && owner.equals(currentPlayer.publicKey);
      });
      return total + (ownsContinent ? continent.bonusArmies : 0);
    }, 0);

    return baseReinforcements + continentBonuses;
  }

  async placeReinforcements(
    gameAccount: PublicKey,
    placements: { territoryId: number, troops: number }[]
  ): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    if (gameState.currentPhase !== TurnPhase.Reinforcement) {
      throw new GameError('Not in reinforcement phase', 'WRONG_PHASE');
    }

    for (const placement of placements) {
      await this.program.methods
        .placeTroops(placement.territoryId, placement.troops)
        .accounts({
          game: gameAccount,
          player: this.program.provider.publicKey,
        })
        .rpc();
    }
  }

  async attack(
    gameAccount: PublicKey,
    fromTerritory: number,
    toTerritory: number,
    attackingDice: number
  ): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    if (gameState.currentPhase !== TurnPhase.Attack) {
      throw new GameError('Not in attack phase', 'WRONG_PHASE');
    }

    await this.program.methods
      .attack(fromTerritory, toTerritory, attackingDice)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async fortify(
    gameAccount: PublicKey,
    fromTerritory: number,
    toTerritory: number,
    troops: number
  ): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    if (gameState.currentPhase !== TurnPhase.Fortification) {
      throw new GameError('Can only fortify during fortification phase', 'WRONG_PHASE');
    }

    await this.program.methods
      .fortify(fromTerritory, toTerritory, troops)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async endPhase(gameAccount: PublicKey): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    
    // Determine next phase
    let nextPhase: TurnPhase;
    switch (gameState.currentPhase) {
      case TurnPhase.Reinforcement:
        nextPhase = TurnPhase.Attack;
        break;
      case TurnPhase.Attack:
        nextPhase = TurnPhase.Fortification;
        break;
      case TurnPhase.Fortification:
        nextPhase = TurnPhase.Reinforcement;
        break;
      default:
        throw new GameError('Invalid phase', 'INVALID_PHASE');
    }

    await this.program.methods
      .endPhase(nextPhase)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  private findCurrentPlayer(gameState: GameAccount): { publicKey: PublicKey } | null {
    const player = gameState.players.find(p => {
      const playerPubkey = p.publicKey;
      if (!playerPubkey) return false;
      return playerPubkey.equals(this.program.provider.publicKey);
    });
    return player || null;
  }

  private validateCurrentPlayer(gameState: GameAccount): { publicKey: PublicKey } {
    const player = this.findCurrentPlayer(gameState);
    if (!player) {
      throw new GameError('Not a player in this game', 'NOT_PLAYER');
    }
    return player;
  }

  async tradeCards(
    gameAccount: PublicKey,
    cardIndices: number[]
  ): Promise<void> {
    const gameState = await this.getGameState(gameAccount);
    if (gameState.currentPhase !== TurnPhase.Reinforcement) {
      throw new GameError('Can only trade cards during reinforcement phase', 'WRONG_PHASE');
    }

    this.validateCurrentPlayer(gameState);

    if (cardIndices.length !== 3) {
      throw new GameError('Must trade exactly 3 cards', 'INVALID_CARD_SET');
    }

    // Convert to u8 array for Solana program
    const cardIndicesU8 = new Uint8Array(cardIndices);

    await this.program.methods
      .tradeCards(cardIndicesU8)
      .accounts({
        game: gameAccount,
        player: this.program.provider.publicKey,
      })
      .rpc();
  }

  async areTerritoriesConnected(
    gameState: GameAccount,
    fromTerritory: number,
    toTerritory: number
  ): Promise<boolean> {
    const currentPlayer = this.findCurrentPlayer(gameState);
    if (!currentPlayer) return false;

    const visited = new Set<number>();
    const stack: number[] = [fromTerritory];
    visited.add(fromTerritory);

    while (stack.length > 0) {
      const current = stack.pop()!;
      if (current === toTerritory) return true;

      const territory = gameState.territories[current];
      for (const adj of territory.adjacentTerritories) {
        const adjTerritory = gameState.territories[adj];
        const adjOwner = adjTerritory.owner;
        if (!visited.has(adj) && adjOwner && adjOwner.equals(currentPlayer.publicKey)) {
          visited.add(adj);
          stack.push(adj);
        }
      }
    }

    return false;
  }

  // Helper method to validate card set
  isValidCardSet(cards: RiskCard[]): boolean {
    if (cards.length !== 3) return false;

    // Check for three of a kind
    if (cards.every(c => c.type === cards[0].type)) return true;

    // Check for one of each (excluding wilds)
    const types = new Set(cards.map(c => c.type));
    if (types.size === 3 && !types.has(CardType.Wild)) return true;

    // Check for sets with wilds
    const wilds = cards.filter(c => c.type === CardType.Wild).length;
    if (wilds > 0) {
      const nonWilds = new Set(cards.filter(c => c.type !== CardType.Wild).map(c => c.type));
      if (wilds + nonWilds.size === 3) return true;
    }

    return false;
  }

  async getGameState(gameAccount: PublicKey): Promise<GameAccount> {
    const account = await this.program.account.game.fetch(gameAccount);
    return account as unknown as GameAccount;
  }
} 