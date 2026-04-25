import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ROUTES, INITIAL_BUSES, INITIAL_TRAFFIC_LIGHTS, INITIAL_PARKING,
  INITIAL_INCIDENTS, AMBULANCE_ROUTE, AGENT_LOG_TEMPLATES,
} from '../data/mockData';

let logSeq = 1;

const interpolate = (bus) => {
  const route = ROUTES[bus.routeId];
  const pts = route.waypoints;
  const cur = pts[bus.waypointIndex];
  const nextIdx = (bus.waypointIndex + 1) % pts.length;
  const nxt = pts[nextIdx];
  const p = bus.progress + 0.18;

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
  id: logSeq++,
  agent,
  message,
  type,
  timestamp: new Date(),
});

export const useSimulation = () => {
  const [buses,         setBuses]         = useState(INITIAL_BUSES);
  const [trafficLights, setTrafficLights] = useState(INITIAL_TRAFFIC_LIGHTS);
  const [parking,       setParking]       = useState(INITIAL_PARKING);
  const [incidents,     setIncidents]     = useState(INITIAL_INCIDENTS);
  const [agentLogs,     setAgentLogs]     = useState([]);
  const [ambulanceActive, setAmbulanceActive] = useState(false);
  const [ambulancePos,    setAmbulancePos]    = useState(AMBULANCE_ROUTE[0]);
  const [showReport,      setShowReport]      = useState(false);

  const ambIdxRef = useRef(0);

  const pushLog = useCallback((log) => {
    setAgentLogs((prev) => [log, ...prev].slice(0, 60));
  }, []);

  // ── Bus movement every 2 s ──────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setBuses((prev) => prev.map(interpolate)), 2000);
    return () => clearInterval(t);
  }, []);

  // ── Traffic-light cycling every 6 s ────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      if (ambulanceActive) return;
      setTrafficLights((prev) =>
        prev.map((l) => ({
          ...l,
          state: Math.random() < 0.25 ? (l.state === 'green' ? 'red' : 'green') : l.state,
        }))
      );
    }, 6000);
    return () => clearInterval(t);
  }, [ambulanceActive]);

  // ── Parking occupancy drift every 9 s ──────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      setParking((prev) =>
        prev.map((p) => ({
          ...p,
          available: Math.max(0, Math.min(p.total, p.available + Math.floor(Math.random() * 5) - 2)),
        }))
      );
    }, 9000);
    return () => clearInterval(t);
  }, []);

  // ── Agent-log ticker every 3.5 s ───────────────────────────────────────
  useEffect(() => {
    // Prime with 6 staggered entries
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const tmpl = pick(AGENT_LOG_TEMPLATES);
        pushLog(makeLog(tmpl.agent, pick(tmpl.messages), tmpl.type));
      }, i * 600);
    }
    const t = setInterval(() => {
      const tmpl = pick(AGENT_LOG_TEMPLATES);
      pushLog(makeLog(tmpl.agent, pick(tmpl.messages), tmpl.type));
    }, 3500);
    return () => clearInterval(t);
  }, [pushLog]);

  // ── Ambulance movement ─────────────────────────────────────────────────
  useEffect(() => {
    if (!ambulanceActive) return;
    const t = setInterval(() => {
      ambIdxRef.current += 1;
      if (ambIdxRef.current >= AMBULANCE_ROUTE.length) {
        setAmbulanceActive(false);
        ambIdxRef.current = 0;
        setAmbulancePos(AMBULANCE_ROUTE[0]);
        setTrafficLights((prev) =>
          prev.map((l) => ({ ...l, state: Math.random() > 0.5 ? 'green' : 'red' }))
        );
        pushLog(makeLog(
          'Ambulance Agent',
          'Priority path completed — returning to stand-by. Traffic lights normalised.',
          'ambulance'
        ));
      } else {
        setAmbulancePos(AMBULANCE_ROUTE[ambIdxRef.current]);
      }
    }, 1500);
    return () => clearInterval(t);
  }, [ambulanceActive, pushLog]);

  // ── Public API ─────────────────────────────────────────────────────────
  const activateAmbulance = useCallback(() => {
    if (ambulanceActive) return;
    ambIdxRef.current = 0;
    setAmbulancePos(AMBULANCE_ROUTE[0]);
    setAmbulanceActive(true);
    setTrafficLights((prev) => prev.map((l) => ({ ...l, state: 'green' })));
    pushLog(makeLog(
      'Ambulance Agent',
      '🚨 PRIORITY PATH ACTIVATED — all intersections set to GREEN',
      'ambulance'
    ));
  }, [ambulanceActive, pushLog]);

  const toggleTrafficLight = useCallback((id) => {
    setTrafficLights((prev) =>
      prev.map((l) => (l.id === id ? { ...l, state: l.state === 'green' ? 'red' : 'green' } : l))
    );
  }, []);

  const addIncident = useCallback((incident) => {
    const id = `I${String(Date.now()).slice(-5)}`;
    const entry = { ...incident, id, status: 'pending', reportedAt: new Date() };
    setIncidents((prev) => [entry, ...prev]);
    pushLog(makeLog(
      'Validation Agent',
      `New report received — ${incident.type} at ${incident.description?.slice(0, 30) || 'reported location'}. Verification in progress…`,
      'validation'
    ));
    setTimeout(() => {
      setIncidents((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: 'verified' } : i))
      );
      pushLog(makeLog(
        'Validation Agent',
        `Report #${id} verified via sensor cross-reference. Maintenance team notified.`,
        'validation'
      ));
    }, 5000);
  }, [pushLog]);

  return {
    buses, trafficLights, parking, incidents, agentLogs,
    ambulanceActive, ambulancePos,
    showReport, setShowReport,
    activateAmbulance, toggleTrafficLight, addIncident,
  };
};
