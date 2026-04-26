export const ROUTES = {
  H1: {
    id: 'H1',
    name: 'Hebron Center → Halhul',
    color: '#3B82F6',
    waypoints: [
      [31.5314, 35.0998],
      [31.5390, 35.0965],
      [31.5480, 35.0940],
      [31.5600, 35.0915],
      [31.5720, 35.0900],
      [31.5844, 35.0894],
    ],
  },
  H2: {
    id: 'H2',
    name: 'Hebron Center → Sa\'ir',
    color: '#10B981',
    waypoints: [
      [31.5314, 35.0998],
      [31.5380, 35.1100],
      [31.5450, 35.1280],
      [31.5540, 35.1500],
      [31.5648, 35.1694],
    ],
  },
  H3: {
    id: 'H3',
    name: 'Hebron Center → Yatta',
    color: '#F97316',
    waypoints: [
      [31.5314, 35.0998],
      [31.5200, 35.1020],
      [31.5050, 35.1020],
      [31.4800, 35.1020],
      [31.4580, 35.1020],
      [31.4365, 35.1019],
    ],
  },
  H4: {
    id: 'H4',
    name: 'Hebron Center → Dura',
    color: '#8B5CF6',
    waypoints: [
      [31.5314, 35.0998],
      [31.5220, 35.0800],
      [31.5150, 35.0550],
      [31.5080, 35.0250],
      [31.5011, 34.9889],
    ],
  },
  H5: {
    id: 'H5',
    name: 'Hebron Center → Taffuh',
    color: '#EC4899',
    waypoints: [
      [31.5314, 35.0998],
      [31.5280, 35.0750],
      [31.5220, 35.0550],
      [31.5180, 35.0420],
      [31.5139, 35.0317],
    ],
  },
};

export const INITIAL_BUSES = [
  { id: 'B01', routeId: 'H1', waypointIndex: 0, progress: 0.0, passengers: 18, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B02', routeId: 'H1', waypointIndex: 3, progress: 0.5, passengers: 12, status: 'active', lat: 31.5600, lng: 35.0915 },
  { id: 'B03', routeId: 'H2', waypointIndex: 0, progress: 0.0, passengers: 22, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B04', routeId: 'H2', waypointIndex: 2, progress: 0.4, passengers: 9,  status: 'active', lat: 31.5450, lng: 35.1280 },
  { id: 'B05', routeId: 'H3', waypointIndex: 0, progress: 0.0, passengers: 25, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B06', routeId: 'H3', waypointIndex: 3, progress: 0.5, passengers: 11, status: 'active', lat: 31.4800, lng: 35.1020 },
  { id: 'B07', routeId: 'H4', waypointIndex: 0, progress: 0.0, passengers: 16, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B08', routeId: 'H4', waypointIndex: 2, progress: 0.3, passengers: 7,  status: 'active', lat: 31.5150, lng: 35.0550 },
  { id: 'B09', routeId: 'H5', waypointIndex: 0, progress: 0.0, passengers: 13, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B10', routeId: 'H5', waypointIndex: 2, progress: 0.6, passengers: 6,  status: 'active', lat: 31.5220, lng: 35.0550 },
];

export const INITIAL_PARKING = [
  { id: 'P01', name: 'Manara Parking',      lat: 31.5302, lng: 35.0938, total: 50,  available: 12, type: 'public'     },
  { id: 'P02', name: 'Hospital Parking',    lat: 31.5196, lng: 35.0850, total: 80,  available: 45, type: 'hospital'   },
  { id: 'P03', name: 'Old City Parking',    lat: 31.5262, lng: 35.1010, total: 30,  available: 3,  type: 'public'     },
  { id: 'P04', name: 'University Parking',  lat: 31.5075, lng: 35.0825, total: 120, available: 67, type: 'university' },
  { id: 'P05', name: 'Bab Izone Parking',   lat: 31.5310, lng: 35.0968, total: 40,  available: 28, type: 'public'     },
];

export const INITIAL_INCIDENTS = [
  {
    id: 'I01', type: 'pothole', lat: 31.5190, lng: 35.0920,
    severity: 'medium', description: 'Large pothole near primary school on Ein Sara Rd',
    status: 'verified', reportedAt: new Date(Date.now() - 3_600_000),
  },
  {
    id: 'I02', type: 'closure', lat: 31.5290, lng: 35.0995,
    severity: 'high', description: 'Road closure — construction works near Bab Izone',
    status: 'active', reportedAt: new Date(Date.now() - 7_200_000),
  },
  {
    id: 'I03', type: 'congestion', lat: 31.5314, lng: 35.0998,
    severity: 'high', description: 'Heavy congestion at Manara Square',
    status: 'active', reportedAt: new Date(Date.now() - 1_800_000),
  },
  {
    id: 'I04', type: 'pothole', lat: 31.5200, lng: 35.0970,
    severity: 'low', description: 'Minor pothole on Abu Sneineh main road',
    status: 'pending', reportedAt: new Date(Date.now() - 900_000),
  },
];

export const AMBULANCE_ROUTE = [
  [31.5196, 35.0850],
  [31.5215, 35.0875],
  [31.5240, 35.0908],
  [31.5265, 35.0928],
  [31.5280, 35.0940],
  [31.5297, 35.0943],
];

export const ALTERNATIVE_ROUTES = [
  {
    id: 'alt1',
    label: 'Alt Route A (+3 min)',
    color: '#F59E0B',
    waypoints: [
      [31.5300, 35.0948],
      [31.5315, 35.0938],
      [31.5322, 35.0958],
      [31.5312, 35.0978],
      [31.5295, 35.0985],
    ],
  },
  {
    id: 'alt2',
    label: 'Alt Route B (+5 min)',
    color: '#10B981',
    waypoints: [
      [31.5300, 35.0948],
      [31.5285, 35.0942],
      [31.5276, 35.0965],
      [31.5268, 35.0982],
    ],
  },
];

export const AGENT_LOG_TEMPLATES = [
  { agent: 'Routing Agent',    type: 'routing',    messages: [
    'Calculating optimal route — Hebron Center → Halhul via H1',
    'Detour suggested on H3 (Yatta) — congestion near Old City',
    'H2 route to Sa\'ir — road conditions optimal',
    'Rerouting Bus B06 — incident detected on H3 corridor',
    'H4 Dura route — alternative path saves 6 minutes',
    'H5 Taffuh — road works ahead, advisory issued',
    'All 5 village routes operational — no major disruptions',
  ]},
  { agent: 'Traffic Agent',    type: 'traffic',    messages: [
    'Peak-hour congestion on H1 (Halhul) — monitoring',
    'H3 corridor to Yatta — flow rate improved by 18%',
    'Congestion detected near Manara Square — H4/H5 affected',
    'Traffic cleared on H2 → Sa\'ir segment',
    'Heavy vehicle advisory on Dura Road (H4)',
    'Evening peak detected — all village routes busy',
  ]},
  { agent: 'Parking Agent',    type: 'parking',    messages: [
    'Old City Parking critically low — redirecting incoming vehicles',
    'Directing drivers to Hospital Parking (45 spaces available)',
    '2 spaces freed at Manara Parking — guidance updated',
    'Predicted full occupancy at Old City in ~12 minutes',
    'Smart signs updated — Bab Izone Parking recommended',
    'Parking occupancy sensor recalibrated on P04',
  ]},
  { agent: 'Validation Agent', type: 'validation', messages: [
    'Verifying citizen report: pothole on H3 corridor near Yatta junction',
    'Camera footage analysed — report I04 confirmed',
    'Report I02 verified — dispatching maintenance team',
    'New report under review: flooding near Manara Square',
    'Sensor grid pinged — awaiting confirmation for report I01',
    'False positive filtered — minor crack, below repair threshold',
  ]},
  { agent: 'Ambulance Agent',  type: 'ambulance',  messages: [
    'Priority path pre-computed: Hospital → Manara Square',
    'Route clearance nominal — all village paths unobstructed',
    'Stand-by mode active — monitoring emergency channels',
  ]},
];