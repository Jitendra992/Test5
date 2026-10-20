import { STATUS, ROLE_LABEL } from '../types';

const STYLES = {
  [STATUS.PENDING]: 'bg-slate-100 text-slate-700 ring-slate-300',
  [STATUS.ACCEPTED]: 'bg-green-100 text-green-800 ring-green-300',
  [STATUS.DECLINED]: 'bg-red-100 text-red-800 ring-red-300',
  [STATUS.ON_HOLD]: 'bg-amber-100 text-amber-900 ring-amber-300',
  [STATUS.TRANSFERRED]: 'bg-blue-100 text-blue-800 ring-blue-300',
};
const LABEL = {
  [STATUS.PENDING]: 'Pending', [STATUS.ACCEPTED]: 'Accepted', [STATUS.DECLINED]: 'Declined',
  [STATUS.ON_HOLD]: 'On Hold', [STATUS.TRANSFERRED]: 'Transferred',
};

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${STYLES[status]}`}>
      {LABEL[status]}
    </span>
  );
}

/** Receptionist-facing text for the Action/Remarks column. */
export function remarkFor(v) {
  const by = ROLE_LABEL[v.statusBy] || '';
  const timed = /^\d/.test(v.remarks || '');
  switch (v.status) {
    case STATUS.ACCEPTED: return { strong: 'Send In', text: `Accepted by ${by}` };
    case STATUS.DECLINED: return { strong: `Declined by ${by}`, text: v.remarks };
    case STATUS.ON_HOLD: return { strong: timed ? `Hold for ${v.remarks}` : 'On hold', text: timed ? `By ${by}` : `${v.remarks} (${by})` };
    case STATUS.TRANSFERRED: return { strong: `Transferred by ${by} to ${ROLE_LABEL[v.assignedTo]}`, text: `Waiting for ${ROLE_LABEL[v.assignedTo]} to confirm${v.transferNote ? ` · “${v.transferNote}”` : ''}` };
    default: return { strong: '', text: `Waiting for ${ROLE_LABEL[v.assignedTo]}` };
  }
}
