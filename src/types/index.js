/**
 * @typedef {Object} User
 * @property {string} id @property {string} name @property {string} email
 * @property {string} password @property {'receptionist'|'md'|'coo'|'president'} role
 *
 * @typedef {Object} HistoryEntry
 * @property {string} by @property {string} action @property {string} [note] @property {string} at
 *
 * @typedef {Object} Visitor
 * @property {string} id @property {string} name @property {string} phone @property {string} agenda
 * @property {string} requestedHost  Host chosen at check-in
 * @property {string} assignedTo     Role that currently owns the request
 * @property {string} status         One of STATUS
 * @property {string} [statusBy]     Role that set the status
 * @property {string} [remarks]      Decline reason / hold label / transfer note
 * @property {string} [transferredFrom] @property {string} [transferNote]
 * @property {HistoryEntry[]} history @property {string} createdAt @property {string} updatedAt
 */

export const ROLES = { RECEPTIONIST: 'receptionist', MD: 'md', COO: 'coo', PRESIDENT: 'president' };
export const ROLE_LABEL = { receptionist: 'Receptionist', md: 'MD', coo: 'COO', president: 'President' };
export const ROLE_PATH = { receptionist: '/reception', md: '/md', coo: '/coo', president: '/president' };
export const HOSTS = [ROLES.MD, ROLES.COO, ROLES.PRESIDENT];

export const STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  ON_HOLD: 'on_hold',
  TRANSFERRED: 'transferred',
};

export const HOLD_OPTIONS = ['15m', '30m', '1h', 'custom'];

export const USERS = [
  { id: 'u1', name: 'Priya (Reception)', email: 'reception@office.com', password: 'password123', role: ROLES.RECEPTIONIST },
  { id: 'u2', name: 'Managing Director', email: 'md@office.com', password: 'password123', role: ROLES.MD },
  { id: 'u3', name: 'Chief Operating Officer', email: 'coo@office.com', password: 'password123', role: ROLES.COO },
  { id: 'u4', name: 'President', email: 'president@office.com', password: 'password123', role: ROLES.PRESIDENT },
];

export const fmtTime = (iso) =>
  new Date(iso).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
