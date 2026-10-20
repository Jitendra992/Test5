import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Building2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABEL, ROLE_PATH, USERS } from '../types';

export default function Login() {
  const { user, login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to={ROLE_PATH[user.role]} replace />;

  const go = (res) => (res.ok ? navigate(ROLE_PATH[res.user.role], { replace: true }) : setError(res.error));

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-2 text-lg font-semibold"><Building2 className="h-6 w-6 text-teal-800" />Front Desk</div>
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mb-5 mt-1 text-sm text-slate-600">Route visitors to the right executive.</p>
        <form onSubmit={(e) => { e.preventDefault(); go(login(email, password)); }} className="space-y-4">
          <div><label className="mb-1 block text-sm font-medium">Email</label>
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><label className="mb-1 block text-sm font-medium">Password</label>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <button className="btn w-full bg-teal-800 text-white hover:bg-teal-900"><LogIn className="h-4 w-4" />Sign in</button>
        </form>
        <div className="mt-6 border-t border-slate-200 pt-5">
          <p className="mb-3 text-sm font-medium">Quick demo login</p>
          <div className="grid grid-cols-2 gap-2">
            {USERS.map((u) => (
              <button key={u.id} onClick={() => go(demoLogin(u.email))} className="btn border border-slate-300 hover:bg-slate-50">
                Login as {ROLE_LABEL[u.role]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Demo password for all accounts: password123</p>
        </div>
      </div>
    </div>
  );
}
