import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Territory, GameAccount } from '../types/game';
import { INITIAL_TERRITORIES } from '../constants/gameData';

interface GameMapProps {
  gameState: GameAccount | null;
  onTerritorySelect: (territory: Territory) => void;
  selectedTerritory: Territory | null;
}

// Territory coordinate mapping
const TERRITORY_POSITIONS: Record<number, [number, number]> = {
  // North America
  0: [65, -160],  // Alaska
  1: [65, -100],  // Northwest Territory
  2: [65, -45],   // Greenland
  3: [55, -120],  // Alberta
  4: [55, -90],   // Ontario
  5: [45, -120],  // Western United States
  6: [45, -90],   // Eastern United States
  7: [55, -70],   // Quebec
  8: [35, -100],  // Central America
  // South America
  9: [5, -70],    // Venezuela
  10: [-10, -75], // Peru
  11: [-10, -50], // Brazil
  12: [-35, -65], // Argentina
  // Europe
  13: [50, 0],    // Great Britain
  14: [65, -20],  // Iceland
  15: [60, 20],   // Scandinavia
  16: [50, 15],   // Northern Europe
  17: [45, 0],    // Western Europe
  18: [55, 40],   // Ukraine
  19: [45, 20],   // Southern Europe
  // Africa
  20: [30, 30],   // Egypt
  21: [20, 0],    // North Africa
  22: [5, 35],    // East Africa
  23: [-5, 15],   // Congo
  24: [-25, 25],  // South Africa
  25: [-25, 45],  // Madagascar
  // Asia
  26: [60, 60],   // Ural
  27: [45, 65],   // Afghanistan
  28: [65, 90],   // Siberia
  29: [40, 100],  // China
  30: [65, 120],  // Yakutsk
  31: [35, 50],   // Middle East
  32: [30, 80],   // India
  33: [15, 100],  // Siam
  34: [-5, 120],  // Indonesia
  35: [-15, 150], // New Guinea
  36: [55, 130],  // Irkutsk
  37: [60, 150],  // Kamchatka
  // Australia
  38: [-25, 125], // Western Australia
  39: [-30, 145], // Eastern Australia
};

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
        zoom={2.5}
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
          const position = TERRITORY_POSITIONS[territory.id];
          if (!position) return null;
          
          return (
            <CircleMarker
              key={territory.id}
              center={position}
              radius={12}
              pathOptions={getTerritoryStyling(territory)}
              eventHandlers={{
                click: () => onTerritorySelect(territory)
              }}
            >
              <Tooltip permanent direction="top" offset={[0, -10]}>
                <div className="text-xs font-bold">{territory.name}</div>
              </Tooltip>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold">{territory.name}</h3>
                  <p>Troops: {territory.troops}</p>
                  <p>Owner: {territory.owner ? 
                    `${territory.owner.toString().slice(0, 4)}...${territory.owner.toString().slice(-4)}` : 
                    'Unclaimed'}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
} 