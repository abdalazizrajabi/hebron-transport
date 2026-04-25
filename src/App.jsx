import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SimulationContext } from './context/SimulationContext';
import { useSimulation } from './hooks/useSimulation';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import AgentSettings from './components/AgentSettings';

export default function App() {
  const simulation = useSimulation();

  return (
    <SimulationContext.Provider value={simulation}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/"          element={<Dashboard />}     />
            <Route path="/reports"   element={<Reports />}        />
            <Route path="/analytics" element={<Analytics />}      />
            <Route path="/settings"  element={<AgentSettings />}  />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SimulationContext.Provider>
  );
}
