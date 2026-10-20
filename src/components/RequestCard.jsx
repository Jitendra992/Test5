import { useState } from 'react';
import { ArrowRightLeft, Check, Clock, Pause, Phone, X } from 'lucide-react';
import Modal from './Modal';
import { StatusBadge } from './StatusBadge';
import { useVisitors } from '../context/VisitorContext';
import { HOLD_OPTIONS, ROLE_LABEL, STATUS, fmtTime } from '../types';

/**
 * One visitor request for a host. Handles Accept / Decline / Hold,
 * plus Transfer when `transferTargets` is provided (MD only).
 */
export default function RequestCard({ visitor: v, role, transferTargets = [] }) {
  const { accept, decline, hold, transfer } = useVisitors();
  const [modal, setModal] = useState(null);
  const [text, setText] = useState('');
  const [duration, setDuration] = useState('30m');
  const [target, setTarget] = useState(transferTargets[0]);

  const open = (m) => { setText(''); setModal(m); };
  const close = () => setModal(null);
  const resolved = v.status === STATUS.ACCEPTED || v.status === STATUS.DECLINED;
  const fromTransfer = v.transferredFrom && v.transferredFrom !== role;

  return (
    <article className={`rounded-xl border bg-white shadow-sm ${fromTransfer ? 'border-blue-300' : 'border-slate-200'}`}>
      {fromTransfer && (
        <div className="rounded-t-xl border-b border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
          <div className="flex items-center gap-1.5 font-semibold">
            <ArrowRightLeft className="h-4 w-4" /> Transferred from {ROLE_LABEL[v.transferredFrom]}
          </div>
          {v.transferNote && <p className="mt-0.5">{ROLE_LABEL[v.transferredFrom]}’s note: “{v.transferNote}”</p>}
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold">{v.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-600"><Phone className="h-3.5 w-3.5" />{v.phone}</p>
          </div>
          <StatusBadge status={v.status} />
        </div>
        <p className="mt-3 text-sm">{v.agenda}</p>
        <p className="mt-2 flex items-center gap-1 text-xs text-slate-500"><Clock className="h-3.5 w-3.5" />Checked in {fmtTime(v.createdAt)}</p>
        {v.status === STATUS.ON_HOLD && (
          <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-sm text-amber-900">On hold: {v.remarks}</p>
        )}
        {v.status === STATUS.DECLINED && <p className="mt-2 rounded bg-red-50 px-2 py-1 text-sm text-red-800">Reason: {v.remarks}</p>}

        {!resolved && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => accept(v.id, role)} className="btn bg-green-700 text-white hover:bg-green-800"><Check className="h-4 w-4" />Accept</button>
            <button onClick={() => open('decline')} className="btn bg-red-700 text-white hover:bg-red-800"><X className="h-4 w-4" />Decline</button>
            <button onClick={() => open('hold')} className="btn bg-amber-500 text-slate-900 hover:bg-amber-600"><Pause className="h-4 w-4" />Hold</button>
            {transferTargets.length > 0 && (
              <button onClick={() => open('transfer')} className="btn bg-blue-700 text-white hover:bg-blue-800"><ArrowRightLeft className="h-4 w-4" />Transfer</button>
            )}
          </div>
        )}
      </div>

      {modal === 'decline' && (
        <Modal title={`Decline ${v.name}`} onClose={close}>
          <label className="mb-1 block text-sm font-medium">Reason (shown to reception)</label>
          <textarea className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Not available today" />
          <button className="btn mt-4 w-full bg-red-700 text-white hover:bg-red-800"
            onClick={() => { decline(v.id, role, text.trim()); close(); }}>Decline visitor</button>
        </Modal>
      )}
      {modal === 'hold' && (
        <Modal title={`Put ${v.name} on hold`} onClose={close}>
          <div className="mb-3 flex flex-wrap gap-2">
            {HOLD_OPTIONS.map((o) => (
              <button key={o} onClick={() => setDuration(o)}
                className={`btn border ${duration === o ? 'border-teal-800 bg-teal-800 text-white' : 'border-slate-300 hover:bg-slate-50'}`}>
                {o === 'custom' ? 'Custom note' : o}
              </button>
            ))}
          </div>
          {duration === 'custom' && (
            <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Free after the 3pm call" />
          )}
          <button className="btn mt-4 w-full bg-amber-500 text-slate-900 hover:bg-amber-600"
            disabled={duration === 'custom' && !text.trim()}
            onClick={() => { hold(v.id, role, duration === 'custom' ? text.trim() : duration); close(); }}>Put on hold</button>
        </Modal>
      )}
      {modal === 'transfer' && (
        <Modal title={`Transfer ${v.name}`} onClose={close}>
          <label className="mb-1 block text-sm font-medium">Transfer to</label>
          <select className="input mb-3" value={target} onChange={(e) => setTarget(e.target.value)}>
            {transferTargets.map((t) => <option key={t} value={t}>{ROLE_LABEL[t]}</option>)}
          </select>
          <label className="mb-1 block text-sm font-medium">Note (optional)</label>
          <textarea className="input" rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Please handle this vendor discussion" />
          <button className="btn mt-4 w-full bg-blue-700 text-white hover:bg-blue-800"
            onClick={() => { transfer(v.id, role, target, text.trim()); close(); }}>Transfer to {ROLE_LABEL[target]}</button>
        </Modal>
      )}
    </article>
  );
}
