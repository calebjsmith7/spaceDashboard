import * as satellite from 'satellite.js';
import type { 
  TLEData, 
  Satellite, 
  SatellitePosition, 
  SatelliteCategory,
  CategoryConfig,
} from '../types/satellite';

/**
 * Fetch TLE data from our API route (which proxies to CelesTrak)
 */
export async function fetchSatellitesByCategory(
  category: SatelliteCategory,
  config: CategoryConfig
): Promise<Satellite[]> {
  try {
    // Use our API route to avoid CORS issues
    const url = `/api/satellites?category=${category}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to fetch ${category}`);
    }
    
    const data: TLEData[] = await response.json();
    
    // Apply maxFetch limit if specified
    const limitedData = config.maxFetch ? data.slice(0, config.maxFetch) : data;
    
    return limitedData.map((tle) => ({
      id: tle.NORAD_CAT_ID,
      name: tle.OBJECT_NAME,
      category,
      tle,
    }));
  } catch (error) {
    console.error(`Error fetching ${category} satellites:`, error);
    return [];
  }
}

/**
 * Convert TLE data to satellite.js satrec object
 */
export function createSatRec(tle: TLEData): satellite.SatRec | null {
  try {
    // Validate we have necessary data
    if (!tle || !tle.NORAD_CAT_ID) {
      console.error('Invalid TLE data:', tle);
      return null;
    }

    // Space-Track includes TLE lines directly - use them if available
    if (tle.TLE_LINE1 && tle.TLE_LINE2) {
      return satellite.twoline2satrec(tle.TLE_LINE1, tle.TLE_LINE2);
    }
    
    // Check we have required orbital elements before constructing TLE
    if (
      tle.INCLINATION === undefined ||
      tle.RA_OF_ASC_NODE === undefined ||
      tle.ECCENTRICITY === undefined ||
      tle.ARG_OF_PERICENTER === undefined ||
      tle.MEAN_ANOMALY === undefined ||
      tle.MEAN_MOTION === undefined
    ) {
      console.error(`Missing orbital elements for ${tle.OBJECT_NAME}`);
      return null;
    }
    
    // Construct TLE lines from orbital elements
    const line1 = constructTLELine1(tle);
    const line2 = constructTLELine2(tle);
    
    return satellite.twoline2satrec(line1, line2);
  } catch (error) {
    console.error(`Error creating satrec for ${tle?.OBJECT_NAME}:`, error);
    return null;
  }
}

/**
 * Construct TLE Line 1 from JSON orbital elements
 */
function constructTLELine1(tle: TLEData): string {
  const noradId = String(tle.NORAD_CAT_ID).padStart(5, '0');
  const classification = tle.CLASSIFICATION_TYPE || 'U';
  const intlDesig = tle.OBJECT_ID?.replace(/-/g, '').slice(0, 8).padEnd(8, ' ') || '        ';
  
  // Parse epoch
  const epochDate = new Date(tle.EPOCH);
  const year = epochDate.getUTCFullYear() % 100;
  const startOfYear = new Date(Date.UTC(epochDate.getUTCFullYear(), 0, 1));
  const dayOfYear = (epochDate.getTime() - startOfYear.getTime()) / 86400000 + 1;
  const epochStr = `${String(year).padStart(2, '0')}${dayOfYear.toFixed(8).padStart(12, '0')}`;
  
  // Mean motion derivatives
  const meanMotionDot = formatExponential(tle.MEAN_MOTION_DOT || 0);
  const meanMotionDdot = formatExponential(tle.MEAN_MOTION_DDOT || 0);
  const bstar = formatExponential(tle.BSTAR || 0);
  
  const elementSetNo = String(tle.ELEMENT_SET_NO || 999).padStart(4, ' ');
  
  // Build line without checksum
  let line1 = `1 ${noradId}${classification} ${intlDesig} ${epochStr} ${meanMotionDot} ${meanMotionDdot} ${bstar} 0 ${elementSetNo}`;
  line1 = line1.substring(0, 68).padEnd(68, ' ');
  
  // Calculate checksum
  const checksum = calculateChecksum(line1);
  return line1 + checksum;
}

/**
 * Construct TLE Line 2 from JSON orbital elements
 */
function constructTLELine2(tle: TLEData): string {
  const noradId = String(tle.NORAD_CAT_ID).padStart(5, '0');
  const inclination = tle.INCLINATION.toFixed(4).padStart(8, ' ');
  const raan = tle.RA_OF_ASC_NODE.toFixed(4).padStart(8, ' ');
  const eccentricity = tle.ECCENTRICITY.toFixed(7).slice(2); // Remove "0."
  const argPerigee = tle.ARG_OF_PERICENTER.toFixed(4).padStart(8, ' ');
  const meanAnomaly = tle.MEAN_ANOMALY.toFixed(4).padStart(8, ' ');
  const meanMotion = tle.MEAN_MOTION.toFixed(8).padStart(11, ' ');
  const revNum = String(tle.REV_AT_EPOCH || 0).padStart(5, ' ');
  
  let line2 = `2 ${noradId} ${inclination} ${raan} ${eccentricity} ${argPerigee} ${meanAnomaly} ${meanMotion}${revNum}`;
  line2 = line2.substring(0, 68).padEnd(68, ' ');
  
  const checksum = calculateChecksum(line2);
  return line2 + checksum;
}

/**
 * Format a number in TLE exponential notation
 */
function formatExponential(value: number): string {
  if (value === 0) return ' 00000-0';
  
  const sign = value < 0 ? '-' : ' ';
  const absValue = Math.abs(value);
  const exp = Math.floor(Math.log10(absValue));
  const mantissa = absValue / Math.pow(10, exp);
  const mantissaStr = Math.round(mantissa * 10000).toString().padStart(5, '0');
  const expSign = exp >= 0 ? '+' : '-';
  const expStr = Math.abs(exp).toString();
  
  return `${sign}${mantissaStr}${expSign}${expStr}`;
}

/**
 * Calculate TLE line checksum
 */
function calculateChecksum(line: string): number {
  let sum = 0;
  for (const char of line) {
    if (char >= '0' && char <= '9') {
      sum += parseInt(char, 10);
    } else if (char === '-') {
      sum += 1;
    }
  }
  return sum % 10;
}

/**
 * Calculate satellite position at a given time
 * Returns position in Earth-Centered Inertial (ECI) coordinates
 */
export function calculateSatellitePosition(
  satrec: satellite.SatRec,
  date: Date = new Date()
): SatellitePosition | null {
  try {
    const positionAndVelocity = satellite.propagate(satrec, date);
    
    if (!positionAndVelocity || typeof positionAndVelocity.position === 'boolean' || !positionAndVelocity.position) {
      return null;
    }
    
    const positionEci = positionAndVelocity.position as satellite.EciVec3<number>;
    
    // Get geodetic coordinates (lat, lng, altitude)
    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(positionEci, gmst);
    
    // Convert radians to degrees
    const lat = satellite.degreesLat(positionGd.latitude);
    const lng = satellite.degreesLong(positionGd.longitude);
    const altitude = positionGd.height; // km
    
    return {
      x: positionEci.x,
      y: positionEci.y,
      z: positionEci.z,
      lat,
      lng,
      altitude,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Convert ECI coordinates to Three.js coordinates
 * Scales the position relative to the Earth visualization
 */
export function eciToThreeJS(
  position: SatellitePosition,
  earthRadius: number = 1, // Three.js Earth radius
  scale: number = 1 / 6371 // Earth radius in km
): { x: number; y: number; z: number } {
  // ECI coordinates are in km, scale them to match our Three.js scene
  // Also swap Y and Z since ECI has Z as north pole, Three.js has Y as up
  return {
    x: position.x * scale * earthRadius,
    y: position.z * scale * earthRadius, // ECI Z -> Three.js Y (up)
    z: position.y * scale * earthRadius, // ECI Y -> Three.js Z
  };
}

/**
 * Convert lat/lng/altitude to Three.js coordinates
 * More intuitive for Earth-centered view
 */
export function geoToThreeJS(
  lat: number,
  lng: number,
  altitude: number, // km
  earthRadius: number = 1 // Three.js Earth radius (our Earth is 1 unit)
): { x: number; y: number; z: number } {
  const EARTH_RADIUS_KM = 6371;
  
  // Convert to radians
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  
  // Calculate distance from Earth center (in Three.js units)
  const distance = earthRadius * (1 + altitude / EARTH_RADIUS_KM);
  
  // Spherical to Cartesian
  return {
    x: distance * Math.cos(latRad) * Math.cos(lngRad),
    y: distance * Math.sin(latRad), // Y is up in Three.js
    z: distance * Math.cos(latRad) * Math.sin(lngRad),
  };
}
