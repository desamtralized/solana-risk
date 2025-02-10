import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Territory, GameAccount, TERRITORY_COORDINATES } from '../types/game';

interface GameMapProps {
  gameState: GameAccount | null;
  onTerritorySelect: (territory: Territory) => void;
  selectedTerritory: Territory | null;
}

export default function GameMap({ gameState, onTerritorySelect, selectedTerritory }: GameMapProps) {
  const { publicKey } = useWallet();
  const [territories, setTerritories] = useState<Territory[]>([]);

  useEffect(() => {
    if (gameState) {
      setTerritories(gameState.territories);
    }
  }, [gameState]);

  const getTerritoryStyling = (territory: Territory) => {
    const isSelected = selectedTerritory?.id === territory.id;
    const isOwned = territory.owner?.toString() === publicKey?.toString();
    const isCurrentPlayer = gameState?.currentPlayer.toString() === publicKey?.toString();

    return {
      color: isSelected ? '#ff0' : (isOwned ? '#0f0' : '#f00'),
      fillColor: isSelected ? '#ff0' : (isOwned ? '#0f0' : '#f00'),
      fillOpacity: isSelected ? 0.6 : 0.4,
      weight: isSelected ? 3 : 1,
    };
  };

  return (
    <div className="w-full h-[600px] relative">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        {territories.map((territory) => (
          <Polygon
            key={territory.id}
            positions={TERRITORY_COORDINATES[territory.name]}
            pathOptions={getTerritoryStyling(territory)}
            eventHandlers={{
              click: () => onTerritorySelect(territory)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold">{territory.name}</h3>
                <p>Troops: {territory.troops}</p>
                <p>Owner: {territory.owner ? 
                  `${territory.owner.toString().slice(0, 4)}...${territory.owner.toString().slice(-4)}` : 
                  'Unclaimed'}</p>
              </div>
            </Popup>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
} 