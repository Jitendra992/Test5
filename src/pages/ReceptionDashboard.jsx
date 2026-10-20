import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { StatusBadge, remarkFor } from '../components/StatusBadge';
import { useVisitors } from '../context/VisitorContext';
import { HOSTS, ROLE_LABEL, ROLES, fmtTime } from '../types';

const EMPTY = { name: '', phone: '', agenda: '', host: ROLES.MD };

export default function ReceptionDashboard() {
  const { visitors, addVisitor, clearAll } = useVisitors();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.agenda.trim()) return setError('Enter the visitor’s name and purpose of visit.');
    if (!/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) return setError('Enter a valid mobile number.');
    setError('');
    addVisitor(form);
    setForm(EMPTY);
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="mb-4 text-lg font-semibold">Check in a visitor</h1>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1 block text-sm font-medium">Visitor name</label>
              <input className="input" value={form.name} onChange={set('name')} /></div>
            <div><label className="mb-1 block text-sm font-medium">Mobile number</label>
              <input className="input" type="tel" value={form.phone} onChange={set('phone')} /></div>
            <div className="md:col-span-2"><label className="mb-1 block text-sm font-medium">Purpose of visit / agenda</label>
              <textarea className="input" rows={2} value={form.agenda} onChange={set('agenda')} /></div>
            <div><label className="mb-1 block text-sm font-medium">Who are they meeting?</label>
              <select className="input" value={form.host} onChange={set('host')}>
                {HOSTS.map((h) => <option key={h} value={h}>{ROLE_LABEL[h]}</option>)}
              </select></div>
            <div><label className="mb-1 block text-sm font-medium">Check-in time</label>
              <input className="input bg-slate-50" disabled value="Recorded automatically on submit" /></div>
            {error && <p className="text-sm text-red-700 md:col-span-2" role="alert">{error}</p>}
            <div className="md:col-span-2">
              <button className="btn bg-teal-800 text-white hover:bg-teal-900"><UserPlus className="h-4 w-4" />Send request to host</button>
            </div>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-semibold">Live visitor board</h2>
            {visitors.length > 0 && (
              <button className="text-xs text-slate-500 underline" onClick={() => window.confirm('Clear all visitor records?') && clearAll()}>Clear all</button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-y border-slate-200 bg-slate-50 text-slate-600">
                <tr>{['Visitor', 'Phone', 'Agenda', 'Assigned host', 'Status', 'Action / remarks', 'Time'].map((h) => (
                  <th key={h} className="px-4 py-2 font-medium">{h}</th>))}</tr>
              </thead>
              <tbody>
                {visitors.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-500">No visitors yet. Check one in above.</td></tr>
                )}
                {visitors.map((v) => {
                  const r = remarkFor(v);
                  return (
                    <tr key={v.id} className="border-b border-slate-100 align-top">
                      <td className="px-4 py-3 font-medium">{v.name}</td>
                      <td className="px-4 py-3">{v.phone}</td>
                      <td className="max-w-[220px] px-4 py-3">{v.agenda}</td>
                      <td className="px-4 py-3">{ROLE_LABEL[v.assignedTo]}
                        {v.assignedTo !== v.requestedHost && <div className="text-xs text-slate-500">Asked for {ROLE_LABEL[v.requestedHost]}</div>}</td>
                      <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                      <td className="px-4 py-3">
                        {r.strong && <div className={`font-semibold ${v.status === 'accepted' ? 'text-green-700' : ''}`}>{r.strong}</div>}
                        <div className="text-slate-600">{r.text}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{fmtTime(v.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </>
  );
}
