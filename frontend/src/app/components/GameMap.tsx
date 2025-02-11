import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Territory, GameAccount, TERRITORY_COORDINATES } from '../types/game';
import { INITIAL_TERRITORIES } from '../constants/gameData';

interface GameMapProps {
  gameState: GameAccount | null;
  onTerritorySelect: (territory: Territory) => void;
  selectedTerritory: Territory | null;
}

export default function GameMap({ gameState, onTerritorySelect, selectedTerritory }: GameMapProps) {
  const { publicKey } = useWallet();
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (gameState?.territories) {
      setTerritories(gameState.territories);
    } else {
      setTerritories(INITIAL_TERRITORIES);
    }
  }, [gameState]);

  const getTerritoryStyling = (territory: Territory) => {
    const isSelected = selectedTerritory?.id === territory.id;
    const isOwned = territory.owner?.toString() === publicKey?.toString();

    return {
      color: isSelected ? '#ff0' : (isOwned ? '#0f0' : '#f00'),
      fillColor: isSelected ? '#ff0' : (isOwned ? '#0f0' : '#f00'),
      fillOpacity: isSelected ? 0.6 : 0.4,
      weight: isSelected ? 3 : 1,
    };
  };

  if (!mounted) {
    return <div className="fixed inset-0 bg-gray-100" />;
  }

  if (!territories || territories.length === 0) {
    return (
      <div className="fixed inset-0 bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0" style={{ width: '100%', height: '100%', zIndex: 0 }}>
      <MapContainer
        center={[20, 0]}
        zoom={3.5}
        style={{ height: "100%", width: "100%" }}
        maxBounds={[[-90, -180], [90, 180]]}
        minZoom={2}
        maxZoom={6}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        {territories.map((territory) => {
          const coordinates = TERRITORY_COORDINATES[territory.continent];
          if (!coordinates) return null;
          
          return (
            <Polygon
              key={territory.id}
              positions={coordinates}
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
          );
        })}
      </MapContainer>
    </div>
  );
} 