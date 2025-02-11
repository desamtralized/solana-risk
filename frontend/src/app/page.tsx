'use client';

import { PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Territory } from './types/game';
import { useGame } from './hooks/useGame';
import { useWallet } from '@solana/wallet-adapter-react';

const GameMap = dynamic(() => import('./components/GameMap'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

const ClientWallet = dynamic(
  () => import('./components/ClientWallet'),
  { ssr: false }
);

export default function Home() {
  const { publicKey } = useWallet();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [mounted, setMounted] = useState(false);
  const [gameAddress, setGameAddress] = useState<PublicKey | null>(null);
  const {
    gameState,
    isLoading,
    error,
    createGame,
    attackTerritory,
    joinGame,
    loadGame,
  } = useGame();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTerritorySelect = async (territory: Territory) => {
    if (!publicKey || !gameState) return;
    
    if (!selectedTerritory) {
      if (territory.owner?.toString() === publicKey.toString()) {
        setSelectedTerritory(territory);
      }
    } else {
      if (territory.owner?.toString() !== publicKey.toString()) {
        await attackTerritory(selectedTerritory, territory, 1);
      }
      setSelectedTerritory(null);
    }
  };

  const handleCreateGame = async () => {
    const result = await createGame();
    if (result?.gameAccount) {
      setGameAddress(result.gameAccount);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen">
      <div className="fixed inset-x-0 top-0 z-10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Solana Risk Game</h1>
            </div>
            <div className="flex gap-4 items-center">
              {!gameState && publicKey && (
                <>
                  <button
                    onClick={handleCreateGame}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Create Game
                  </button>
                  <button
                    onClick={() => {
                      const gameAddress = prompt('Enter game address:');
                      if (gameAddress) {
                        try {
                          const pubkey = new PublicKey(gameAddress);
                          setGameAddress(pubkey);
                          joinGame(pubkey);
                        } catch (error) {
                          console.error('Invalid game address:', error);
                        }
                      }
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    Join Game
                  </button>
                </>
              )}
              {publicKey && (
                <button
                  onClick={() => {
                    const gameAddress = prompt('Enter game address:');
                    if (gameAddress) {
                      try {
                        const pubkey = new PublicKey(gameAddress);
                        setGameAddress(pubkey);
                        loadGame(pubkey);
                      } catch (error) {
                        console.error('Invalid game address:', error);
                      }
                    }
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                >
                  Load Game
                </button>
              )}
              <ClientWallet />
            </div>
          </header>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              <p className="font-bold">{error.name}</p>
              <p>{error.message}</p>
              {error.code && <p className="text-sm mt-1">Error code: {error.code}</p>}
            </div>
          )}
          
          {gameState && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded text-white">
              {gameAddress && (
                <div className="mb-2 flex items-center gap-2">
                  <p>Game Address: {gameAddress.toString()}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(gameAddress.toString());
                    }}
                    className="px-2 py-1 text-sm bg-gray-500 hover:bg-gray-600 rounded"
                  >
                    Copy
                  </button>
                </div>
              )}
              <p>Turn: {gameState.turn}</p>
              <p>State: {Object.keys(gameState.state)[0]}</p>
              <p>Phase: {Object.keys(gameState.currentPhase)[0]}</p>
              <p>Current Player: {gameState.currentPlayer.toString()}</p>
              {gameState.currentPlayer.toString() === publicKey?.toString() && (
                <p className="text-green-500 font-bold">Your turn!</p>
              )}
              {gameState.pendingReinforcements && (
                <p>Pending Reinforcements: {gameState.pendingReinforcements}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="game-container">
        <GameMap
          gameState={gameState}
          selectedTerritory={selectedTerritory}
          onTerritorySelect={handleTerritorySelect}
        />
      </div>
    </main>
  );
}
