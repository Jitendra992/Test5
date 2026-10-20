import { Link, Navigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_PATH } from '../types';

/** Gate a route by role. Anonymous → /login. Wrong role → warning with link to own dashboard. */
export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return (
      <div className="mx-auto mt-24 max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 text-red-600" />
        <h1 className="text-lg font-semibold">You can’t open this dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Your role doesn’t have access to this page.</p>
        <Link to={ROLE_PATH[user.role]} className="btn mt-5 bg-teal-800 text-white hover:bg-teal-900">
          Go to my dashboard
        </Link>
      </div>
    );
  }
  return children;
}
