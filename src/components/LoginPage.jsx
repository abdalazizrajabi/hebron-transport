import { useState } from 'react';
import { Cpu, Shield, User, ArrowRight, Check } from 'lucide-react';

const ROLES = [
  {
    id: 'admin',
    label: 'Admin',
    sub: 'Full system access',
    icon: Shield,
    features: [
      'Live map with all layers',
      'Agent activity log & controls',
      'Traffic light management',
      'Analytics dashboard',
      'Agent logic settings',
    ],
  },
  {
    id: 'citizen',
    label: 'Citizen',
    sub: 'View & report issues',
    icon: User,
    features: [
      'Live transport map',
      'Real-time bus tracking',
      'Submit road issue reports',
      'View report status',
    ],
  },
];

export default function LoginPage({ onLogin }) {
  const [selected, setSelected] = useState(null);

  const role = ROLES.find((r) => r.id === selected);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">

        {/* Branding */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-gray-950 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Cpu size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hebron Smart Mobility</h1>
          <p className="text-sm text-gray-400 mt-1">Digital Twin Platform — Multi-Agent System</p>
        </div>

        {/* Role label */}
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest text-center mb-4">
          Select your role to continue
        </p>

        {/* Role cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {ROLES.map(({ id, label, sub, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200
                ${selected === id
                  ? 'border-gray-900 bg-gray-950 text-white shadow-xl shadow-gray-200'
                  : 'border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-50'}`}
            >
              <Icon size={28} />
              <div className="text-center">
                <p className="font-bold text-sm">{label}</p>
                <p className={`text-xs mt-0.5 ${selected === id ? 'text-gray-400' : 'text-gray-400'}`}>{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Features preview */}
        {role && (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
            <p className="text-xs font-semibold text-gray-700 mb-2.5">{role.label} access includes:</p>
            <div className="space-y-1.5">
              {role.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-4 h-4 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                    <Check size={10} className="text-emerald-600" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => selected && onLogin(selected)}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2
            ${selected
              ? 'bg-gray-950 text-white hover:bg-gray-800 shadow-lg shadow-gray-100'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
        >
          {selected
            ? `Continue as ${role?.label}`
            : 'Select a role to continue'}
          {selected && <ArrowRight size={15} />}
        </button>

        <p className="text-center text-xs text-gray-300 mt-8">
          Palestine Polytechnic University · CS Capstone 2025
        </p>
      </div>
    </div>
  );
}