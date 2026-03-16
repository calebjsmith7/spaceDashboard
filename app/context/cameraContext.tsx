"use client";
import {createContext, useContext, useState, useEffect, useMemo} from 'react';

export const CameraContext = createContext({
  center: "sun" as "earth" | "sun",
  setCenter: (center: "earth" | "sun") => {
    center;
  },
});

export const useCameraContext = () => useContext(CameraContext);

export const CameraProvider = ({children} : {children: React.ReactNode}) => {
    const [center, setCenter] = useState<"earth" | "sun">("sun");


    const value = useMemo(() => ({
        center,
        setCenter
    }),[center])

    return(
        <CameraContext.Provider value={value}>
            {children}
        </CameraContext.Provider>
    )
};
