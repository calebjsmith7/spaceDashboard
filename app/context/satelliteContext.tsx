"use client";
import {createContext, useContext, useState, useEffect, useMemo} from 'react';

type Satellite = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
    velocity: number;
    timestamp: number;
};

export const SatelliteContext = createContext<{ satelliteData: Satellite[] }>({
    satelliteData: []
});

export const useSatelliteContext = () => useContext(SatelliteContext);

export const SatelliteProvider = ({children} : {children: React.ReactNode}) => {
    const [satelliteData, setSatelliteData] = useState<Satellite[]>([]);

    useEffect(()=>{
        // setSatelliteData TODO
    },[])

    const value = useMemo(() => ({
        satelliteData,
    }),[satelliteData])

    return(
        <SatelliteContext.Provider value={value}>
            {children}
        </SatelliteContext.Provider>
    )
};
