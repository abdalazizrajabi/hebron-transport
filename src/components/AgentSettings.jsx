import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';

const AGENTS = [
  {
    id: 'routing', name: 'Routing Agent', color: 'bg-blue-500',
    description: 'Computes optimal routes and alternative detours when congestion or closures are detected.',
    settings: [
      { key: 'detour_threshold', label: 'Detour Trigger — congestion %', type: 'range', min: 30,  max: 90,  step: 5,  default: 60 },
      { key: 'recalc_interval',  label: 'Re-calculation Interval (s)',   type: 'range', min: 10,  max: 120, step: 10, default: 30 },
      { key: 'max_alternatives', label: 'Max Alternative Routes',        type: 'range', min: 1,   max: 5,   step: 1,  default: 2  },
      { key: 'predictive_mode',  label: 'Predictive Routing Mode',       type: 'toggle', default: true },
    ],
  },
  {
    id: 'traffic', name: 'Traffic Agent', color: 'bg-amber-500',
    description: 'Manages adaptive signal cycles, green-wave coordination, and peak-hour optimisation.',
    settings: [
      { key: 'green_extension',  label: 'Max Green Extension (s)',     type: 'range',  min: 10, max: 120, step: 5, default: 45   },
      { key: 'wave_speed',       label: 'Green Wave Speed (km/h)',     type: 'range',  min: 20, max: 70,  step: 5, default: 40   },
      { key: 'peak_mode',        label: 'Peak-Hour Adaptive Mode',     type: 'toggle', default: true },
      { key: 'night_mode',       label: 'Night Mode (reduced cycles)', type: 'toggle', default: false },
    ],
  },
  {
    id: 'parking', name: 'Parking Agent', color: 'bg-emerald-500',
    description: 'Monitors occupancy across all facilities and redirects vehicles via smart guidance signs.',
    settings: [
      { key: 'redirect_threshold', label: 'Redirect at Occupancy (%)',    type: 'range',  min: 50, max: 95, step: 5, default: 80 },
      { key: 'predict_window',     label: 'Prediction Horizon (min)',      type: 'range',  min: 5,  max: 30, step: 5, default: 15 },
      { key: 'smart_signs',        label: 'Smart Guidance Signs',          type: 'toggle', default: true },
      { key: 'reservation_mode',   label: 'Advance Reservation Mode',      type: 'toggle', default: false },
    ],
  },
  {
    id: 'validation', name: 'Validation Agent', color: 'bg-violet-500',
    description: 'Cross-references citizen reports against sensor and camera feeds for automated verification.',
    settings: [
      { key: 'auto_verify',       label: 'Auto-Verification',              type: 'toggle', default: true  },
      { key: 'verify_timeout',    label: 'Verification Timeout (s)',       type: 'range',  min: 30, max: 300, step: 30, default: 60 },
      { key: 'confidence_thresh', label: 'Confidence Threshold (%)',       type: 'range',  min: 50, max: 99,  step: 5,  default: 80 },
      { key: 'ml_assist',         label: 'ML-Assisted Classification',     type: 'toggle', default: true  },
    ],
  },
  {
    id: 'ambulance', name: 'Ambulance Agent', color: 'bg-red-500',
    description: 'Handles emergency vehicle routing and automatic traffic-light pre-emption along the route.',
    settings: [
      { key: 'clearance_radius', label: 'Signal Clearance Radius (m)',    type: 'range',  min: 100, max: 1000, step: 50, default: 500 },
      { key: 'preempt_time',     label: 'Pre-emption Lead Time (s)',      type: 'range',  min: 5,   max: 60,   step: 5,  default: 20  },
      { key: 'auto_dispatch',    label: 'Auto-Dispatch on Report',        type: 'toggle', default: false },
      { key: 'route_logging',    label: 'Log All Priority Events',        type: 'toggle', default: true  },
    ],
  },
];

const buildDefaults = () => {
  const m = {};
  AGENTS.forEach((a) => a.settings.forEach((s) => { m[`${a.id}.${s.key}`] = s.default; }));
  return m;
};

export default function AgentSettings() {
  const [vals,  setVals]  = useState(buildDefaults);
  const [saved, setSaved] = useState(false);

  const set = (agentId, key, value) => {
    setVals((p) => ({ ...p, [`${agentId}.${key}`]: value }));
    setSaved(false);
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2200); };
  const reset = () => { setVals(buildDefaults()); setSaved(false); };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Agent Logic Settings</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure parameters for each MAS agent</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-3.5 py-2 border border-gray-100 text-gray-500 rounded-xl text-xs font-semibold hover:bg-gray-50 transition-all"
          >
            <RotateCcw size={13} /> Reset
          </button>
          <button
            onClick={save}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all
              ${saved ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
          >
            <Save size={13} />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {AGENTS.map((agent) => (
          <div key={agent.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Agent header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className={`w-2.5 h-2.5 rounded-full ${agent.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{agent.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{agent.description}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 rounded-full px-2.5 py-1 shrink-0">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold">Active</span>
              </div>
            </div>

            {/* Settings */}
            <div className="px-5 py-4 space-y-4">
              {agent.settings.map((s) => {
                const v = vals[`${agent.id}.${s.key}`];
                return (
                  <div key={s.key} className="flex items-center gap-4">
                    <label className="flex-1 text-sm text-gray-700 select-none">{s.label}</label>
                    {s.type === 'toggle' ? (
                      <button
                        onClick={() => set(agent.id, s.key, !v)}
                        className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${v ? 'bg-gray-900' : 'bg-gray-200'}`}
                        aria-pressed={v}
                      >
                        <div
                          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200"
                          style={{ left: v ? '1.375rem' : '0.125rem' }}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-3 shrink-0 w-52">
                        <input
                          type="range"
                          min={s.min} max={s.max} step={s.step ?? 1}
                          value={v}
                          onChange={(e) => set(agent.id, s.key, Number(e.target.value))}
                          className="flex-1 h-1 accent-gray-900 cursor-pointer"
                        />
                        <span className="text-sm font-semibold text-gray-900 w-10 text-right tabular-nums">{v}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
