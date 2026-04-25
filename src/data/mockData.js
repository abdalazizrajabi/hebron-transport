// Real approximate coordinates for Hebron, Palestine key locations

export const ROUTES = {
  H1: {
    id: 'H1',
    name: 'Al-Mahatta → Manara → Ein Sara → H. University',
    color: '#3B82F6',
    waypoints: [
      [31.5344, 35.0895],
      [31.5320, 35.0918],
      [31.5297, 35.0943],
      [31.5268, 35.0928],
      [31.5230, 35.0870],
      [31.5180, 35.0845],
      [31.5071, 35.0820],
    ],
  },
  H2: {
    id: 'H2',
    name: 'Bab Izone → Old City → South Gate',
    color: '#10B981',
    waypoints: [
      [31.5305, 35.0972],
      [31.5284, 35.0988],
      [31.5257, 35.1005],
      [31.5235, 35.1028],
      [31.5210, 35.1045],
    ],
  },
  H3: {
    id: 'H3',
    name: 'Abu Sneineh → Manara → Halhul',
    color: '#F97316',
    waypoints: [
      [31.5218, 35.0964],
      [31.5252, 35.0955],
      [31.5297, 35.0943],
      [31.5352, 35.0922],
      [31.5402, 35.0887],
      [31.5497, 35.0790],
    ],
  },
};

export const INITIAL_BUSES = [
  { id: 'B01', routeId: 'H1', waypointIndex: 0, progress: 0.0, passengers: 12, status: 'active', lat: 31.5344, lng: 35.0895 },
  { id: 'B02', routeId: 'H1', waypointIndex: 3, progress: 0.4, passengers: 8,  status: 'active', lat: 31.5268, lng: 35.0928 },
  { id: 'B03', routeId: 'H2', waypointIndex: 0, progress: 0.0, passengers: 15, status: 'active', lat: 31.5305, lng: 35.0972 },
  { id: 'B04', routeId: 'H2', waypointIndex: 2, progress: 0.3, passengers: 6,  status: 'active', lat: 31.5257, lng: 35.1005 },
  { id: 'B05', routeId: 'H3', waypointIndex: 1, progress: 0.0, passengers: 20, status: 'active', lat: 31.5252, lng: 35.0955 },
  { id: 'B06', routeId: 'H3', waypointIndex: 4, progress: 0.6, passengers: 4,  status: 'active', lat: 31.5402, lng: 35.0887 },
];

export const INITIAL_TRAFFIC_LIGHTS = [
  { id: 'TL01', name: 'Manara Square',      lat: 31.5297, lng: 35.0943, state: 'green' },
  { id: 'TL02', name: 'Ein Sara Junction',  lat: 31.5230, lng: 35.0870, state: 'red'   },
  { id: 'TL03', name: 'Bab Izone',          lat: 31.5305, lng: 35.0972, state: 'green' },
  { id: 'TL04', name: 'Abu Sneineh Sq.',    lat: 31.5218, lng: 35.0964, state: 'red'   },
  { id: 'TL05', name: 'Al-Mahatta',         lat: 31.5344, lng: 35.0895, state: 'green' },
  { id: 'TL06', name: 'Old City Gate',      lat: 31.5257, lng: 35.1005, state: 'red'   },
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
    id: 'I01', type: 'pothole', lat: 31.5240, lng: 35.0890,
    severity: 'medium', description: 'Large pothole near primary school entrance',
    status: 'verified', reportedAt: new Date(Date.now() - 3_600_000),
  },
  {
    id: 'I02', type: 'closure', lat: 31.5270, lng: 35.0960,
    severity: 'high', description: 'Road closure — construction works, single-lane traffic',
    status: 'active', reportedAt: new Date(Date.now() - 7_200_000),
  },
  {
    id: 'I03', type: 'congestion', lat: 31.5300, lng: 35.0948,
    severity: 'high', description: 'Heavy congestion near Manara Square',
    status: 'active', reportedAt: new Date(Date.now() - 1_800_000),
  },
  {
    id: 'I04', type: 'pothole', lat: 31.5190, lng: 35.1020,
    severity: 'low', description: 'Minor pothole on sidewalk — low priority',
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
  { agent: 'Routing Agent',     type: 'routing',    messages: [
    'Calculating optimal route via Ein Sara Rd',
    'Detour suggested via Abu Sneineh (+3 min) — road closure at I02',
    'Traffic cleared on H1 segment near Al-Mahatta',
    'Rerouting Bus B03 — road closure detected ahead',
    'Alternative path active on H3 corridor — saving 7 minutes',
    'Route H2 congestion cleared — resuming normal path',
  ]},
  { agent: 'Traffic Agent',     type: 'traffic',    messages: [
    'Extending green phase at Manara Square by 45 seconds',
    'Synchronising adaptive cycle on H3 corridor',
    'Peak-hour mode activated — all intersections updated',
    'Congestion detected at Old City Gate — cycle adjusted',
    'Green wave initiated on Ein Sara Road (40 km/h)',
    'Cycle reset at Bab Izone — queue cleared',
  ]},
  { agent: 'Parking Agent',     type: 'parking',    messages: [
    'Old City Parking critically low — redirecting incoming vehicles',
    'Directing drivers to Hospital Parking (45 spaces available)',
    '2 spaces freed at Manara Parking — guidance updated',
    'Predicted full occupancy at Old City in ~12 minutes',
    'Smart signs updated — Bab Izone Parking recommended',
    'Parking occupancy sensor recalibrated on P04',
  ]},
  { agent: 'Validation Agent',  type: 'validation', messages: [
    'Verifying citizen report: pothole on Ein Sara Rd — cross-referencing sensors',
    'Camera footage analysed — report I04 confirmed',
    'Report I02 verified — dispatching maintenance team',
    'New report under review: flooding near Manara Square',
    'Sensor grid pinged — awaiting confirmation for report I01',
    'False positive filtered — minor crack, below repair threshold',
  ]},
  { agent: 'Ambulance Agent',   type: 'ambulance',  messages: [
    'Priority path pre-computed: Hospital → Manara Square',
    'Route clearance nominal — all paths unobstructed',
    'Stand-by mode active — monitoring emergency channels',
  ]},
];
