import { Territory, Continent } from '../types/game';

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
    {
        id: 2,
        name: "Greenland",
        owner: null,
        troops: 0,
        adjacentTerritories: [1, 4, 14], // Northwest Territory, Ontario, Iceland
        continent: "North America"
    },
    {
        id: 3,
        name: "Alberta",
        owner: null,
        troops: 0,
        adjacentTerritories: [0, 1, 4, 5], // Alaska, Northwest Territory, Ontario, Western United States
        continent: "North America"
    },
    {
        id: 4,
        name: "Ontario",
        owner: null,
        troops: 0,
        adjacentTerritories: [1, 2, 3, 5, 6, 7], // Northwest Territory, Greenland, Alberta, Western United States, Eastern United States, Quebec
        continent: "North America"
    },
    {
        id: 5,
        name: "Western United States",
        owner: null,
        troops: 0,
        adjacentTerritories: [3, 4, 6, 8], // Alberta, Ontario, Eastern United States, Central America
        continent: "North America"
    },
    {
        id: 6,
        name: "Eastern United States",
        owner: null,
        troops: 0,
        adjacentTerritories: [4, 5, 7, 8], // Ontario, Western United States, Quebec, Central America
        continent: "North America"
    },
    {
        id: 7,
        name: "Quebec",
        owner: null,
        troops: 0,
        adjacentTerritories: [4, 6], // Ontario, Eastern United States
        continent: "North America"
    },
    {
        id: 8,
        name: "Central America",
        owner: null,
        troops: 0,
        adjacentTerritories: [5, 6, 9], // Western United States, Eastern United States, Venezuela
        continent: "North America"
    },
    // South America (4 territories)
    {
        id: 9,
        name: "Venezuela",
        owner: null,
        troops: 0,
        adjacentTerritories: [8, 10, 11], // Central America, Peru, Brazil
        continent: "South America"
    },
    {
        id: 10,
        name: "Peru",
        owner: null,
        troops: 0,
        adjacentTerritories: [9, 11, 12], // Venezuela, Brazil, Argentina
        continent: "South America"
    },
    {
        id: 11,
        name: "Brazil",
        owner: null,
        troops: 0,
        adjacentTerritories: [9, 10, 12, 21], // Venezuela, Peru, Argentina, North Africa
        continent: "South America"
    },
    {
        id: 12,
        name: "Argentina",
        owner: null,
        troops: 0,
        adjacentTerritories: [10, 11], // Peru, Brazil
        continent: "South America"
    },
    // Europe (7 territories)
    {
        id: 13,
        name: "Great Britain",
        owner: null,
        troops: 0,
        adjacentTerritories: [14, 15, 16, 17], // Iceland, Scandinavia, Northern Europe, Western Europe
        continent: "Europe"
    },
    {
        id: 14,
        name: "Iceland",
        owner: null,
        troops: 0,
        adjacentTerritories: [2, 13, 15], // Greenland, Great Britain, Scandinavia
        continent: "Europe"
    },
    {
        id: 15,
        name: "Scandinavia",
        owner: null,
        troops: 0,
        adjacentTerritories: [13, 14, 16, 18], // Great Britain, Iceland, Northern Europe, Ukraine
        continent: "Europe"
    },
    {
        id: 16,
        name: "Northern Europe",
        owner: null,
        troops: 0,
        adjacentTerritories: [13, 15, 17, 18, 19], // Great Britain, Scandinavia, Western Europe, Ukraine, Southern Europe
        continent: "Europe"
    },
    {
        id: 17,
        name: "Western Europe",
        owner: null,
        troops: 0,
        adjacentTerritories: [13, 16, 19, 21], // Great Britain, Northern Europe, Southern Europe, North Africa
        continent: "Europe"
    },
    {
        id: 18,
        name: "Ukraine",
        owner: null,
        troops: 0,
        adjacentTerritories: [15, 16, 19, 26, 27, 31], // Scandinavia, Northern Europe, Southern Europe, Ural, Afghanistan, Middle East
        continent: "Europe"
    },
    {
        id: 19,
        name: "Southern Europe",
        owner: null,
        troops: 0,
        adjacentTerritories: [16, 17, 18, 21, 31], // Northern Europe, Western Europe, Ukraine, North Africa, Middle East
        continent: "Europe"
    },
    // Africa (6 territories)
    {
        id: 20,
        name: "Egypt",
        owner: null,
        troops: 0,
        adjacentTerritories: [21, 22, 31], // North Africa, East Africa, Middle East
        continent: "Africa"
    },
    {
        id: 21,
        name: "North Africa",
        owner: null,
        troops: 0,
        adjacentTerritories: [11, 17, 19, 20, 22, 23], // Brazil, Western Europe, Southern Europe, Egypt, East Africa, Congo
        continent: "Africa"
    },
    {
        id: 22,
        name: "East Africa",
        owner: null,
        troops: 0,
        adjacentTerritories: [20, 21, 23, 24, 31], // Egypt, North Africa, Congo, South Africa, Middle East
        continent: "Africa"
    },
    {
        id: 23,
        name: "Congo",
        owner: null,
        troops: 0,
        adjacentTerritories: [21, 22, 24], // North Africa, East Africa, South Africa
        continent: "Africa"
    },
    {
        id: 24,
        name: "South Africa",
        owner: null,
        troops: 0,
        adjacentTerritories: [22, 23, 25], // East Africa, Congo, Madagascar
        continent: "Africa"
    },
    {
        id: 25,
        name: "Madagascar",
        owner: null,
        troops: 0,
        adjacentTerritories: [24], // South Africa
        continent: "Africa"
    },
    // Asia (12 territories)
    {
        id: 26,
        name: "Ural",
        owner: null,
        troops: 0,
        adjacentTerritories: [18, 27, 28, 29], // Ukraine, Afghanistan, Siberia, China
        continent: "Asia"
    },
    {
        id: 27,
        name: "Afghanistan",
        owner: null,
        troops: 0,
        adjacentTerritories: [18, 26, 29, 31], // Ukraine, Ural, China, Middle East
        continent: "Asia"
    },
    {
        id: 28,
        name: "Siberia",
        owner: null,
        troops: 0,
        adjacentTerritories: [26, 29, 30, 36], // Ural, China, Yakutsk, Irkutsk
        continent: "Asia"
    },
    {
        id: 29,
        name: "China",
        owner: null,
        troops: 0,
        adjacentTerritories: [26, 27, 28, 31, 32, 33], // Ural, Afghanistan, Siberia, Middle East, India, Siam
        continent: "Asia"
    },
    {
        id: 30,
        name: "Yakutsk",
        owner: null,
        troops: 0,
        adjacentTerritories: [28, 36, 37], // Siberia, Irkutsk, Kamchatka
        continent: "Asia"
    },
    {
        id: 31,
        name: "Middle East",
        owner: null,
        troops: 0,
        adjacentTerritories: [18, 19, 20, 22, 27, 29, 32], // Ukraine, Southern Europe, Egypt, East Africa, Afghanistan, China, India
        continent: "Asia"
    },
    {
        id: 32,
        name: "India",
        owner: null,
        troops: 0,
        adjacentTerritories: [29, 31, 33], // China, Middle East, Siam
        continent: "Asia"
    },
    {
        id: 33,
        name: "Siam",
        owner: null,
        troops: 0,
        adjacentTerritories: [29, 32, 34], // China, India, Indonesia
        continent: "Asia"
    },
    {
        id: 34,
        name: "Indonesia",
        owner: null,
        troops: 0,
        adjacentTerritories: [33, 35, 38], // Siam, New Guinea, Western Australia
        continent: "Asia"
    },
    {
        id: 35,
        name: "New Guinea",
        owner: null,
        troops: 0,
        adjacentTerritories: [34, 37, 38], // Indonesia, Eastern Australia, Western Australia
        continent: "Asia"
    },
    {
        id: 36,
        name: "Irkutsk",
        owner: null,
        troops: 0,
        adjacentTerritories: [28, 30, 37], // Siberia, Yakutsk, Kamchatka
        continent: "Asia"
    },
    {
        id: 37,
        name: "Kamchatka",
        owner: null,
        troops: 0,
        adjacentTerritories: [0, 30, 36], // Alaska, Yakutsk, Irkutsk
        continent: "Asia"
    },
    // Australia (4 territories)
    {
        id: 38,
        name: "Western Australia",
        owner: null,
        troops: 0,
        adjacentTerritories: [34, 35, 39], // Indonesia, New Guinea, Eastern Australia
        continent: "Australia"
    },
    {
        id: 39,
        name: "Eastern Australia",
        owner: null,
        troops: 0,
        adjacentTerritories: [35, 38], // New Guinea, Western Australia
        continent: "Australia"
    }
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