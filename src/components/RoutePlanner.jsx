import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, RefreshCw, Clock, Car, Bus, Footprints, MapPin } from 'lucide-react';

// ── Real Hebron places ──────────────────────────────────────────────────────
const PLACES = [
  // City center & landmarks
  { name: 'Manara Square',               lat: 31.5314, lng: 35.0998, area: 'City Center' },
  { name: 'Bab Al-Zawiyeh',              lat: 31.5308, lng: 35.0990, area: 'City Center' },
  { name: 'Al-Qasaba (Old Market)',      lat: 31.5262, lng: 35.1022, area: 'City Center' },
  { name: 'Ibrahimi Mosque',             lat: 31.5247, lng: 35.1042, area: 'City Center' },
  { name: 'Al-Mahatta Bus Terminal',     lat: 31.5586, lng: 35.0916, area: 'City Center' },
  { name: 'Bab Al-Baladiyeh',            lat: 31.5300, lng: 35.1005, area: 'City Center' },
  { name: 'Al-Sahla Market',             lat: 31.5270, lng: 35.1010, area: 'City Center' },
  { name: 'Manara Roundabout',           lat: 31.5314, lng: 35.0998, area: 'City Center' },
  // Neighborhoods
  { name: 'Abu Sneineh',                 lat: 31.5453, lng: 35.0892, area: 'Neighborhoods' },
  { name: 'Al-Hawouz',                   lat: 31.5378, lng: 35.1072, area: 'Neighborhoods' },
  { name: 'Wadi Al-Hariya',              lat: 31.5278, lng: 35.0855, area: 'Neighborhoods' },
  { name: 'Jabal Johar',                 lat: 31.5118, lng: 35.0818, area: 'Neighborhoods' },
  { name: 'Ras Al-Jura',                 lat: 31.5236, lng: 35.1104, area: 'Neighborhoods' },
  { name: 'Al-Bayader',                  lat: 31.5189, lng: 35.1085, area: 'Neighborhoods' },
  { name: 'Tel Rumeida',                 lat: 31.5277, lng: 35.0976, area: 'Neighborhoods' },
  { name: 'Haret Al-Sheikh',             lat: 31.5264, lng: 35.1021, area: 'Neighborhoods' },
  { name: 'Al-Salam District',           lat: 31.5506, lng: 35.0844, area: 'Neighborhoods' },
  { name: 'Khaled Ibn Al-Walid',         lat: 31.5355, lng: 35.0852, area: 'Neighborhoods' },
  { name: 'Al-Zeitouneh',                lat: 31.5423, lng: 35.1052, area: 'Neighborhoods' },
  { name: 'Jabal Al-Rehan',              lat: 31.5084, lng: 35.0878, area: 'Neighborhoods' },
  { name: 'Ein Sara',                    lat: 31.5190, lng: 35.0920, area: 'Neighborhoods' },
  { name: 'Beit Einun',                  lat: 31.5450, lng: 35.1250, area: 'Neighborhoods' },
  { name: 'Al-Ras',                      lat: 31.5330, lng: 35.1070, area: 'Neighborhoods' },
  { name: 'Wadi Al-Tuffah',              lat: 31.5050, lng: 35.0950, area: 'Neighborhoods' },
  // Universities, schools & hospitals
  { name: 'Palestine Polytechnic Univ.', lat: 31.5065, lng: 35.0820, area: 'Institutions' },
  { name: 'Hebron University',           lat: 31.5057, lng: 35.0788, area: 'Institutions' },
  { name: 'Al-Quds Open University',     lat: 31.5320, lng: 35.0960, area: 'Institutions' },
  { name: 'Governmental Hospital',       lat: 31.5196, lng: 35.0850, area: 'Institutions' },
  { name: 'Al-Ahli Hospital',            lat: 31.5220, lng: 35.0940, area: 'Institutions' },
  { name: 'Al-Hussein Hospital',         lat: 31.5300, lng: 35.0940, area: 'Institutions' },
  { name: 'Al-Mezan Hospital',           lat: 31.5240, lng: 35.0870, area: 'Institutions' },
  { name: 'Hebron Chamber of Commerce',  lat: 31.5295, lng: 35.0985, area: 'Institutions' },
  { name: 'Hebron Municipality',         lat: 31.5312, lng: 35.0992, area: 'Institutions' },
  { name: 'Hebron Court (Istinaf)',       lat: 31.5280, lng: 35.0960, area: 'Institutions' },
  { name: 'Tarqumiyya Checkpoint',       lat: 31.5876, lng: 34.9628, area: 'Institutions' },
  // Villages & towns (Hebron Governorate)
  { name: 'Halhul Center',               lat: 31.5844, lng: 35.0894, area: 'Villages' },
  { name: "Sa'ir Center",                lat: 31.5648, lng: 35.1694, area: 'Villages' },
  { name: 'Yatta Center',                lat: 31.4365, lng: 35.1019, area: 'Villages' },
  { name: 'Dura Center',                 lat: 31.5011, lng: 34.9889, area: 'Villages' },
  { name: 'Taffuh Center',               lat: 31.5139, lng: 35.0317, area: 'Villages' },
  { name: 'Tarqumiyya',                  lat: 31.5876, lng: 34.9628, area: 'Villages' },
  { name: 'Idhna',                       lat: 31.5590, lng: 34.9760, area: 'Villages' },
  { name: 'Beit Ula',                    lat: 31.5374, lng: 34.9780, area: 'Villages' },
  { name: "Bani Na'im",                  lat: 31.5191, lng: 35.1726, area: 'Villages' },
  { name: 'Ash-Shuyukh',                 lat: 31.5530, lng: 35.1600, area: 'Villages' },
  { name: 'Al-Zahiriyya',                lat: 31.4080, lng: 34.9710, area: 'Villages' },
  { name: 'Sourif',                      lat: 31.6212, lng: 35.0676, area: 'Villages' },
  { name: 'Beit Ummer',                  lat: 31.5939, lng: 35.0718, area: 'Villages' },
  { name: 'Beit Kahil',                  lat: 31.5620, lng: 35.0280, area: 'Villages' },
  { name: 'Kharas',                      lat: 31.5168, lng: 35.0192, area: 'Villages' },
  { name: 'Beit Awa',                    lat: 31.5274, lng: 34.9352, area: 'Villages' },
  { name: 'Deirat',                      lat: 31.4702, lng: 35.1015, area: 'Villages' },
  { name: 'As-Samu',                     lat: 31.3950, lng: 35.0950, area: 'Villages' },
  { name: 'Beit Fajar',                  lat: 31.5737, lng: 35.1314, area: 'Villages' },
  { name: 'Al-Shuyukh Al-Atiqa',         lat: 31.5480, lng: 35.1350, area: 'Villages' },
  { name: 'Al-Karmel',                   lat: 31.4240, lng: 35.1340, area: 'Villages' },
  { name: 'Maon',                        lat: 31.3900, lng: 35.1340, area: 'Villages' },
  { name: 'Yatta Industrial Zone',       lat: 31.4280, lng: 35.0950, area: 'Villages' },
  { name: 'Al-Burj Village',             lat: 31.4640, lng: 35.0820, area: 'Villages' },
  { name: 'Deir Samit',                  lat: 31.4950, lng: 34.9660, area: 'Villages' },
  { name: 'Al-Simiya',                   lat: 31.4730, lng: 34.9570, area: 'Villages' },
  { name: 'Beit Mirsim',                 lat: 31.4550, lng: 35.0010, area: 'Villages' },
];

// ── Leaflet icons ────────────────────────────────────────────────────────────
const ptIcon = (color, label) => L.divIcon({
  className: '',
  iconSize: [28, 28], iconAnchor: [14, 14],
  html: `<div style="background:${color};border:3px solid #fff;border-radius:50%;
    width:28px;height:28px;display:flex;align-items:center;justify-content:center;
    box-shadow:0 2px 8px rgba(0,0,0,0.25);font-size:11px;font-weight:800;color:#fff;font-family:system-ui;">
    ${label}</div>`,
});

// Auto-fit map to route bounds
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions?.length >= 2) {
      map.fitBounds(L.latLngBounds(positions.map(([a, b]) => L.latLng(a, b))), { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

// Group places by area
const GROUPS = [...new Set(PLACES.map((p) => p.area))];

// ── Component ────────────────────────────────────────────────────────────────
export default function RoutePlanner() {
  const [from,      setFrom]      = useState('');
  const [to,        setTo]        = useState('');
  const [routePts,  setRoutePts]  = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading,   setLoading]   = useState(false);

  const fromPlace = PLACES.find((p) => p.name === from);
  const toPlace   = PLACES.find((p) => p.name === to);

  // Fetch OSRM route whenever both places are selected
  useEffect(() => {
    if (!fromPlace || !toPlace) { setRoutePts([]); setRouteInfo(null); return; }
    setLoading(true);
    const url = `https://router.project-osrm.org/route/v1/driving/${fromPlace.lng},${fromPlace.lat};${toPlace.lng},${toPlace.lat}?overview=full&geometries=geojson`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const route = data.routes?.[0];
        if (route) {
          setRoutePts(route.geometry.coordinates.map(([lng, lat]) => [lat, lng]));
          const dist = route.distance;
          setRouteInfo({
            distKm:   (dist / 1000).toFixed(1),
            drive:    Math.max(2, Math.round(route.duration / 60)),
            bus:      Math.max(5, Math.round(route.duration / 60 * 1.6) + 5),
            walk:     Math.round(dist / 80),
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [from, to]);

  const swap = () => { setFrom(to); setTo(from); };

  const SelectPlace = ({ label, value, onChange, exclude }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <MapPin size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-7 pr-3 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none appearance-none"
        >
          <option value="">Select location…</option>
          {GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {PLACES.filter((p) => p.area === group && p.name !== exclude).map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="flex h-full overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="w-80 shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-8 h-8 bg-gray-950 rounded-xl flex items-center justify-center">
              <Navigation size={14} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900">Route Planner</h1>
              <p className="text-xs text-gray-400">Find the best way between Hebron places</p>
            </div>
          </div>
        </div>

        {/* Search inputs */}
        <div className="px-4 py-4 border-b border-gray-50 space-y-3 shrink-0">
          <SelectPlace label="From" value={from} onChange={(v) => setFrom(v)} exclude={to} />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <button onClick={swap}
              className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-all">
              <RefreshCw size={11} />
            </button>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <SelectPlace label="To" value={to} onChange={(v) => setTo(v)} exclude={from} />
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 py-4">

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gray-400 py-4 justify-center">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
              Calculating route…
            </div>
          )}

          {!loading && routeInfo && fromPlace && toPlace && (
            <div className="space-y-3">
              {/* Trip summary */}
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-3.5">
                <div className="flex items-start gap-2 mb-3">
                  <div className="flex flex-col items-center gap-1 pt-0.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div className="w-0.5 h-6 bg-gray-200 rounded" />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  </div>
                  <div className="space-y-2 min-w-0">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Start</p>
                      <p className="text-xs font-semibold text-gray-900 truncate">{fromPlace.name}</p>
                      <p className="text-[10px] text-gray-400">{fromPlace.area}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Destination</p>
                      <p className="text-xs font-semibold text-gray-900 truncate">{toPlace.name}</p>
                      <p className="text-[10px] text-gray-400">{toPlace.area}</p>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-2">
                  Distance: <span className="font-semibold text-gray-700">{routeInfo.distKm} km</span>
                </div>
              </div>

              {/* Transport options */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Options</p>

              <div className="space-y-2">
                {/* By car */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Car size={14} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">By Car</p>
                    <p className="text-[10px] text-gray-400">Private vehicle</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{routeInfo.drive} min</p>
                  </div>
                </div>

                {/* By bus */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Bus size={14} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">By Bus</p>
                    <p className="text-[10px] text-gray-400">Via Manara Square</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">~{routeInfo.bus} min</p>
                  </div>
                </div>

                {/* On foot */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Footprints size={14} className="text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-900">On Foot</p>
                    <p className="text-[10px] text-gray-400">Walking pace</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">{routeInfo.walk} min</p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                <Clock size={9} /> Times are estimates. Bus service available on OSRM road path.
              </p>
            </div>
          )}

          {!loading && !routeInfo && !from && !to && (
            <div className="text-center py-8">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Navigation size={18} className="text-gray-400" />
              </div>
              <p className="text-xs font-semibold text-gray-600">Select two locations</p>
              <p className="text-xs text-gray-400 mt-1">The route will appear on the map</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Map ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <MapContainer
          center={[31.53, 35.09]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          maxBounds={[[31.35, 34.88], [31.70, 35.25]]}
          maxBoundsViscosity={0.9}
          minZoom={10}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {fromPlace && (
            <Marker position={[fromPlace.lat, fromPlace.lng]} icon={ptIcon('#22c55e', 'A')}>
            </Marker>
          )}
          {toPlace && (
            <Marker position={[toPlace.lat, toPlace.lng]} icon={ptIcon('#ef4444', 'B')}>
            </Marker>
          )}

          {routePts.length > 1 && (
            <>
              <Polyline positions={routePts} color="#111827" weight={5} opacity={0.85} />
              <FitBounds positions={routePts} />
            </>
          )}
        </MapContainer>

        {/* "Live path" badge */}
        {routePts.length > 1 && (
          <div className="absolute top-3 right-3 z-[1000] bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live path
          </div>
        )}
      </div>
    </div>
  );
}
