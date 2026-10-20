import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { USERS } from '../types';

const KEY = 'vmr.session';
const AuthContext = createContext(null);

// sessionStorage keeps each tab's login independent, so Tab 1 can be the
// Receptionist while Tab 2 is the MD. Visitor data is shared across tabs.
const load = () => {
  try { return JSON.parse(sessionStorage.getItem(KEY)); } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const login = useCallback((email, password) => {
    const u = USERS.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!u) return { ok: false, error: 'Email or password is incorrect.' };
    const { password: _pw, ...safe } = u;
    sessionStorage.setItem(KEY, JSON.stringify(safe));
    setUser(safe);
    return { ok: true, user: safe };
  }, []);

  const demoLogin = useCallback((email) => login(email, 'password123'), [login]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, login, demoLogin, logout }), [user, login, demoLogin, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
