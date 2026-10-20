import { useNavigate } from 'react-router-dom';
import { Building2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABEL } from '../types';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 font-semibold">
          <Building2 className="h-5 w-5 text-teal-800" /> Front Desk
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-slate-700 sm:inline">{user.name}</span>
          <span className="rounded-full bg-teal-800 px-2.5 py-0.5 text-xs font-semibold text-white">
            {ROLE_LABEL[user.role]}
          </span>
          <button onClick={() => { logout(); navigate('/login'); }} className="btn border border-slate-300 hover:bg-slate-50">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </header>
  );
}
