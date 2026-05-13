import { useSimulationContext } from '../context/SimulationContext';
import MapView from './MapView';
import AgentLog from './AgentLog';
import NearestParking from './NearestParking';
import CitizenReportModal from './CitizenReportModal';
import { Bus, AlertTriangle, Activity, Car, Siren, Zap } from 'lucide-react';
import { METRO_LINES, ROUTES } from '../data/mockData';

// Agent definitions for the status strip
const AGENT_DEFS = [
  { type: 'routing',    name: 'Routing',    dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700'   },
  { type: 'traffic',    name: 'Traffic',    dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700'  },
  { type: 'parking',    name: 'Parking',    dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700'},
  { type: 'validation', name: 'Validation', dot: 'bg-violet-500',  bg: 'bg-violet-50',  text: 'text-violet-700' },
  { type: 'ambulance',  name: 'Ambulance',  dot: 'bg-red-500',     bg: 'bg-red-50',     text: 'text-red-700'    },
];

export default function Dashboard() {
  const {
    buses, incidents, parking, agentLogs,
    ambulanceActive, activateAmbulance,
    showReport, setShowReport, addIncident,
    role,
  } = useSimulationContext();

  const isAdmin = role === 'admin';

  const activeBuses      = buses.filter((b) => b.status === 'active').length;
  const currentIncidents = incidents.filter((i) => i.status === 'active' || i.status === 'pending').length;
  const availableParking = parking.reduce((s, p) => s + p.available, 0);
  const systemHealth     = Math.round((activeBuses / buses.length) * 100);

  const STATS = [
    { label: 'Active Buses',      value: activeBuses,        icon: Bus,           accent: 'text-blue-500',    bg: 'bg-blue-50'    },
    { label: 'Current Incidents', value: currentIncidents,   icon: AlertTriangle, accent: 'text-red-500',     bg: 'bg-red-50'     },
    { label: 'Available Parking', value: availableParking,   icon: Car,           accent: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'System Health',     value: `${systemHealth}%`, icon: Activity,      accent: 'text-violet-500',  bg: 'bg-violet-50'  },
  ];

  return (
    <div className="flex flex-col h-screen p-4 gap-3 overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Hebron Smart Mobility</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Digital Twin — {isAdmin ? 'Admin Operations Center' : 'Citizen Portal'}
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          All Systems Online
        </span>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {STATS.map(({ label, value, icon: Icon, accent, bg }) => (
          <div key={label} className="bg-white rounded-xl px-4 py-3.5 border border-gray-100 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
              <Icon size={16} className={accent} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium truncate">{label}</p>
              <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Agent Status Strip (Admin only) ─────────────────────────────── */}
      {isAdmin && (
        <div className="grid grid-cols-5 gap-2 shrink-0">
          {AGENT_DEFS.map(({ type, name, dot, bg, text }) => {
            const lastLog = agentLogs.find((l) => l.type === type);
            return (
              <div key={type} className={`${bg} rounded-xl px-3 py-2.5 border border-white`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse shrink-0`} />
                  <span className={`text-xs font-bold ${text}`}>{name}</span>
                  <Zap size={9} className={`ml-auto ${text} opacity-60`} />
                </div>
                <p className="text-xs text-gray-500 leading-snug line-clamp-2" style={{ fontSize: '10px' }}>
                  {lastLog?.message ?? 'Initialising…'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Map + Agent log ─────────────────────────────────────────────── */}
      <div className="flex gap-3 flex-1 min-h-0">

        {/* Map panel */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden relative">
          <MapView />

          {/* Report FAB */}
          <button
            onClick={() => setShowReport(true)}
            className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <AlertTriangle size={13} />
            Report Issue
          </button>

          {/* Emergency trigger — Admin only */}
          {isAdmin && (
            <button
              onClick={activateAmbulance}
              disabled={ambulanceActive}
              className={`absolute bottom-4 left-4 z-[1000] flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all
                ${ambulanceActive
                  ? 'bg-red-500 text-white animate-pulse cursor-not-allowed'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600'}`}
            >
              <Siren size={13} />
              {ambulanceActive ? 'Emergency Active' : 'Trigger Emergency'}
            </button>
          )}

          {/* Legend */}
          <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl border border-gray-100 shadow-sm px-3 py-2.5 text-xs space-y-1.5">
            {Object.values(ROUTES).map((r) => (
              <div key={r.id} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-gray-500">{r.id} → {r.name.split('→')[1]?.trim()}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-1.5 mt-0.5 space-y-1.5">
              {Object.values(METRO_LINES).map((line) => (
                <div key={line.id} className="flex items-center gap-2">
                  <div className="w-3 h-2 rounded-sm" style={{ background: line.color }} />
                  <span className="text-gray-500">{line.id} — {line.stops[0].name} ↔ {line.stops[line.stops.length - 1].name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent log — Admin only / Nearest Parking — Citizen */}
        {isAdmin
          ? <AgentLog logs={agentLogs} />
          : <NearestParking parking={parking} />
        }
      </div>

      {/* Report modal */}
      {showReport && (
        <CitizenReportModal
          onClose={() => setShowReport(false)}
          onSubmit={addIncident}
        />
      )}
    </div>
  );
}