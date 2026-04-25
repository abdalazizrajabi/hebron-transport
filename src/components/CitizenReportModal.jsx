import { useState } from 'react';
import { X, MapPin, AlertTriangle } from 'lucide-react';

const TYPES = [
  { value: 'pothole',    label: 'Pothole',      emoji: '⚠️' },
  { value: 'closure',   label: 'Road Closure', emoji: '🚧' },
  { value: 'congestion',label: 'Congestion',   emoji: '🚦' },
  { value: 'accident',  label: 'Accident',     emoji: '💥' },
];

const LOCS = [
  { label: 'Manara Square',   lat: 31.5297, lng: 35.0943 },
  { label: 'Ein Sara Rd',     lat: 31.5230, lng: 35.0870 },
  { label: 'Bab Izone',       lat: 31.5305, lng: 35.0972 },
  { label: 'Old City Gate',   lat: 31.5257, lng: 35.1005 },
  { label: 'Abu Sneineh',     lat: 31.5218, lng: 35.0964 },
  { label: 'Al-Mahatta',      lat: 31.5344, lng: 35.0895 },
  { label: 'Hebron University', lat: 31.5071, lng: 35.0820 },
];

export default function CitizenReportModal({ onClose, onSubmit }) {
  const [type,        setType]        = useState('pothole');
  const [locLabel,    setLocLabel]    = useState(LOCS[0].label);
  const [description, setDescription] = useState('');
  const [severity,    setSeverity]    = useState('medium');
  const [submitted,   setSubmitted]   = useState(false);

  const loc = LOCS.find((l) => l.label === locLabel) ?? LOCS[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      type,
      lat: loc.lat,
      lng: loc.lng,
      severity,
      description: description || `${type} reported near ${loc.label}`,
    });
    setSubmitted(true);
    setTimeout(onClose, 2800);
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-gray-100">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-500" />
            <span className="font-semibold text-gray-900 text-sm">Report Road Issue</span>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-600 transition-colors">
            <X size={17} />
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="px-5 py-10 text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">Report Submitted</p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Verification Pending<br />Validation Agent is processing your report…
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">

            {/* Issue type */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Issue Type</label>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                      ${type === t.value
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-100 text-gray-600 hover:border-gray-200 bg-gray-50'}`}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Location</label>
              <div className="relative">
                <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={locLabel}
                  onChange={(e) => setLocLabel(e.target.value)}
                  className="w-full pl-8 pr-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-gray-300 appearance-none"
                >
                  {LOCS.map((l) => <option key={l.label}>{l.label}</option>)}
                </select>
              </div>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Severity</label>
              <div className="flex gap-2">
                {[
                  { v: 'low',    active: 'bg-emerald-500 text-white' },
                  { v: 'medium', active: 'bg-amber-500 text-white'   },
                  { v: 'high',   active: 'bg-red-500 text-white'     },
                ].map(({ v, active }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSeverity(v)}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all
                      ${severity === v ? active : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                  >{v}</button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Briefly describe the issue…"
                className="w-full px-3 py-2.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-700 resize-none focus:outline-none focus:border-gray-300 placeholder-gray-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-all"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
