import { Territory, Continent } from '../types/game';
import { PublicKey } from '@solana/web3.js';

export const INITIAL_TERRITORIES: Territory[] = [
    // North America (9 territories)
    {
        id: 0,
        name: "Alaska",
        owner: null,
        troops: 0,
        adjacentTerritories: [1, 3, 37], // Northwest Territory, Alberta, Kamchatka
        continent: "North America"
    },
    {
        id: 1,
        name: "Northwest Territory",
        owner: null,
        troops: 0,
        adjacentTerritories: [0, 2, 3, 4], // Alaska, Greenland, Alberta, Ontario
        continent: "North America"
    },
    // ... Add all other territories following the same pattern from the Solana program
];

export const INITIAL_CONTINENTS: Continent[] = [
    {
        name: "North America",
        territories: [0, 1, 2, 3, 4, 5, 6, 7, 8],
        bonusArmies: 5
    },
    {
        name: "South America",
        territories: [9, 10, 11, 12],
        bonusArmies: 2
    },
    {
        name: "Europe",
        territories: [13, 14, 15, 16, 17, 18, 19],
        bonusArmies: 5
    },
    {
        name: "Africa",
        territories: [20, 21, 22, 23, 24, 25],
        bonusArmies: 3
    },
    {
        name: "Asia",
        territories: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
        bonusArmies: 7
    },
    {
        name: "Australia",
        territories: [37, 38, 39, 40, 41],
        bonusArmies: 2
    }
]; 