"use client";
import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import {
  SatelliteCategory,
  SATELLITE_CATEGORIES,
  Satellite,
} from "../types/satellite";

interface SatelliteContextType {
  // Category filtering
  enabledCategories: SatelliteCategory[];
  toggleCategory: (category: SatelliteCategory) => void;
  setEnabledCategories: (categories: SatelliteCategory[]) => void;

  // Visibility
  showSatellites: boolean;
  setShowSatellites: (show: boolean) => void;

  // Helpers
  getCategoryConfig: (category: SatelliteCategory) => {
    label: string;
    color: string;
  };
  allCategories: SatelliteCategory[];

  // Selected satellite for details panel
  selectedSatellite: Satellite | null;
  setSelectedSatellite: (satellite: Satellite | null) => void;
}

export const SatelliteContext = createContext<SatelliteContextType | undefined>(
  undefined,
);

export const useSatelliteContext = () => {
  const context = useContext(SatelliteContext);
  if (!context) {
    throw new Error(
      "useSatelliteContext must be used within SatelliteProvider",
    );
  }
  return context;
};

export const SatelliteProvider = ({ children }: { children: ReactNode }) => {
  const [enabledCategories, setEnabledCategories] = useState<
    SatelliteCategory[]
  >(["stations", "weather", "gps-ops", "science"]);
  const [showSatellites, setShowSatellites] = useState(true);
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | null>(
    null,
  );

  const allCategories: SatelliteCategory[] = [
    "stations",
    "weather",
    "gps-ops",
    "science",
    "starlink",
    "active",
  ];

  const toggleCategory = (category: SatelliteCategory) => {
    setEnabledCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const getCategoryConfig = (category: SatelliteCategory) => ({
    label: SATELLITE_CATEGORIES[category].label,
    color: SATELLITE_CATEGORIES[category].color,
  });

  const value = useMemo(
    () => ({
      enabledCategories,
      toggleCategory,
      setEnabledCategories,
      showSatellites,
      setShowSatellites,
      getCategoryConfig,
      allCategories,
      selectedSatellite,
      setSelectedSatellite,
    }),
    [enabledCategories, showSatellites, selectedSatellite],
  );

  return (
    <SatelliteContext.Provider value={value}>
      {children}
    </SatelliteContext.Provider>
  );
};
