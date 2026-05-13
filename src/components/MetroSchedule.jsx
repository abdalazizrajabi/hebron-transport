import { useState } from 'react';
import { Train, Clock, MapPin } from 'lucide-react';
import { METRO_LINES } from '../data/mockData';

const SCHEDULES = {
  M1: { freq: 20, firstH: 6,   firstM: 0,  lastH: 22, lastM: 0  },
  M2: { freq: 20, firstH: 6,   firstM: 0,  lastH: 22, lastM: 0  },
  M3: { freq: 15, firstH: 6,   firstM: 30, lastH: 21, lastM: 30 },
  M4: { freq: 25, firstH: 6,   firstM: 0,  lastH: 22, lastM: 0  },
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

export default function MetroSchedule() {
  const [activeId, setActiveId] = useState('M1');

  const line  = METRO_LINES[activeId];
  const sched = SCHEDULES[activeId];
  const times = genTimes(sched);

  const now     = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const upcoming = times
    .filter((t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m >= nowMins; })
    .slice(0, 3);

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-gray-950 rounded-xl flex items-center justify-center shrink-0">
          <Train size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Metro Schedule</h1>
          <p className="text-xs text-gray-400">Hebron Metro Network — 4 Lines</p>
        </div>
      </div>

      {/* Line tabs */}
      <div className="flex gap-2 mb-5">
        {Object.entries(METRO_LINES).map(([id, l]) => (
          <button
            key={id}
            onClick={() => setActiveId(id)}
            className="px-5 py-2 rounded-xl text-sm font-bold transition-all"
            style={activeId === id
              ? { background: l.color, color: '#fff' }
              : { background: '#f9fafb', color: '#6b7280' }}
          >
            {id}
          </button>
        ))}
      </div>

      {/* Line info card */}
      <div
        className="bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm overflow-hidden mb-4"
        style={{ borderLeftColor: line.color }}
      >
        <div className="px-5 py-4 border-b border-gray-50 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: line.color }}>
              Line {activeId}
            </span>
            <h3 className="font-bold text-gray-900 mt-0.5">{line.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {line.stops.length} stations · every {sched.freq} min ·{' '}
              {sched.firstH.toString().padStart(2,'0')}:{sched.firstM.toString().padStart(2,'0')} –{' '}
              {sched.lastH.toString().padStart(2,'0')}:{sched.lastM.toString().padStart(2,'0')}
            </p>
          </div>

          {upcoming.length > 0 && (
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mb-1.5">
                <Clock size={10} /> Next from {line.stops[0].name}
              </p>
              <div className="flex gap-1.5 justify-end">
                {upcoming.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-lg text-white"
                    style={{ background: line.color }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stations */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <MapPin size={10} /> Stations
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {line.stops.map((stop, i) => (
              <div key={stop.id} className="flex items-center gap-1.5">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                  style={{ background: `${line.color}22`, color: line.color, border: `1px solid ${line.color}33` }}
                >
                  {stop.name}
                </div>
                {i < line.stops.length - 1 && (
                  <span className="text-gray-300 text-xs">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full timetable */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Full Timetable — departures from {line.stops[0].name}
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {times.map((t) => {
            const [h, m] = t.split(':').map(Number);
            const tMins  = h * 60 + m;
            const isPast = tMins < nowMins;
            const isNext = upcoming[0] === t;
            return (
              <div
                key={t}
                className="px-2 py-1.5 rounded-lg text-center text-xs font-medium transition-all"
                style={
                  isNext
                    ? { background: line.color, color: '#fff', fontWeight: 700 }
                    : isPast
                    ? { background: '#f9fafb', color: '#d1d5db' }
                    : { background: '#f9fafb', color: '#374151' }
                }
              >
                {t}
              </div>
            );
          })}
        </div>
        {upcoming.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-3">No more trains today. Service resumes at {sched.firstH.toString().padStart(2,'0')}:{sched.firstM.toString().padStart(2,'0')}</p>
        )}
      </div>
    </div>
  );
}
