export const ROUTES = {
  H1: {
    id: 'H1',
    name: 'Hebron Center → Halhul',
    color: '#3B82F6',
    waypoints: [
      [31.5314, 35.0998],
      [31.5390, 35.0965],
      [31.5480, 35.0960],
      [31.5600, 35.0975],
      [31.5720, 35.0980],
      [31.5789, 35.0992],
    ],
  },
  H2: {
    id: 'H2',
    name: 'Hebron Center → Sa\'ir',
    color: '#10B981',
    waypoints: [
      [31.5314, 35.0998],
      [31.5400, 35.1100],
      [31.5520, 35.1250],
      [31.5650, 35.1350],
      [31.5750, 35.1420],
      [31.5844, 35.1453],
    ],
  },
  H3: {
    id: 'H3',
    name: 'Hebron Center → Yatta',
    color: '#F97316',
    waypoints: [
      [31.5314, 35.0998],
      [31.5200, 35.0970],
      [31.5050, 35.0940],
      [31.4850, 35.0920],
      [31.4650, 35.0910],
      [31.4478, 35.0900],
    ],
  },
  H4: {
    id: 'H4',
    name: 'Hebron Center → Dura',
    color: '#8B5CF6',
    waypoints: [
      [31.5314, 35.0998],
      [31.5250, 35.0780],
      [31.5180, 35.0580],
      [31.5110, 35.0420],
      [31.5069, 35.0278],
    ],
  },
  H5: {
    id: 'H5',
    name: 'Hebron Center → Taffuh',
    color: '#EC4899',
    waypoints: [
      [31.5314, 35.0998],
      [31.5328, 35.0820],
      [31.5355, 35.0650],
      [31.5375, 35.0570],
      [31.5392, 35.0531],
    ],
  },
};

export const INITIAL_BUSES = [
  { id: 'B01', routeId: 'H1', waypointIndex: 0, progress: 0.0, passengers: 18, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B02', routeId: 'H1', waypointIndex: 3, progress: 0.5, passengers: 12, status: 'active', lat: 31.5600, lng: 35.0975 },
  { id: 'B03', routeId: 'H2', waypointIndex: 0, progress: 0.0, passengers: 22, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B04', routeId: 'H2', waypointIndex: 2, progress: 0.4, passengers: 9,  status: 'active', lat: 31.5520, lng: 35.1250 },
  { id: 'B05', routeId: 'H3', waypointIndex: 0, progress: 0.0, passengers: 25, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B06', routeId: 'H3', waypointIndex: 3, progress: 0.5, passengers: 11, status: 'active', lat: 31.4850, lng: 35.0920 },
  { id: 'B07', routeId: 'H4', waypointIndex: 0, progress: 0.0, passengers: 16, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B08', routeId: 'H4', waypointIndex: 2, progress: 0.3, passengers: 7,  status: 'active', lat: 31.5180, lng: 35.0580 },
  { id: 'B09', routeId: 'H5', waypointIndex: 0, progress: 0.0, passengers: 13, status: 'active', lat: 31.5314, lng: 35.0998 },
  { id: 'B10', routeId: 'H5', waypointIndex: 2, progress: 0.6, passengers: 6,  status: 'active', lat: 31.5355, lng: 35.0650 },
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

// ── Metro network — 25 unique stations across 4 lines ────────────────────────
// Coordinates verified via Wikipedia MediaWiki API & OSM Nominatim.
//
// M1 Red   (Western Arc)  : Sourif → Kharas → Beit Ula → Beit Awwa
//                           → Dura* → Taffuh → Manara* → Beit Einun → Bani Na'im
// M2 Green (N Spur)       : Beit Ummar → Halhul → Al-Mahatta → Abu Sneineh → Manara*
// M3 Blue  (W Corridor)   : Tarqumiyya → Idhna → Deir Samit → Dura*
//                           → Al-Simiya → Al-Zahiriyya
// M4 Black (N–S Spine)    : Sa'ir → Ash-Shuyukh → Al-Hawouz → Manara*
//                           → Deirat → Yatta → Al-Karmil → As-Samu
//
// Transfers: Manara (M1+M2+M4) · Dura (M1+M3)   Unique stations: 9+4+5+7 = 25
export const METRO_LINES = {
  M1: {
    id: 'M1', name: 'Western Arc Line', color: '#DC2626',
    waypoints: [
      [31.6516, 35.0614], // Sourif           (Nominatim)
      [31.6142, 35.0431], // Kharas           (Wikipedia)
      [31.5961, 35.0289], // Beit Ula         (Wikipedia)
      [31.5086, 34.9503], // Beit Awwa        (Wikipedia)
      [31.5069, 35.0278], // Dura ← M3 xfer  (Wikipedia)
      [31.5392, 35.0531], // Taffuh           (Wikipedia)
      [31.5314, 35.0998], // Manara ← hub     (center)
      [31.5650, 35.1289], // Beit Einun       (Wikipedia)
      [31.5161, 35.1642], // Bani Na'im       (Wikipedia)
    ],
    stops: [
      { id: 'M1-1', name: 'Sourif',        lat: 31.6516, lng: 35.0614 },
      { id: 'M1-2', name: 'Kharas',        lat: 31.6142, lng: 35.0431 },
      { id: 'M1-3', name: 'Beit Ula',      lat: 31.5961, lng: 35.0289 },
      { id: 'M1-4', name: 'Beit Awwa',     lat: 31.5086, lng: 34.9503 },
      { id: 'M1-5', name: 'Dura',          lat: 31.5069, lng: 35.0278 },
      { id: 'M1-6', name: 'Taffuh',        lat: 31.5392, lng: 35.0531 },
      { id: 'M1-7', name: 'Manara Square', lat: 31.5314, lng: 35.0998 },
      { id: 'M1-8', name: 'Beit Einun',    lat: 31.5650, lng: 35.1289 },
      { id: 'M1-9', name: "Bani Na'im",    lat: 31.5161, lng: 35.1642 },
    ],
  },

  M2: {
    id: 'M2', name: 'Northern Spur', color: '#16A34A',
    waypoints: [
      [31.6214, 35.1022], // Beit Ummar      (Wikipedia)
      [31.5789, 35.0992], // Halhul          (Wikipedia)
      [31.5580, 35.0916], // Al-Mahatta      (estimated)
      [31.5448, 35.0905], // Abu Sneineh     (estimated)
      [31.5314, 35.0998], // Manara ← hub    (center)
    ],
    stops: [
      { id: 'M2-1', name: 'Beit Ummar',    lat: 31.6214, lng: 35.1022 },
      { id: 'M2-2', name: 'Halhul',        lat: 31.5789, lng: 35.0992 },
      { id: 'M2-3', name: 'Al-Mahatta',    lat: 31.5580, lng: 35.0916 },
      { id: 'M2-4', name: 'Abu Sneineh',   lat: 31.5448, lng: 35.0905 },
      { id: 'M2-5', name: 'Manara Square', lat: 31.5314, lng: 35.0998 },
    ],
  },

  M3: {
    id: 'M3', name: 'Western Corridor', color: '#2563EB',
    waypoints: [
      [31.5893, 34.9549], // Tarqumiyya      (estimated)
      [31.5580, 34.9763], // Idhna           (Nominatim)
      [31.5223, 34.9771], // Deir Samit      (Nominatim)
      [31.5069, 35.0278], // Dura ← M1 xfer  (Wikipedia)
      [31.4164, 35.0412], // Al-Simiya       (Nominatim)
      [31.4110, 35.0469], // Al-Zahiriyya    (Nominatim)
    ],
    stops: [
      { id: 'M3-1', name: 'Tarqumiyya',    lat: 31.5893, lng: 34.9549 },
      { id: 'M3-2', name: 'Idhna',         lat: 31.5580, lng: 34.9763 },
      { id: 'M3-3', name: 'Deir Samit',    lat: 31.5223, lng: 34.9771 },
      { id: 'M3-4', name: 'Dura',          lat: 31.5069, lng: 35.0278 },
      { id: 'M3-5', name: 'Al-Simiya',     lat: 31.4164, lng: 35.0412 },
      { id: 'M3-6', name: 'Al-Zahiriyya',  lat: 31.4110, lng: 35.0469 },
    ],
  },

  M4: {
    id: 'M4', name: 'North–South Spine', color: '#111827',
    waypoints: [
      [31.5844, 35.1453], // Sa'ir           (Wikipedia)
      [31.5769, 35.1507], // Ash-Shuyukh     (Nominatim)
      [31.5378, 35.1072], // Al-Hawouz       (estimated)
      [31.5314, 35.0998], // Manara ← hub    (center)
      [31.4735, 35.0950], // Deirat          (estimated)
      [31.4478, 35.0900], // Yatta           (Wikipedia)
      [31.4119, 35.1231], // Al-Karmil       (estimated)
      [31.4008, 35.0671], // As-Samu         (Wikipedia)
    ],
    stops: [
      { id: 'M4-1', name: "Sa'ir",         lat: 31.5844, lng: 35.1453 },
      { id: 'M4-2', name: 'Ash-Shuyukh',   lat: 31.5769, lng: 35.1507 },
      { id: 'M4-3', name: 'Al-Hawouz',     lat: 31.5378, lng: 35.1072 },
      { id: 'M4-4', name: 'Manara Square', lat: 31.5314, lng: 35.0998 },
      { id: 'M4-5', name: 'Deirat',        lat: 31.4735, lng: 35.0950 },
      { id: 'M4-6', name: 'Yatta',         lat: 31.4478, lng: 35.0900 },
      { id: 'M4-7', name: 'Al-Karmil',     lat: 31.4119, lng: 35.1231 },
      { id: 'M4-8', name: 'As-Samu',       lat: 31.4008, lng: 35.0671 },
    ],
  },
};

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

// Precise neighborhood centers — all within Hebron city limits
export const HEBRON_AREAS = [
  { id: 'A01', name: 'Old City (Al-Balad)',  nameAr: 'البلدة القديمة',    lat: 31.5254, lng: 35.1074, type: 'historic',    pop: '~6,000',  desc: 'Ancient walled city; home to the Ibrahimi Mosque and traditional souks.' },
  { id: 'A02', name: 'Bab Al-Zawiyeh',       nameAr: 'باب الزاوية',       lat: 31.5295, lng: 35.0972, type: 'commercial',  pop: '~12,000', desc: 'Main commercial hub west of the old city; largest retail district in Hebron.' },
  { id: 'A03', name: 'Abu Sneineh',          nameAr: 'أبو سنينة',         lat: 31.5448, lng: 35.0905, type: 'residential', pop: '~18,000', desc: 'Densely populated northern hillside neighborhood; major residential zone.' },
  { id: 'A04', name: 'Al-Hawouz',            nameAr: 'الحوز',             lat: 31.5372, lng: 35.1065, type: 'residential', pop: '~14,000', desc: 'Eastern neighborhood with modern housing; growing urban district.' },
  { id: 'A05', name: 'Wadi Al-Hariya',       nameAr: 'وادي الحرية',       lat: 31.5268, lng: 35.0838, type: 'residential', pop: '~10,000', desc: 'Valley neighborhood west of downtown; mixed residential and commercial strip.' },
  { id: 'A06', name: 'Jabal Johar',          nameAr: 'جبل جوهر',          lat: 31.5195, lng: 35.1152, type: 'residential', pop: '~16,000', desc: 'Expanding hillside district in eastern Hebron, overlooking the city.' },
  { id: 'A07', name: 'Ras Al-Jura',          nameAr: 'رأس الجورة',        lat: 31.5228, lng: 35.1092, type: 'residential', pop: '~8,000',  desc: 'Quiet residential zone southeast of the city center.' },
  { id: 'A08', name: 'Al-Mahatta',           nameAr: 'المحطة',            lat: 31.5580, lng: 35.0910, type: 'transit',     pop: '~9,000',  desc: 'Northern transit hub; main bus station connecting Hebron to Halhul.' },
  { id: 'A09', name: 'Jabal Al-Rehan',       nameAr: 'جبل الريحان',       lat: 31.5078, lng: 35.0870, type: 'residential', pop: '~11,000', desc: 'Southwest hillside neighborhood with panoramic city views.' },
  { id: 'A10', name: 'Al-Bayader',           nameAr: 'البيادر',           lat: 31.5185, lng: 35.1078, type: 'residential', pop: '~7,000',  desc: 'Quiet southeastern residential area.' },
  { id: 'A11', name: 'Tel Rumeida',          nameAr: 'تل رميدة',          lat: 31.5237, lng: 35.1042, type: 'historic',    pop: '~2,000',  desc: 'Ancient archaeological hill near the Ibrahimi Mosque; one of the oldest inhabited sites in the Levant.' },
  { id: 'A12', name: 'Haret Al-Sheikh',      nameAr: 'حارة الشيخ',        lat: 31.5258, lng: 35.1038, type: 'historic',    pop: '~4,000',  desc: 'Historic quarter adjacent to the Ibrahimi Mosque; traditional stone buildings.' },
  { id: 'A13', name: 'Al-Salam',             nameAr: 'السلام',            lat: 31.5498, lng: 35.0835, type: 'residential', pop: '~13,000', desc: 'Modern planned residential district in northwest Hebron.' },
  { id: 'A14', name: 'Khaled Ibn Al-Walid',  nameAr: 'خالد بن الوليد',    lat: 31.5348, lng: 35.0845, type: 'residential', pop: '~9,500',  desc: 'Mixed residential and commercial area in western Hebron.' },
  { id: 'A15', name: 'Al-Zeitouneh',         nameAr: 'الزيتونة',          lat: 31.5418, lng: 35.1045, type: 'residential', pop: '~8,000',  desc: 'Hillside neighborhood named after its historic olive groves.' },
];