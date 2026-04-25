import { createContext, useContext } from 'react';

export const SimulationContext = createContext(null);
export const useSimulationContext = () => useContext(SimulationContext);
