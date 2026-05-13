import { useState } from 'react';
import { Cpu, Shield, User, Eye, EyeOff, UserPlus } from 'lucide-react';

const DEFAULT_USERS = {
  admin: { password: 'admin123', role: 'admin' },
  user:  { password: 'user123',  role: 'citizen' },
};

const loadUsers = () => {
  try { return JSON.parse(localStorage.getItem('hsm_users') || '{}'); }
  catch { return {}; }
};

const saveUser = (username, password) => {
  const stored = loadUsers();
  stored[username.toLowerCase()] = { password, role: 'citizen' };
  localStorage.setItem('hsm_users', JSON.stringify(stored));
};

export default function LoginPage({ onLogin }) {
  const [mode,        setMode]        = useState('login');
  const [username,    setUsername]    = useState('');
  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState('');
  const [successMsg,  setSuccessMsg]  = useState('');

  const reset = (m) => {
    setMode(m); setUsername(''); setPassword('');
    setConfirm(''); setError(''); setSuccessMsg('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const key = username.trim().toLowerCase();
    const found = DEFAULT_USERS[key] || loadUsers()[key];
    if (found && found.password === password) {
      onLogin(found.role);
    } else {
      setError('Invalid username or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const key = username.trim().toLowerCase();
    if (!key) { setError('Username is required'); return; }
    if (DEFAULT_USERS[key] || loadUsers()[key]) {
      setError('Username already taken'); return;
    }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    saveUser(key, password);
    setSuccessMsg('Account created! You can now sign in.');
    setError('');
    setTimeout(() => reset('login'), 1500);
  };

  const fillDemo = (u, p) => {
    setUsername(u); setPassword(p); setError(''); setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="px-8 pt-8 pb-5 text-center border-b border-gray-50">
          <div className="w-12 h-12 bg-gray-950 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Cpu size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Hebron Smart Mobility</h1>
          <p className="text-xs text-gray-400 mt-1">Digital Twin Platform</p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => reset('login')}
            className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all ${mode === 'login' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => reset('register')}
            className={`flex-1 py-3 text-xs font-bold tracking-wide transition-all ${mode === 'register' ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {/* ── Login form ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="px-8 py-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text" value={username} autoComplete="username"
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Enter username"
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-gray-300 placeholder-gray-300 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} autoComplete="current-password"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-gray-300 placeholder-gray-300 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit"
              className="w-full py-3 bg-gray-950 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all">
              Sign In
            </button>
          </form>
        )}

        {/* ── Register form ── */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="px-8 py-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text" value={username} autoComplete="off"
                onChange={(e) => { setUsername(e.target.value); setError(''); }}
                placeholder="Choose a username"
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-gray-300 placeholder-gray-300 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} autoComplete="new-password"
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Min. 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-gray-300 placeholder-gray-300 transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <input
                type={showPass ? 'text' : 'password'} value={confirm} autoComplete="new-password"
                onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                placeholder="Repeat password"
                className="w-full px-3.5 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 focus:outline-none focus:border-gray-300 placeholder-gray-300 transition-colors"
              />
            </div>
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
              New accounts are registered as <strong>Citizen</strong> role.
            </p>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
            {successMsg && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">{successMsg}</p>}
            <button type="submit"
              className="w-full py-3 bg-gray-950 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
              <UserPlus size={14} />
              Create Account
            </button>
          </form>
        )}

        {/* Demo accounts (login mode only) */}
        {mode === 'login' && (
          <div className="px-8 pb-8">
            <div className="border-t border-gray-50 pt-5">
              <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts — click to fill</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => fillDemo('admin', 'admin123')}
                  className="p-3 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-100 text-left transition-all">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Shield size={12} className="text-violet-600" />
                    <span className="text-xs font-bold text-violet-700">Admin</span>
                  </div>
                  <p className="text-xs text-violet-400 font-mono">admin</p>
                  <p className="text-xs text-violet-400 font-mono">admin123</p>
                </button>
                <button type="button" onClick={() => fillDemo('user', 'user123')}
                  className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 text-left transition-all">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <User size={12} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-700">Citizen</span>
                  </div>
                  <p className="text-xs text-blue-400 font-mono">user</p>
                  <p className="text-xs text-blue-400 font-mono">user123</p>
                </button>
              </div>
            </div>
            <p className="text-center text-xs text-gray-300 mt-5">
              Hebron 2035
            </p>
          </div>
        )}

        {mode === 'register' && (
          <p className="text-center text-xs text-gray-300 pb-6">Hebron 2035</p>
        )}
      </div>
    </div>
  );
}
