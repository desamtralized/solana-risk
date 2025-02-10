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
  const {
    gameState,
    isLoading,
    error,
    createGame,
    joinGame,
    attackTerritory,
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
                    onClick={createGame}
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
                          joinGame(new PublicKey(gameAddress));
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
              <ClientWallet />
            </div>
          </header>
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {gameState && (
            <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded text-white">
              <p>Turn: {gameState.turn}</p>
              <p>State: {gameState.state}</p>
              {gameState.currentPlayer.toString() === publicKey?.toString() && (
                <p className="text-green-500 font-bold">Your turn!</p>
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
