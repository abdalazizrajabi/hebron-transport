import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SimulationContext } from './context/SimulationContext';
import { useSimulation } from './hooks/useSimulation';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import AgentSettings from './components/AgentSettings';
import RoutePlanner from './components/RoutePlanner';

export default function App() {
  const [role, setRole] = useState(null);
  const simulation = useSimulation();

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return (
    <SimulationContext.Provider value={{ ...simulation, role }}>
      <BrowserRouter>
        <Layout role={role} onLogout={() => setRole(null)}>
          <Routes>
            <Route path="/"          element={<Dashboard />}    />
            <Route path="/reports"   element={<Reports />}       />
            <Route path="/analytics" element={<Analytics />}     />
            <Route path="/settings"  element={<AgentSettings />} />
            <Route path="/planner"  element={<RoutePlanner />}  />
          </Routes>
        </Layout>
      </BrowserRouter>
    </SimulationContext.Provider>
  );
}