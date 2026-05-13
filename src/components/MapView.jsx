import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useSimulationContext } from '../context/SimulationContext';
import { ROUTES, ALTERNATIVE_ROUTES, AMBULANCE_ROUTE, METRO_LINES, HEBRON_AREAS } from '../data/mockData';

const SCHEDULES = {
  M1: { freq: 20, firstH: 6,  firstM: 0,  lastH: 22, lastM: 0  },
  M2: { freq: 20, firstH: 6,  firstM: 0,  lastH: 22, lastM: 0  },
  M3: { freq: 15, firstH: 6,  firstM: 30, lastH: 21, lastM: 30 },
  M4: { freq: 25, firstH: 6,  firstM: 0,  lastH: 22, lastM: 0  },
};

const genTimes = ({ firstH, firstM, lastH, lastM, freq }) => {
  const times = [];
  let m = firstH * 60 + firstM;
  const end = lastH * 60 + lastM;
  while (m <= end) {
    times.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
    m += freq;
  }
  return times;
};

// ── Icon factories ──────────────────────────────────────────────────────────

const busIcon = (routeId) => L.divIcon({
  className: '',
  iconSize: [34, 34], iconAnchor: [17, 17],
  html: `<div style="background:${ROUTES[routeId]?.color ?? '#3B82F6'};
    width:34px;height:34px;border-radius:9px;
    display:flex;align-items:center;justify-content:center;
    font-size:17px;border:2px solid #fff;
    box-shadow:0 2px 10px rgba(0,0,0,0.18);">🚌</div>`,
});

const parkingIcon = (available, total) => {
  const pct = available / total;
  const color = pct < 0.1 ? '#ef4444' : pct < 0.3 ? '#f59e0b' : '#22c55e';
  return L.divIcon({
    className: '',
    iconSize: [36, 36], iconAnchor: [18, 18],
    html: `<div style="background:#fff;border:2px solid ${color};border-radius:9px;
      width:36px;height:36px;display:flex;flex-direction:column;
      align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.10);font-family:system-ui;">
      <span style="font-size:8px;font-weight:700;color:#9ca3af;line-height:1;">P</span>
      <span style="font-size:11px;font-weight:800;color:${color};line-height:1.2;">${available}</span>
    </div>`,
  });
};

const incidentIcon = (type, status) => {
  const emojiMap = { pothole: '⚠️', closure: '🚧', congestion: '🚦', accident: '💥' };
  const colorMap = { pothole: '#f59e0b', closure: '#ef4444', congestion: '#f97316', accident: '#8b5cf6' };
  const c = colorMap[type] ?? '#6b7280';
  const pulse = status === 'pending' ? 'animation:incPulse 1.4s ease-in-out infinite;' : '';
  return L.divIcon({
    className: '',
    iconSize: [34, 34], iconAnchor: [17, 17],
    html: `<style>@keyframes incPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.12)}}</style>
    <div style="background:${c}18;border:2px solid ${c};border-radius:50%;
      width:34px;height:34px;display:flex;align-items:center;justify-content:center;
      font-size:16px;${pulse}">${emojiMap[type] ?? '⚠️'}</div>`,
  });
};

const metroStopIcon = (color) => L.divIcon({
  className: '',
  iconSize: [14, 14], iconAnchor: [7, 7],
  html: `<div style="background:#fff;border:3px solid ${color};border-radius:50%;
    width:14px;height:14px;box-shadow:0 1px 4px rgba(0,0,0,0.30);"></div>`,
});

const areaIcon = (type) => {
  const cfg = {
    historic:    { bg: '#d97706', emoji: '🏛️' },
    commercial:  { bg: '#2563eb', emoji: '🏪' },
    residential: { bg: '#059669', emoji: '🏘️' },
    transit:     { bg: '#7c3aed', emoji: '🚉' },
  };
  const { bg, emoji } = cfg[type] ?? { bg: '#6b7280', emoji: '📍' };
  return L.divIcon({
    className: '',
    iconSize: [30, 30], iconAnchor: [15, 15],
    html: `<div style="background:${bg};width:30px;height:30px;border-radius:8px;
      display:flex;align-items:center;justify-content:center;font-size:14px;
      border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.22);">${emoji}</div>`,
  });
};

const ambulanceIcon = () => L.divIcon({
  className: '',
  iconSize: [40, 40], iconAnchor: [20, 20],
  html: `<div style="background:#ef4444;border:2.5px solid #fff;
    border-radius:50%;width:40px;height:40px;
    display:flex;align-items:center;justify-content:center;font-size:20px;">🚑</div>`,
});

const Pop = ({ children }) => <div className="p-3 min-w-[140px] font-sans">{children}</div>;

const snapToRoute = (lat, lng, pts) => {
  if (!pts || pts.length < 2) return [lat, lng];
  let minDist = Infinity, snapLat = lat, snapLng = lng;
  for (let i = 0; i < pts.length - 1; i++) {
    const [lat1, lng1] = pts[i];
    const [lat2, lng2] = pts[i + 1];
    const dx = lat2 - lat1, dy = lng2 - lng1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) continue;
    const t = Math.max(0, Math.min(1, ((lat - lat1) * dx + (lng - lng1) * dy) / lenSq));
    const pLat = lat1 + t * dx, pLng = lng1 + t * dy;
    const d = Math.hypot(lat - pLat, lng - pLng);
    if (d < minDist) { minDist = d; snapLat = pLat; snapLng = pLng; }
  }
  return [snapLat, snapLng];
};

const TOGGLE_DEFS = [
  { key: 'buses',     label: 'Buses',     emoji: '🚌' },
  { key: 'metro',     label: 'Metro',     emoji: '🚇' },
  { key: 'areas',     label: 'Areas',     emoji: '🏘️' },
  { key: 'parking',   label: 'Parking',   emoji: '🅿️' },
  { key: 'incidents', label: 'Incidents', emoji: '⚠️' },
];

// ── Component ───────────────────────────────────────────────────────────────
export default function MapView() {
  const {
    buses, parking, incidents,
    ambulanceActive, ambulancePos, roadRoutes,
  } = useSimulationContext();

  const [layers, setLayers] = useState({ buses: true, metro: true, areas: true, parking: true, incidents: true });
  const toggleLayer = (key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  const [activeMetroLine, setActiveMetroLine] = useState(null);

  const hasCongestion = incidents.some((i) => i.type === 'congestion' && i.status === 'active');

  return (
    <div className="h-full w-full relative">

      {/* ── Layer toggle panel ───────────────────────────────────────────── */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1 bg-white/95 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-100">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-0.5">Layers</p>
        {TOGGLE_DEFS.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => toggleLayer(key)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all w-[116px] ${
              layers[key]
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-50 text-gray-400 border border-gray-100'
            }`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="flex-1 text-left">{label}</span>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${layers[key] ? 'bg-emerald-400' : 'bg-gray-300'}`} />
          </button>
        ))}
      </div>

      <MapContainer
        center={[31.51, 35.05]}
        zoom={11}
        minZoom={10}
        maxZoom={16}
        maxBounds={[[31.20, 34.75], [31.80, 35.40]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%' }}
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ── Road-snapped bus route polylines ────────────────────────── */}
        {layers.buses && Object.entries(ROUTES).map(([id, r]) => (
          <Polyline
            key={id}
            positions={roadRoutes?.[id] ?? r.waypoints}
            color={r.color}
            weight={4}
            opacity={0.7}
            dashArray="8 5"
          />
        ))}

        {/* ── Metro lines ─────────────────────────────────────────────── */}
        {layers.metro && Object.values(METRO_LINES).map((line) => (
          <Polyline
            key={line.id}
            positions={line.waypoints}
            color={line.color}
            weight={7}
            opacity={0.88}
            lineCap="round"
            lineJoin="round"
            eventHandlers={{ click: () => setActiveMetroLine(line) }}
          />
        ))}

        {/* ── Metro stops ─────────────────────────────────────────────── */}
        {layers.metro && Object.values(METRO_LINES).flatMap((line) =>
          line.stops.map((stop) => (
            <Marker key={`${line.id}-${stop.id}`} position={[stop.lat, stop.lng]} icon={metroStopIcon(line.color)}>
              <Popup>
                <Pop>
                  <p className="font-bold text-xs" style={{ color: line.color }}>Line {line.id}</p>
                  <p className="font-semibold text-gray-900 text-sm mt-0.5">{stop.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{line.name}</p>
                </Pop>
              </Popup>
            </Marker>
          ))
        )}

        {/* ── Alternative routes when congestion detected ──────────────── */}
        {layers.buses && hasCongestion && ALTERNATIVE_ROUTES.map((ar) => (
          <Polyline key={ar.id} positions={ar.waypoints} color={ar.color} weight={4} opacity={0.75} dashArray="10 5" />
        ))}

        {/* ── Ambulance priority path ──────────────────────────────────── */}
        {ambulanceActive && (
          <Polyline positions={AMBULANCE_ROUTE} color="#ef4444" weight={5} opacity={0.85} dashArray="12 6" />
        )}

        {/* ── Buses ───────────────────────────────────────────────────── */}
        {layers.buses && buses.map((bus) => {
          const [snapLat, snapLng] = snapToRoute(bus.lat, bus.lng, roadRoutes?.[bus.routeId]);
          return (
            <Marker key={bus.id} position={[snapLat, snapLng]} icon={busIcon(bus.routeId)}>
              <Popup>
                <Pop>
                  <p className="font-bold text-gray-900 text-sm">{bus.id} — Route {bus.routeId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{ROUTES[bus.routeId]?.name}</p>
                  <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                    <div>Passengers: <span className="font-semibold text-gray-900">{bus.passengers}</span></div>
                    <div>Status: <span className="text-emerald-600 font-semibold">Active</span></div>
                  </div>
                </Pop>
              </Popup>
            </Marker>
          );
        })}

        {/* ── Parking ─────────────────────────────────────────────────── */}
        {layers.parking && parking.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={parkingIcon(p.available, p.total)}>
            <Popup>
              <Pop>
                <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                <p className="text-xs text-gray-400 capitalize mb-2">{p.type}</p>
                <div className="text-xs text-gray-700">
                  <span className="font-semibold">{p.available}</span> / {p.total} available
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{
                    width: `${Math.round(((p.total - p.available) / p.total) * 100)}%`,
                    background: p.available / p.total < 0.1 ? '#ef4444' : p.available / p.total < 0.3 ? '#f59e0b' : '#22c55e',
                  }} />
                </div>
              </Pop>
            </Popup>
          </Marker>
        ))}

        {/* ── Incidents ────────────────────────────────────────────────── */}
        {layers.incidents && incidents.map((inc) => (
          <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={incidentIcon(inc.type, inc.status)}>
            <Popup>
              <Pop>
                <p className="font-bold text-gray-900 text-sm capitalize">{inc.type}</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{inc.description}</p>
                <p className={`text-xs font-semibold mt-2 ${inc.status === 'active' ? 'text-red-500' : inc.status === 'verified' ? 'text-amber-500' : 'text-blue-500'}`}>
                  {inc.status === 'pending' ? '⏳ Verification Pending' : inc.status === 'verified' ? '✓ Verified' : '🔴 Active'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{inc.severity} severity</p>
              </Pop>
            </Popup>
          </Marker>
        ))}

        {/* ── Ambulance ────────────────────────────────────────────────── */}
        {ambulanceActive && (
          <Marker position={ambulancePos} icon={ambulanceIcon()}>
            <Popup>
              <Pop>
                <p className="font-bold text-red-600 text-sm">🚨 Emergency Vehicle</p>
                <p className="text-xs text-gray-500 mt-0.5">Priority path active</p>
              </Pop>
            </Popup>
          </Marker>
        )}

        {/* ── Neighborhood areas ───────────────────────────────────────── */}
        {layers.areas && HEBRON_AREAS.map((area) => (
          <Marker key={area.id} position={[area.lat, area.lng]} icon={areaIcon(area.type)}>
            <Popup>
              <Pop>
                <p className="font-bold text-gray-900 text-sm">{area.name}</p>
                <p className="text-xs text-gray-400 mb-1">{area.nameAr}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{area.desc}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{area.type}</span>
                  <span className="text-xs text-gray-400">Pop. {area.pop}</span>
                </div>
              </Pop>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* ── Metro schedule overlay ────────────────────────────────────── */}
      {activeMetroLine && (() => {
        const sched = SCHEDULES[activeMetroLine.id];
        const times = genTimes(sched);
        const now = new Date();
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const upcoming = times.filter((t) => {
          const [h, m] = t.split(':').map(Number);
          return h * 60 + m >= nowMins;
        }).slice(0, 3);
        return (
          <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-2xl shadow-xl border border-gray-100 w-80 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex items-start justify-between gap-3" style={{ borderLeft: `4px solid ${activeMetroLine.color}` }}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeMetroLine.color }}>
                  Line {activeMetroLine.id}
                </span>
                <p className="font-bold text-gray-900 text-sm mt-0.5">{activeMetroLine.name}</p>
                <p className="text-xs text-gray-400">
                  {activeMetroLine.stops.length} stations · every {sched.freq} min ·{' '}
                  {String(sched.firstH).padStart(2,'0')}:{String(sched.firstM).padStart(2,'0')}–{String(sched.lastH).padStart(2,'0')}:{String(sched.lastM).padStart(2,'0')}
                </p>
              </div>
              <button
                onClick={() => setActiveMetroLine(null)}
                className="w-7 h-7 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold transition-colors"
              >×</button>
            </div>
            {/* Stops */}
            <div className="px-4 py-2.5 border-t border-gray-50">
              <div className="flex flex-wrap items-center gap-1">
                {activeMetroLine.stops.map((stop, i) => (
                  <span key={stop.id} className="flex items-center gap-1">
                    <span className="text-xs px-2 py-0.5 rounded-md font-semibold"
                      style={{ background: `${activeMetroLine.color}1a`, color: activeMetroLine.color, border: `1px solid ${activeMetroLine.color}30` }}>
                      {stop.name}
                    </span>
                    {i < activeMetroLine.stops.length - 1 && <span className="text-gray-300 text-xs">›</span>}
                  </span>
                ))}
              </div>
            </div>
            {/* Next departures */}
            {upcoming.length > 0 && (
              <div className="px-4 py-2.5 border-t border-gray-50 bg-gray-50">
                <p className="text-xs text-gray-400 mb-1.5">
                  Next from {activeMetroLine.stops[0].name}
                </p>
                <div className="flex gap-1.5">
                  {upcoming.map((t) => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                      style={{ background: activeMetroLine.color }}>{t}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Mini timetable */}
            <div className="px-4 pt-2.5 pb-3 border-t border-gray-50 max-h-28 overflow-y-auto">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full timetable</p>
              <div className="grid grid-cols-6 gap-1">
                {times.map((t) => {
                  const [h, m] = t.split(':').map(Number);
                  const tMins = h * 60 + m;
                  const isPast = tMins < nowMins;
                  const isNext = upcoming[0] === t;
                  return (
                    <div key={t} className="text-center text-xs py-0.5 rounded font-medium"
                      style={isNext
                        ? { background: activeMetroLine.color, color: '#fff', fontWeight: 700 }
                        : isPast ? { color: '#d1d5db' } : { color: '#374151' }}>
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
