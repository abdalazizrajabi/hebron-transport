const STYLE = {
  routing:    { dot: 'bg-blue-500',    text: 'text-blue-600',   bg: 'bg-blue-50'   },
  traffic:    { dot: 'bg-amber-500',   text: 'text-amber-600',  bg: 'bg-amber-50'  },
  parking:    { dot: 'bg-emerald-500', text: 'text-emerald-600',bg: 'bg-emerald-50'},
  validation: { dot: 'bg-violet-500',  text: 'text-violet-600', bg: 'bg-violet-50' },
  ambulance:  { dot: 'bg-red-500',     text: 'text-red-600',    bg: 'bg-red-50'    },
};

const fmt = (d) => {
  const t = new Date(d);
  return `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}:${String(t.getSeconds()).padStart(2,'0')}`;
};

export default function AgentLog({ logs }) {
  return (
    <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-900">Agent Activity</span>
        </div>
        <span className="text-xs text-gray-400 tabular-nums">{logs.length} events</span>
      </div>

      {/* Log entries */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 scrollbar-thin">
        {logs.map((log) => {
          const s = STYLE[log.type] ?? STYLE.routing;
          return (
            <div key={log.id} className={`log-entry rounded-lg p-2.5 ${s.bg}`}>
              <div className="flex items-center gap-1.5 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                <span className={`text-xs font-semibold ${s.text} truncate`}>{log.agent}</span>
                <span className="text-gray-400 ml-auto text-xs tabular-nums shrink-0">{fmt(log.timestamp)}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{log.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
