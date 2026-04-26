import { NavLink } from 'react-router-dom';
import { Map, FileText, BarChart2, Settings, Cpu, LogOut, Shield, User, Navigation } from 'lucide-react';

const ALL_NAV = [
  { to: '/',          icon: Map,        label: 'Live Map',      roles: ['admin', 'citizen'] },
  { to: '/reports',   icon: FileText,   label: 'Reports',       roles: ['admin', 'citizen'] },
  { to: '/planner',   icon: Navigation, label: 'Route Planner', roles: ['admin', 'citizen'] },
  { to: '/analytics', icon: BarChart2,  label: 'Analytics',     roles: ['admin'] },
  { to: '/settings',  icon: Settings,   label: 'Agent Logic',   roles: ['admin'] },
];

export default function Layout({ children, role, onLogout }) {
  const nav = ALL_NAV.filter((n) => n.roles.includes(role));
  const isAdmin = role === 'admin';

  return (
    <div className="flex h-screen bg-white overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-16 bg-white border-r border-gray-100 flex flex-col items-center py-5 gap-1 z-10 shrink-0">

        {/* Logo */}
        <div className="mb-5 w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center">
          <Cpu size={17} className="text-white" />
        </div>

        {/* Nav links */}
        {nav.map(({ to, icon: Icon, label }) => (
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
            <span className="pointer-events-none absolute left-12 bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
              {label}
            </span>
          </NavLink>
        ))}

        {/* Bottom: role badge + logout */}
        <div className="mt-auto flex flex-col items-center gap-2 mb-1">

          {/* Role indicator */}
          <div
            title={isAdmin ? 'Admin' : 'Citizen'}
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAdmin ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-500'}`}
          >
            {isAdmin ? <Shield size={15} /> : <User size={15} />}
          </div>

          {/* Live dot */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-gray-300" style={{ fontSize: '7px', letterSpacing: '0.05em', writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              LIVE
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Logout"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={15} />
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}