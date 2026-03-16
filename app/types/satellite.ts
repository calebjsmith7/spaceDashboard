// Satellite types and interfaces

export type SatelliteCategory = 
  | 'stations'
  | 'weather'  
  | 'gps-ops'
  | 'science'
  | 'starlink'
  | 'active';

export interface TLEData {
  OBJECT_NAME: string;
  OBJECT_ID: string;
  EPOCH: string;
  MEAN_MOTION: number;
  ECCENTRICITY: number;
  INCLINATION: number;
  RA_OF_ASC_NODE: number;
  ARG_OF_PERICENTER: number;
  MEAN_ANOMALY: number;
  EPHEMERIS_TYPE: number;
  CLASSIFICATION_TYPE: string;
  NORAD_CAT_ID: number;
  ELEMENT_SET_NO: number;
  REV_AT_EPOCH: number;
  BSTAR: number;
  MEAN_MOTION_DOT: number;
  MEAN_MOTION_DDOT: number;
  TLE_LINE0?: string;
  TLE_LINE1?: string;
  TLE_LINE2?: string;
}

export interface SatellitePosition {
  x: number;
  y: number;
  z: number;
  lat: number;
  lng: number;
  altitude: number; // km above Earth's surface
}

export interface Satellite {
  id: number;
  name: string;
  category: SatelliteCategory;
  tle: TLEData;
  position?: SatellitePosition;
}

export interface CategoryConfig {
  name: string;
  label: string;
  color: string;
  endpoint: string;
  maxFetch?: number; // Limit satellites fetched (e.g., Starlink has thousands)
}

// Category configurations with colors and endpoints
export const SATELLITE_CATEGORIES: Record<SatelliteCategory, CategoryConfig> = {
  stations: {
    name: 'stations',
    label: 'Space Stations',
    color: '#00ff00', // Green
    endpoint: 'stations',
  },
  weather: {
    name: 'weather',
    label: 'Weather Satellites',
    color: '#00bfff', // Deep sky blue
    endpoint: 'weather',
  },
  'gps-ops': {
    name: 'gps-ops',
    label: 'GPS Satellites',
    color: '#ffd700', // Gold
    endpoint: 'gps-ops',
  },
  science: {
    name: 'science',
    label: 'Science Satellites',
    color: '#ff69b4', // Hot pink
    endpoint: 'science',
  },
  starlink: {
    name: 'starlink',
    label: 'Starlink',
    color: '#ffffff', // White
    endpoint: 'starlink',
    maxFetch: 100, // Limit Starlink - there are thousands!
  },
  active: {
    name: 'active',
    label: 'Active Satellites',
    color: '#ff6347', // Tomato
    endpoint: 'active',
    maxFetch: 200,
  },
};
