import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useSimulationContext } from '../context/SimulationContext';
import { ROUTES, ALTERNATIVE_ROUTES, AMBULANCE_ROUTE } from '../data/mockData';

// ── Icon factories ──────────────────────────────────────────────────────────

const busIcon = (routeId) => L.divIcon({
  className: '',
  iconSize:  [34, 34],
  iconAnchor:[17, 17],
  html: `
    <div style="
      background:${ROUTES[routeId]?.color ?? '#3B82F6'};
      width:34px;height:34px;border-radius:9px;
      display:flex;align-items:center;justify-content:center;
      font-size:17px;border:2px solid #fff;
      box-shadow:0 2px 10px rgba(0,0,0,0.18);
    ">🚌</div>`,
});

const trafficIcon = (state) => L.divIcon({
  className: '',
  iconSize:  [30, 30],
  iconAnchor:[15, 15],
  html: `
    <div style="
      background:#fff;border:1.5px solid #e5e7eb;border-radius:8px;
      width:30px;height:30px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;
    ">
      <div style="
        width:14px;height:14px;border-radius:50%;
        background:${state === 'green' ? '#22c55e' : '#ef4444'};
        box-shadow:0 0 8px ${state === 'green' ? 'rgba(34,197,94,.7)' : 'rgba(239,68,68,.7)'};
      "></div>
    </div>`,
});

const parkingIcon = (available, total) => {
  const pct = available / total;
  const color = pct < 0.1 ? '#ef4444' : pct < 0.3 ? '#f59e0b' : '#22c55e';
  return L.divIcon({
    className: '',
    iconSize:  [36, 36],
    iconAnchor:[18, 18],
    html: `
      <div style="
        background:#fff;border:2px solid ${color};border-radius:9px;
        width:36px;height:36px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,0.10);
        font-family:system-ui;
      ">
        <span style="font-size:8px;font-weight:700;color:#9ca3af;line-height:1;">P</span>
        <span style="font-size:11px;font-weight:800;color:${color};line-height:1.2;">${available}</span>
      </div>`,
  });
};

const incidentIcon = (type, status) => {
  const map = { pothole:'⚠️', closure:'🚧', congestion:'🚦', accident:'💥' };
  const clr = { pothole:'#f59e0b', closure:'#ef4444', congestion:'#f97316', accident:'#8b5cf6' };
  const c = clr[type] ?? '#6b7280';
  const pulse = status === 'pending'
    ? `animation:incPulse 1.4s ease-in-out infinite;`
    : '';
  return L.divIcon({
    className: '',
    iconSize:  [34, 34],
    iconAnchor:[17, 17],
    html: `
      <style>@keyframes incPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.12)}}</style>
      <div style="
        background:${c}18;border:2px solid ${c};border-radius:50%;
        width:34px;height:34px;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;${pulse}
      ">${map[type] ?? '⚠️'}</div>`,
  });
};

const ambulanceIcon = () => L.divIcon({
  className: '',
  iconSize:  [40, 40],
  iconAnchor:[20, 20],
  html: `
    <div class="ambulance-ring" style="
      background:#ef4444;border:2.5px solid #fff;border-radius:50%;
      width:40px;height:40px;
      display:flex;align-items:center;justify-content:center;
      font-size:20px;
    ">🚑</div>`,
});

// ── Popup helper ────────────────────────────────────────────────────────────
const Pop = ({ children }) => (
  <div className="p-3 min-w-[140px] font-sans">{children}</div>
);

// ── Component ───────────────────────────────────────────────────────────────
export default function MapView() {
  const {
    buses, trafficLights, parking, incidents,
    ambulanceActive, ambulancePos,
    toggleTrafficLight,
  } = useSimulationContext();

  const hasCongestion = incidents.some(
    (i) => i.type === 'congestion' && i.status === 'active'
  );

  return (
    <MapContainer
      center={[31.5297, 35.0917]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* ── Route ghost lines ───────────────────────────────────────────── */}
      {Object.values(ROUTES).map((r) => (
        <Polyline
          key={r.id}
          positions={r.waypoints}
          color={r.color}
          weight={3}
          opacity={0.35}
          dashArray="7 5"
        />
      ))}

      {/* ── Alternative routes (shown when congestion active) ───────────── */}
      {hasCongestion && ALTERNATIVE_ROUTES.map((ar) => (
        <Polyline
          key={ar.id}
          positions={ar.waypoints}
          color={ar.color}
          weight={4}
          opacity={0.75}
          dashArray="10 5"
        />
      ))}

      {/* ── Ambulance priority path ─────────────────────────────────────── */}
      {ambulanceActive && (
        <Polyline
          positions={AMBULANCE_ROUTE}
          color="#ef4444"
          weight={5}
          opacity={0.85}
          dashArray="12 6"
        />
      )}

      {/* ── Buses ───────────────────────────────────────────────────────── */}
      {buses.map((bus) => (
        <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon(bus.routeId)}>
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
      ))}

      {/* ── Traffic lights ──────────────────────────────────────────────── */}
      {trafficLights.map((tl) => (
        <Marker
          key={tl.id}
          position={[tl.lat, tl.lng]}
          icon={trafficIcon(tl.state)}
          eventHandlers={{ click: () => toggleTrafficLight(tl.id) }}
        >
          <Popup>
            <Pop>
              <p className="font-bold text-gray-900 text-sm">{tl.name}</p>
              <p className={`text-xs font-semibold mt-1 ${tl.state === 'green' ? 'text-emerald-600' : 'text-red-600'}`}>
                ● {tl.state.toUpperCase()}
              </p>
              <p className="text-xs text-gray-400 mt-1">Click marker to toggle</p>
            </Pop>
          </Popup>
        </Marker>
      ))}

      {/* ── Parking ─────────────────────────────────────────────────────── */}
      {parking.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={parkingIcon(p.available, p.total)}>
          <Popup>
            <Pop>
              <p className="font-bold text-gray-900 text-sm">{p.name}</p>
              <p className="text-xs text-gray-400 capitalize mb-2">{p.type}</p>
              <div className="text-xs text-gray-700">
                <span className="font-semibold">{p.available}</span> / {p.total} available
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.round(((p.total - p.available) / p.total) * 100)}%`,
                    background: p.available / p.total < 0.1 ? '#ef4444' : p.available / p.total < 0.3 ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
            </Pop>
          </Popup>
        </Marker>
      ))}

      {/* ── Incidents ───────────────────────────────────────────────────── */}
      {incidents.map((inc) => (
        <Marker key={inc.id} position={[inc.lat, inc.lng]} icon={incidentIcon(inc.type, inc.status)}>
          <Popup>
            <Pop>
              <p className="font-bold text-gray-900 text-sm capitalize">{inc.type}</p>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{inc.description}</p>
              <p className={`text-xs font-semibold mt-2 ${
                inc.status === 'active'   ? 'text-red-500' :
                inc.status === 'verified' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {inc.status === 'pending'  ? '⏳ Verification Pending' :
                 inc.status === 'verified' ? '✓ Verified' : '🔴 Active'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{inc.severity} severity</p>
            </Pop>
          </Popup>
        </Marker>
      ))}

      {/* ── Ambulance ───────────────────────────────────────────────────── */}
      {ambulanceActive && (
        <Marker position={ambulancePos} icon={ambulanceIcon()}>
          <Popup>
            <Pop>
              <p className="font-bold text-red-600 text-sm">🚨 Emergency Vehicle</p>
              <p className="text-xs text-gray-500 mt-0.5">Priority path active</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">All signals: GREEN</p>
            </Pop>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
