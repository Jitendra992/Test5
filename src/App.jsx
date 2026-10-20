import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ReceptionDashboard from './pages/ReceptionDashboard';
import MDDashboard from './pages/MDDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import { ROLES, ROLE_PATH } from './types';

export default function App() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reception" element={<ProtectedRoute roles={[ROLES.RECEPTIONIST]}><ReceptionDashboard /></ProtectedRoute>} />
      <Route path="/md" element={<ProtectedRoute roles={[ROLES.MD]}><MDDashboard /></ProtectedRoute>} />
      <Route path="/coo" element={<ProtectedRoute roles={[ROLES.COO]}><ExecutiveDashboard role={ROLES.COO} /></ProtectedRoute>} />
      <Route path="/president" element={<ProtectedRoute roles={[ROLES.PRESIDENT]}><ExecutiveDashboard role={ROLES.PRESIDENT} /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to={user ? ROLE_PATH[user.role] : '/login'} replace />} />
    </Routes>
  );
}
