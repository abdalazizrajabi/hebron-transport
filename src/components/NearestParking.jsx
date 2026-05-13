import { useState } from 'react';
import { MapPin, ParkingSquare } from 'lucide-react';

const MY_LOCS = [
  { name: 'Manara Square',  lat: 31.5314, lng: 35.0998 },
  { name: 'Ein Sara Rd',    lat: 31.5190, lng: 35.0920 },
  { name: 'Old City',       lat: 31.5266, lng: 35.1025 },
  { name: 'Abu Sneineh',    lat: 31.5200, lng: 35.0970 },
  { name: 'Al-Mahatta',     lat: 31.5390, lng: 35.0940 },
  { name: 'H. University',  lat: 31.5065, lng: 35.0820 },
  { name: 'Bab Izone',      lat: 31.5290, lng: 35.0995 },
  { name: 'Al-Hawouz',      lat: 31.5240, lng: 35.0850 },
];

const distM = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function NearestParking({ parking }) {
  const [locName, setLocName] = useState(MY_LOCS[0].name);
  const loc = MY_LOCS.find((l) => l.name === locName);

  const sorted = [...parking]
    .map((p) => ({ ...p, dist: distM(loc.lat, loc.lng, p.lat, p.lng) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 4);

  return (
    <div className="w-60 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-1.5 mb-0.5">
          <ParkingSquare size={13} className="text-emerald-500" />
          <p className="text-xs font-bold text-gray-800">Nearest Parking</p>
        </div>
        <p className="text-xs text-gray-400">Closest available spots</p>
      </div>

      {/* Location picker */}
      <div className="px-3 py-2 border-b border-gray-50">
        <div className="relative">
          <MapPin size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={locName}
            onChange={(e) => setLocName(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 border border-gray-100 rounded-lg text-xs bg-gray-50 text-gray-700 focus:outline-none appearance-none"
          >
            {MY_LOCS.map((l) => <option key={l.name}>{l.name}</option>)}
          </select>
        </div>
      </div>

      {/* Parking list */}
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2">
        {sorted.map((p, i) => {
          const pct = p.available / p.total;
          const color = pct < 0.1 ? '#ef4444' : pct < 0.3 ? '#f59e0b' : '#22c55e';
          const driveMin = Math.max(2, Math.round(p.dist / 300));
          return (
            <div key={p.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-xs font-black text-gray-300">#{i + 1}</span>
                    <p className="text-xs font-semibold text-gray-900 truncate">{p.name}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {p.dist < 1000
                      ? `${Math.round(p.dist)}m`
                      : `${(p.dist / 1000).toFixed(1)}km`}
                    {' · '}~{driveMin} min by car
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold leading-none" style={{ color }}>{p.available}</p>
                  <p className="text-xs text-gray-400">free</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                <div
                  className="h-1 rounded-full transition-all"
                  style={{
                    width: `${Math.round(((p.total - p.available) / p.total) * 100)}%`,
                    background: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
