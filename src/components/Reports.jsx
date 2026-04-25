import { useState } from 'react';
import { useSimulationContext } from '../context/SimulationContext';
import { AlertTriangle, CheckCircle, Clock, MapPin, Filter } from 'lucide-react';

const STATUS = {
  pending:  { label: 'Verification Pending', color: 'text-blue-600',    bg: 'bg-blue-50',    icon: Clock         },
  verified: { label: 'Verified',             color: 'text-amber-600',   bg: 'bg-amber-50',   icon: CheckCircle   },
  active:   { label: 'Active',               color: 'text-red-600',     bg: 'bg-red-50',     icon: AlertTriangle },
  resolved: { label: 'Resolved',             color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle   },
};

const EMOJI = { pothole: '⚠️', closure: '🚧', congestion: '🚦', accident: '💥' };

const SEV_COLOR = { low: 'text-emerald-500', medium: 'text-amber-500', high: 'text-red-500' };

export default function Reports() {
  const { incidents, setShowReport } = useSimulationContext();
  const [filter, setFilter] = useState('all');

  const shown = filter === 'all'
    ? incidents
    : incidents.filter((i) => i.status === filter);

  const counts = {
    all:      incidents.length,
    active:   incidents.filter((i) => i.status === 'active').length,
    pending:  incidents.filter((i) => i.status === 'pending').length,
    verified: incidents.filter((i) => i.status === 'verified').length,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Citizen Reports Archive</h1>
          <p className="text-xs text-gray-400 mt-0.5">{incidents.length} total reports · updated live</p>
        </div>
        <button
          onClick={() => setShowReport(true)}
          className="flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-700 transition-all"
        >
          <AlertTriangle size={13} />
          New Report
        </button>
      </div>

      {/* Summary chips */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { k: 'all',      label: 'All',      color: 'text-gray-900',    bg: 'bg-gray-50'   },
          { k: 'active',   label: 'Active',   color: 'text-red-600',     bg: 'bg-red-50'    },
          { k: 'pending',  label: 'Pending',  color: 'text-blue-600',    bg: 'bg-blue-50'   },
          { k: 'verified', label: 'Verified', color: 'text-amber-600',   bg: 'bg-amber-50'  },
        ].map(({ k, label, color, bg }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-xl px-4 py-3.5 text-left transition-all border-2 ${
              filter === k ? 'border-gray-900 shadow-sm' : 'border-transparent'
            } ${bg}`}
          >
            <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{counts[k]}</p>
          </button>
        ))}
      </div>

      {/* Report cards */}
      <div className="space-y-2.5">
        {shown.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No reports in this category</div>
        )}
        {shown.map((inc) => {
          const s = STATUS[inc.status] ?? STATUS.pending;
          const StatusIcon = s.icon;
          return (
            <div
              key={inc.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3.5 hover:border-gray-200 transition-colors"
            >
              <span className="text-2xl leading-none mt-0.5 shrink-0">{EMOJI[inc.type] ?? '⚠️'}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-semibold text-gray-900 text-sm capitalize">{inc.type}</span>
                    <span className="text-xs text-gray-300 font-mono">#{inc.id}</span>
                  </div>
                  <div className={`flex items-center gap-1 shrink-0 ${s.bg} ${s.color} rounded-full px-2.5 py-1 text-xs font-semibold`}>
                    <StatusIcon size={10} />
                    {s.label}
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-2">{inc.description}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {inc.lat.toFixed(4)}°N, {inc.lng.toFixed(4)}°E
                  </span>
                  <span>{new Date(inc.reportedAt).toLocaleString()}</span>
                  <span className={`font-semibold capitalize ${SEV_COLOR[inc.severity]}`}>
                    {inc.severity} severity
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
