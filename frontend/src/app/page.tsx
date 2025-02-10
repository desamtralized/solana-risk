'use client';

import { PublicKey } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { Territory } from './types/game';
import { useGame } from './hooks/useGame';

const GameMap = dynamic(() => import('./components/GameMap'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function Home() {
  const { publicKey } = useWallet();
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const {
    gameState,
    isLoading,
    error,
    createGame,
    joinGame,
    attackTerritory,
    placeTroops,
  } = useGame();

  const handleTerritorySelect = async (territory: Territory) => {
    if (!publicKey || !gameState) return;
    
    if (!selectedTerritory) {
      // First territory selection
      if (territory.owner?.toString() === publicKey.toString()) {
        setSelectedTerritory(territory);
      }
    } else {
      // Second territory selection - attempt attack
      if (territory.owner?.toString() !== publicKey.toString()) {
        await attackTerritory(selectedTerritory, territory, 1);
      }
      setSelectedTerritory(null);
    }
  };

  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Solana Risk Game</h1>
            {publicKey && (
              <p className="text-sm mt-2">
                Connected: {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </p>
            )}
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
                    // For demo purposes - you'll want to implement a proper game discovery system
                    const gameAddress = prompt('Enter game address:');
                    if (gameAddress) {
                      try {
                        joinGame(new PublicKey(gameAddress));
                      } catch (err) {
                        console.error('Invalid game address');
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
            <WalletMultiButton />
          </div>
        </header>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {gameState && (
          <div className="mb-4">
            <p>Turn: {gameState.turn}</p>
            <p>State: {gameState.state}</p>
            {gameState.currentPlayer.toString() === publicKey?.toString() && (
              <p className="text-green-500 font-bold">Your turn!</p>
            )}
          </div>
        )}
        
        <div className="game-container">
          <GameMap
            gameState={gameState}
            selectedTerritory={selectedTerritory}
            onTerritorySelect={handleTerritorySelect}
          />
        </div>
      </div>
    </main>
  );
}
