import { NavLink } from 'react-router-dom';
import { Map, FileText, BarChart2, Settings, Cpu } from 'lucide-react';

const NAV = [
  { to: '/',          icon: Map,       label: 'Live Map'   },
  { to: '/reports',   icon: FileText,  label: 'Reports'    },
  { to: '/analytics', icon: BarChart2, label: 'Analytics'  },
  { to: '/settings',  icon: Settings,  label: 'Agent Logic' },
];

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-5 gap-1 z-10 shrink-0">

        {/* Logo mark */}
        <div className="mb-5 w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center">
          <Cpu size={17} className="text-white" />
        </div>

        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `relative w-10 h-10 rounded-xl flex items-center justify-center transition-all group
               ${isActive
                 ? 'bg-gray-950 text-white shadow-sm'
                 : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'}`
            }
          >
            <Icon size={17} />
            {/* Tooltip */}
            <span className="
              pointer-events-none absolute left-12 bg-gray-900 text-white text-xs
              px-2.5 py-1.5 rounded-lg whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity z-50
              shadow-lg
            ">
              {label}
            </span>
          </NavLink>
        ))}

        {/* Live indicator */}
        <div className="mt-auto mb-2 flex flex-col items-center gap-1">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-gray-300" style={{ fontSize: '8px', letterSpacing: '0.05em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            LIVE
          </span>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}
