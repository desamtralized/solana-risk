import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { GameService } from '../services/gameService';
import { GameAccount, Territory } from '../types/game';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export function useGame() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [gameService, setGameService] = useState<GameService | null>(null);
  const [gameState, setGameState] = useState<GameAccount | null>(null);
  const [gameAccount, setGameAccount] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError('Failed to fetch game state');
    }
  };

  const createGame = async () => {
    if (!gameService) return;

    try {
      setIsLoading(true);
      setError(null);
      const { gameAccount: newGameAccount } = await gameService.initializeGame();
      setGameAccount(newGameAccount);
      await fetchGameState();
    } catch (err) {
      console.error('Error creating game:', err);
      setError('Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameAccountAddress: PublicKey) => {
    if (!gameService) return;

    try {
      setIsLoading(true);
      setError(null);
      await gameService.joinGame(gameAccountAddress);
      setGameAccount(gameAccountAddress);
      await fetchGameState();
    } catch (err) {
      console.error('Error joining game:', err);
      setError('Failed to join game');
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
      setError('Failed to attack territory');
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
      setError('Failed to place troops');
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