import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { GameService, GameError } from '../services/gameService';
import { GameAccount, Territory } from '../types/game';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export interface GameErrorState {
  name: string;
  message: string;
  code?: string;
}

export function useGame() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [gameService, setGameService] = useState<GameService | null>(null);
  const [gameState, setGameState] = useState<GameAccount | null>(null);
  const [gameAccount, setGameAccount] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<GameErrorState | null>(null);

  useEffect(() => {
    if (
      connection && 
      wallet.publicKey && 
      !wallet.disconnecting && 
      !wallet.connecting &&
      wallet.signTransaction &&
      wallet.signAllTransactions
    ) {
      const anchorWallet: AnchorWallet = {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions
      };
      setGameService(new GameService(connection, anchorWallet));
    } else {
      setGameService(null);
    }
  }, [connection, wallet]);

  useEffect(() => {
    if (gameService && gameAccount) {
      const interval = setInterval(fetchGameState, 2000);
      return () => clearInterval(interval);
    }
  }, [gameService, gameAccount]);

  const fetchGameState = async () => {
    if (!gameService || !gameAccount) return;

    try {
      const state = await gameService.getGameState(gameAccount);
      setGameState(state);
    } catch (err) {
      console.error('Error fetching game state:', err);
      setError({ name: 'FetchError', message: 'Failed to fetch game state' });
    }
  };

  const createGame = async () => {
    if (!gameService) return;

    try {
      setIsLoading(true);
      setError(null);
      const { gameAccount: newGameAccount } = await gameService.initializeGame('red');
      setGameAccount(newGameAccount);
      await fetchGameState();
    } catch (err) {
      if (err instanceof GameError) {
        setError({ name: 'GameError', message: err.message, code: err.code });
      } else if (err instanceof Error) {
        setError({ name: err.name, message: err.message });
      } else {
        setError({ name: 'UnknownError', message: 'An unknown error occurred' });
      }
      console.error('Error creating game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameAccountAddress: PublicKey) => {
    if (!gameService) return;

    try {
      setIsLoading(true);
      setError(null);
      await gameService.joinGame(gameAccountAddress, 'red');
      setGameAccount(gameAccountAddress);
      await fetchGameState();
    } catch (err) {
      if (err instanceof GameError) {
        setError({ name: 'GameError', message: err.message, code: err.code });
      } else if (err instanceof Error) {
        setError({ name: err.name, message: err.message });
      } else {
        setError({ name: 'UnknownError', message: 'An unknown error occurred' });
      }
      console.error('Error joining game:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const attackTerritory = async (
    fromTerritory: Territory,
    toTerritory: Territory,
    troops: number
  ) => {
    if (!gameService || !gameAccount) return;

    try {
      setIsLoading(true);
      setError(null);
      await gameService.makeMove(
        gameAccount,
        fromTerritory.id,
        toTerritory.id,
        troops
      );
      await fetchGameState();
    } catch (err) {
      console.error('Error attacking territory:', err);
      setError({ name: 'AttackError', message: 'Failed to attack territory' });
    } finally {
      setIsLoading(false);
    }
  };

  const placeTroops = async (territory: Territory, troops: number) => {
    if (!gameService || !gameAccount) return;

    try {
      setIsLoading(true);
      setError(null);
      await gameService.placeTroops(gameAccount, territory.id, troops);
      await fetchGameState();
    } catch (err) {
      console.error('Error placing troops:', err);
      setError({ name: 'PlacementError', message: 'Failed to place troops' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    gameState,
    isLoading,
    error,
    createGame,
    joinGame,
    attackTerritory,
    placeTroops,
    connected: !!wallet.publicKey,
    connecting: wallet.connecting,
  };
} 