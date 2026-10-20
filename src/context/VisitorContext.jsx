import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { STATUS } from '../types';

const KEY = 'vmr.visitors';
const CHANNEL = 'vmr-sync';
const VisitorContext = createContext(null);

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));

export function VisitorProvider({ children }) {
  const [visitors, setVisitors] = useState(read);
  const chan = useRef(null);

  // Cross-tab sync: BroadcastChannel (instant) + storage event (fallback).
  useEffect(() => {
    const sync = () => setVisitors(read());
    const onStorage = (e) => { if (e.key === KEY) sync(); };
    if (typeof BroadcastChannel !== 'undefined') {
      chan.current = new BroadcastChannel(CHANNEL);
      chan.current.onmessage = sync;
    }
    window.addEventListener('storage', onStorage);
    return () => {
      chan.current?.close();
      chan.current = null;
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // Always mutate the freshest persisted list so concurrent tabs never overwrite each other.
  const commit = useCallback((fn) => {
    const next = fn(read());
    localStorage.setItem(KEY, JSON.stringify(next));
    setVisitors(next);
    chan.current?.postMessage('sync');
  }, []);

  const update = useCallback((id, by, action, changes, note) => {
    const at = new Date().toISOString();
    commit((list) =>
      list.map((v) =>
        v.id === id
          ? { ...v, ...changes, statusBy: by, updatedAt: at, history: [...v.history, { by, action, note, at }] }
          : v
      )
    );
  }, [commit]);

  const addVisitor = useCallback(({ name, phone, agenda, host }) => {
    const at = new Date().toISOString();
    const visitor = {
      id: uid(), name: name.trim(), phone: phone.trim(), agenda: agenda.trim(),
      requestedHost: host, assignedTo: host, status: STATUS.PENDING, statusBy: 'receptionist',
      remarks: '', history: [{ by: 'receptionist', action: 'Checked in', at }], createdAt: at, updatedAt: at,
    };
    commit((list) => [visitor, ...list]);
  }, [commit]);

  const accept = useCallback((id, by) =>
    update(id, by, 'Accepted', { status: STATUS.ACCEPTED, remarks: '' }), [update]);

  const decline = useCallback((id, by, reason) =>
    update(id, by, 'Declined', { status: STATUS.DECLINED, remarks: reason || 'No reason given' }, reason), [update]);

  const hold = useCallback((id, by, label) =>
    update(id, by, 'On hold', { status: STATUS.ON_HOLD, remarks: label }, label), [update]);

  const transfer = useCallback((id, from, to, note) =>
    update(id, from, `Transferred to ${to.toUpperCase()}`, {
      status: STATUS.TRANSFERRED, assignedTo: to, transferredFrom: from,
      transferNote: note || '', remarks: note || '',
    }, note), [update]);

  const clearAll = useCallback(() => commit(() => []), [commit]);

  const value = useMemo(
    () => ({ visitors, addVisitor, accept, decline, hold, transfer, clearAll }),
    [visitors, addVisitor, accept, decline, hold, transfer, clearAll]
  );
  return <VisitorContext.Provider value={value}>{children}</VisitorContext.Provider>;
}

export const useVisitors = () => {
  const ctx = useContext(VisitorContext);
  if (!ctx) throw new Error('useVisitors must be used inside VisitorProvider');
  return ctx;
};
