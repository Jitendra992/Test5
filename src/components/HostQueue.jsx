import { Inbox } from 'lucide-react';
import Navbar from './Navbar';
import RequestCard from './RequestCard';
import { useVisitors } from '../context/VisitorContext';
import { ROLE_LABEL, STATUS } from '../types';

/** Shared layout for any host dashboard: open queue first, handled requests below. */
export default function HostQueue({ role, transferTargets = [] }) {
  const { visitors } = useVisitors();
  const mine = visitors.filter((v) => v.assignedTo === role);
  const open = mine.filter((v) => v.status !== STATUS.ACCEPTED && v.status !== STATUS.DECLINED);
  const done = mine.filter((v) => v.status === STATUS.ACCEPTED || v.status === STATUS.DECLINED);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <h1 className="text-xl font-semibold">{ROLE_LABEL[role]} queue</h1>
        <p className="mb-5 text-sm text-slate-600">{open.length} waiting · updates live across tabs</p>
        {open.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            <Inbox className="mx-auto mb-2 h-8 w-8" />No visitors waiting. New requests appear here automatically.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {open.map((v) => <RequestCard key={v.id} visitor={v} role={role} transferTargets={transferTargets} />)}
          </div>
        )}
        {done.length > 0 && (
          <>
            <h2 className="mb-3 mt-8 font-semibold">Handled</h2>
            <div className="grid gap-4 opacity-80 md:grid-cols-2">
              {done.map((v) => <RequestCard key={v.id} visitor={v} role={role} />)}
            </div>
          </>
        )}
      </main>
    </>
  );
}
