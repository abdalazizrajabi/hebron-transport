// Fetches a road-snapped route from the OSRM public API.
// Falls back to the original waypoints if the request fails.
export const fetchOSRMRoute = async (waypoints) => {
  try {
    const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates?.length) {
      // GeoJSON coords are [lng, lat] — flip to [lat, lng] for Leaflet
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch {
    // silently fall back to straight-line waypoints
  }
  return waypoints;
};