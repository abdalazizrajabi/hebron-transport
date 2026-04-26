import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ROUTES, INITIAL_BUSES, INITIAL_PARKING,
  INITIAL_INCIDENTS, AMBULANCE_ROUTE, AGENT_LOG_TEMPLATES,
} from '../data/mockData';
import { fetchOSRMRoute } from '../utils/fetchRoute';

let logSeq = 1;

const interpolate = (bus) => {
  const route = ROUTES[bus.routeId];
  const pts = route.waypoints;
  const cur = pts[bus.waypointIndex];
  const nextIdx = (bus.waypointIndex + 1) % pts.length;
  const nxt = pts[nextIdx];
  const p = bus.progress + 0.025;

  if (p >= 1) {
    return {
      ...bus,
      waypointIndex: nextIdx,
      progress: 0,
      lat: nxt[0],
      lng: nxt[1],
      passengers: Math.max(0, Math.min(35, bus.passengers + Math.floor(Math.random() * 5) - 2)),
    };
  }
  return {
    ...bus,
    progress: p,
    lat: cur[0] + (nxt[0] - cur[0]) * p,
    lng: cur[1] + (nxt[1] - cur[1]) * p,
  };
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const makeLog = (agent, message, type) => ({
  id: logSeq++, agent, message, type, timestamp: new Date(),
});

export const useSimulation = () => {
  const [buses,          setBuses]         = useState(INITIAL_BUSES);
  const [parking,        setParking]       = useState(INITIAL_PARKING);
  const [incidents,      setIncidents]     = useState(INITIAL_INCIDENTS);
  const [agentLogs,      setAgentLogs]     = useState([]);
  const [ambulanceActive,setAmbulanceActive] = useState(false);
  const [ambulancePos,   setAmbulancePos]  = useState(AMBULANCE_ROUTE[0]);
  const [showReport,     setShowReport]    = useState(false);

  const [roadRoutes, setRoadRoutes] = useState(
    Object.fromEntries(Object.entries(ROUTES).map(([id, r]) => [id, r.waypoints]))
  );

  const ambIdxRef = useRef(0);

  const pushLog = useCallback((log) => {
    setAgentLogs((prev) => [log, ...prev].slice(0, 60));
  }, []);

  // ── Fetch road-snapped routes from OSRM on mount ──────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      const updates = {};
      for (const [id, route] of Object.entries(ROUTES)) {
        updates[id] = await fetchOSRMRoute(route.waypoints);
      }
      setRoadRoutes(updates);
      pushLog(makeLog('Routing Agent', 'Road network loaded — routes snapped to real Hebron streets', 'routing'));
    };
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Bus movement every 3 s (was 2 s) ─────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setBuses((prev) => prev.map(interpolate)), 5000);
    return () => clearInterval(t);
  }, []);

  // ── Parking drift every 10 s ──────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setParking((prev) =>
        prev.map((p) => ({
          ...p,
          available: Math.max(0, Math.min(p.total, p.available + Math.floor(Math.random() * 5) - 2)),
        }))
      );
    }, 10000);
    return () => clearInterval(t);
  }, []);

  // ── Agent-log ticker every 4 s ────────────────────────────────────────────
  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const tmpl = pick(AGENT_LOG_TEMPLATES);
        pushLog(makeLog(tmpl.agent, pick(tmpl.messages), tmpl.type));
      }, i * 700);
    }
    const t = setInterval(() => {
      const tmpl = pick(AGENT_LOG_TEMPLATES);
      pushLog(makeLog(tmpl.agent, pick(tmpl.messages), tmpl.type));
    }, 4000);
    return () => clearInterval(t);
  }, [pushLog]);

  // ── Ambulance movement every 2 s ─────────────────────────────────────────
  useEffect(() => {
    if (!ambulanceActive) return;
    const t = setInterval(() => {
      ambIdxRef.current += 1;
      if (ambIdxRef.current >= AMBULANCE_ROUTE.length) {
        setAmbulanceActive(false);
        ambIdxRef.current = 0;
        setAmbulancePos(AMBULANCE_ROUTE[0]);
        pushLog(makeLog('Ambulance Agent', 'Priority path completed — stand-by resumed.', 'ambulance'));
      } else {
        setAmbulancePos(AMBULANCE_ROUTE[ambIdxRef.current]);
      }
    }, 2000);
    return () => clearInterval(t);
  }, [ambulanceActive, pushLog]);

  // ── Public API ────────────────────────────────────────────────────────────
  const activateAmbulance = useCallback(() => {
    if (ambulanceActive) return;
    ambIdxRef.current = 0;
    setAmbulancePos(AMBULANCE_ROUTE[0]);
    setAmbulanceActive(true);
    pushLog(makeLog('Ambulance Agent', '🚨 PRIORITY PATH ACTIVATED — emergency vehicle en route', 'ambulance'));
  }, [ambulanceActive, pushLog]);

  const addIncident = useCallback((incident) => {
    const id = `I${String(Date.now()).slice(-5)}`;
    const entry = { ...incident, id, status: 'pending', reportedAt: new Date() };
    setIncidents((prev) => [entry, ...prev]);
    pushLog(makeLog('Validation Agent', `New report received — ${incident.type}. Cross-referencing sensors…`, 'validation'));
    setTimeout(() => {
      setIncidents((prev) => prev.map((i) => (i.id === id ? { ...i, status: 'verified' } : i)));
      pushLog(makeLog('Validation Agent', `Report #${id} verified. Maintenance team notified.`, 'validation'));
    }, 5000);
  }, [pushLog]);

  return {
    buses, parking, incidents, agentLogs, roadRoutes,
    ambulanceActive, ambulancePos,
    showReport, setShowReport,
    activateAmbulance, addIncident,
  };
};