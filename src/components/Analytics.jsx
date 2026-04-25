import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useSimulationContext } from '../context/SimulationContext';

// ── Static / seeded chart data ───────────────────────────────────────────────
const TRAFFIC_24H = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, '0')}:00`,
  efficiency: Math.round(55 + Math.sin(i * 0.28) * 28 + (i % 3) * 3),
  volume:     Math.round(180 + Math.sin(i * 0.42) * 140 + (i % 5) * 20),
}));

const WEEKLY_REPORTS = [
  { day: 'Mon', resolved: 8,  pending: 3 },
  { day: 'Tue', resolved: 12, pending: 5 },
  { day: 'Wed', resolved: 7,  pending: 2 },
  { day: 'Thu', resolved: 15, pending: 4 },
  { day: 'Fri', resolved: 10, pending: 6 },
  { day: 'Sat', resolved: 5,  pending: 1 },
  { day: 'Sun', resolved: 3,  pending: 0 },
];

// ── Custom tooltip ───────────────────────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2 text-xs">
      {label && <p className="font-semibold text-gray-700 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color ?? p.fill }}>{p.name}: <span className="font-semibold">{p.value}</span></p>
      ))}
    </div>
  );
};

// ── Component ────────────────────────────────────────────────────────────────
export default function Analytics() {
  const { parking, incidents, buses } = useSimulationContext();

  const totalCap       = parking.reduce((s, p) => s + p.total, 0);
  const totalAvail     = parking.reduce((s, p) => s + p.available, 0);
  const totalOccupied  = totalCap - totalAvail;
  const occPct         = Math.round((totalOccupied / totalCap) * 100);
  const resolved       = incidents.filter((i) => i.status === 'verified').length;
  const activeBuses    = buses.filter((b) => b.status === 'active').length;

  const pieData = useMemo(() => [
    { name: 'Available', value: totalAvail   },
    { name: 'Occupied',  value: totalOccupied },
  ], [totalAvail, totalOccupied]);

  const summary = [
    { label: 'Traffic Efficiency', value: '78%',        sub: '+4% vs yesterday', pos: true  },
    { label: 'Reports Resolved',   value: resolved,      sub: 'this week',        pos: true  },
    { label: 'Parking Occupancy',  value: `${occPct}%`, sub: `${totalAvail} free`, pos: totalAvail > 50 },
    { label: 'Active Buses',       value: activeBuses,   sub: '3 routes running', pos: true  },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">System Analytics</h1>
        <p className="text-xs text-gray-400 mt-0.5">Real-time performance metrics — Hebron Mobility Network</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {summary.map(({ label, value, sub, pos }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className={`text-xs mt-1 font-medium ${pos ? 'text-emerald-500' : 'text-red-400'}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">

        {/* 24h traffic — full width */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">24-Hour Traffic Flow &amp; Volume</h3>
          <p className="text-xs text-gray-400 mb-4">Efficiency index vs vehicle volume across the network</p>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={TRAFFIC_24H}>
              <defs>
                <linearGradient id="gEff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.14}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gVol" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.14}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="efficiency" name="Efficiency %" stroke="#3B82F6" strokeWidth={2} fill="url(#gEff)" />
              <Area type="monotone" dataKey="volume"     name="Volume"       stroke="#10B981" strokeWidth={2} fill="url(#gVol)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly reports */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Weekly Citizen Reports</h3>
          <p className="text-xs text-gray-400 mb-4">Resolved vs pending per day</p>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={WEEKLY_REPORTS} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="pending"  name="Pending"  fill="#f1f5f9" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Parking occupancy */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Parking Occupancy</h3>
          <p className="text-xs text-gray-400 mb-4">City-wide breakdown across all facilities</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="45%" height={170}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={42} outerRadius={60} dataKey="value" strokeWidth={0}>
                  <Cell fill="#22c55e" />
                  <Cell fill="#f1f5f9" />
                </Pie>
                <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 18, fontWeight: 700, fill: '#111827' }}>
                  {occPct}%
                </text>
                <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fill: '#9ca3af' }}>
                  occupied
                </text>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {parking.map((p) => {
                const pct = Math.round(((p.total - p.available) / p.total) * 100);
                return (
                  <div key={p.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 truncate pr-1">{p.name}</span>
                      <span className="font-semibold text-gray-900 shrink-0">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          background: pct > 90 ? '#ef4444' : pct > 70 ? '#f59e0b' : '#22c55e',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
