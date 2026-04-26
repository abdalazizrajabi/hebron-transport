import { useState } from 'react';
import { Navigation, ArrowRight, RefreshCw, Clock, MapPin } from 'lucide-react';

const ROUTE_STOPS = {
  H1: { color: '#3B82F6', label: 'Halhul Line', stops: [
    { name: 'Manara Square' },
    { name: 'Al-Mahatta' },
    { name: 'Al-Fahs' },
    { name: 'Halhul Center' },
  ]},
  H2: { color: '#10B981', label: "Sa'ir Line", stops: [
    { name: 'Manara Square' },
    { name: 'Ash-Shuyukh' },
    { name: "Sa'ir Center" },
  ]},
  H3: { color: '#F97316', label: 'Yatta Line', stops: [
    { name: 'Manara Square' },
    { name: 'Abu Sneineh' },
    { name: 'H. University' },
    { name: 'Yatta Junction' },
    { name: 'Yatta Center' },
  ]},
  H4: { color: '#8B5CF6', label: 'Dura Line', stops: [
    { name: 'Manara Square' },
    { name: 'Al-Hawouz' },
    { name: 'Wadi Al-Haramiyeh' },
    { name: 'Dura Center' },
  ]},
  H5: { color: '#EC4899', label: 'Taffuh Line', stops: [
    { name: 'Manara Square' },
    { name: 'Jabal Jawhar' },
    { name: 'Beit Kahil' },
    { name: 'Taffuh Center' },
  ]},
};

const ALL_STOPS = [...new Set(
  Object.values(ROUTE_STOPS).flatMap((r) => r.stops.map((s) => s.name))
)];

const MANARA = 'Manara Square';

const planTrip = (from, to) => {
  if (!from || !to || from === to) return null;

  // Try direct route first
  for (const [routeId, { color, label, stops }] of Object.entries(ROUTE_STOPS)) {
    const fromIdx = stops.findIndex((s) => s.name === from);
    const toIdx   = stops.findIndex((s) => s.name === to);
    if (fromIdx === -1 || toIdx === -1) continue;
    const forward      = toIdx > fromIdx;
    const orderedStops = forward
      ? stops.slice(fromIdx, toIdx + 1)
      : [...stops.slice(toIdx, fromIdx + 1)].reverse();
    return {
      type: 'direct',
      routeId, color, label,
      stops: orderedStops,
      stopsCount: Math.abs(toIdx - fromIdx),
      minutes: Math.abs(toIdx - fromIdx) * 7 + 5,
    };
  }

  // Transfer via Manara
  let leg1 = null, leg2 = null;
  for (const [routeId, r] of Object.entries(ROUTE_STOPS)) {
    if (r.stops.find((s) => s.name === from) && r.stops.find((s) => s.name === MANARA))
      leg1 = { routeId, ...r };
    if (r.stops.find((s) => s.name === to) && r.stops.find((s) => s.name === MANARA))
      leg2 = { routeId, ...r };
  }
  if (leg1 && leg2)
    return { type: 'transfer', leg1, leg2, via: MANARA, minutes: 25 };

  return { type: 'none' };
};

export default function RoutePlanner() {
  const [from,   setFrom]   = useState('');
  const [to,     setTo]     = useState('');
  const [result, setResult] = useState(null);

  const swap = () => { setFrom(to); setTo(from); setResult(null); };

  const handlePlan = () => setResult(planTrip(from, to));

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center shrink-0">
          <Navigation size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Route Planner</h1>
          <p className="text-xs text-gray-400">Find the best bus between any two stops</p>
        </div>
      </div>

      {/* Input card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4 space-y-3">

        {/* From */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5">From</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
            <select
              value={from}
              onChange={(e) => { setFrom(e.target.value); setResult(null); }}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gray-200 appearance-none"
            >
              <option value="">Select departure stop…</option>
              {ALL_STOPS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Swap */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <button
            onClick={swap}
            className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all"
          >
            <RefreshCw size={12} />
          </button>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* To */}
        <div>
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1.5">To</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-red-500 rounded-full" />
            <select
              value={to}
              onChange={(e) => { setTo(e.target.value); setResult(null); }}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gray-200 appearance-none"
            >
              <option value="">Select destination stop…</option>
              {ALL_STOPS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={handlePlan}
          disabled={!from || !to || from === to}
          className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Navigation size={14} />
          Find Route
        </button>
      </div>

      {/* ── Direct route result ── */}
      {result?.type === 'direct' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between"
            style={{ borderLeftColor: result.color, borderLeftWidth: 4 }}>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: result.color }}>
                Line {result.routeId}
              </span>
              <h3 className="font-bold text-gray-900 text-sm mt-0.5">{result.label}</h3>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-bold text-gray-900">{result.minutes}</span>
                <span className="text-sm text-gray-400">min</span>
              </div>
              <p className="text-xs text-gray-400">{result.stopsCount} stop{result.stopsCount !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Stops timeline */}
          <div className="px-5 py-4">
            {result.stops.map((stop, i) => (
              <div key={stop.name} className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className="w-3 h-3 rounded-full border-2 shrink-0"
                    style={{
                      borderColor: i === 0 ? '#22c55e' : i === result.stops.length - 1 ? '#ef4444' : result.color,
                      background:  i === 0 ? '#22c55e' : i === result.stops.length - 1 ? '#ef4444' : '#fff',
                    }}
                  />
                  {i < result.stops.length - 1 && (
                    <div className="w-0.5 h-7 mt-1 rounded-full" style={{ background: result.color, opacity: 0.25 }} />
                  )}
                </div>
                <div className="pb-5">
                  <p className={`text-sm font-semibold leading-tight ${i === 0 || i === result.stops.length - 1 ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stop.name}
                  </p>
                  {i === 0 && <p className="text-xs text-emerald-600 mt-0.5">Board here</p>}
                  {i === result.stops.length - 1 && <p className="text-xs text-red-500 mt-0.5">Alight here</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <Clock size={11} />
            Estimated travel time: <strong className="text-gray-700">{result.minutes} minutes</strong>
          </div>
        </div>
      )}

      {/* ── Transfer result ── */}
      {result?.type === 'transfer' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Transfer Required</p>
          </div>
          <div className="px-5 py-4 space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: result.leg1.color }} />
              <span className="text-sm text-gray-700">
                Take <strong style={{ color: result.leg1.color }}>Line {result.leg1.routeId}</strong> → {result.via}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 py-1">
              <MapPin size={10} />
              Transfer at <strong>{result.via}</strong>
              <ArrowRight size={10} />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: result.leg2.color }} />
              <span className="text-sm text-gray-700">
                Board <strong style={{ color: result.leg2.color }}>Line {result.leg2.routeId}</strong> — {result.leg2.label}
              </span>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
            <Clock size={11} />
            Estimated travel time: <strong className="text-gray-700">~{result.minutes} minutes</strong>
          </div>
        </div>
      )}

      {/* ── No route ── */}
      {result?.type === 'none' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-sm font-semibold text-gray-900">No direct route found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different combination of stops.</p>
        </div>
      )}
    </div>
  );
}