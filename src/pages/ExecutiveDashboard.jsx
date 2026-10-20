import HostQueue from '../components/HostQueue';

/** Reusable for COO and President. Shows direct + transferred requests (no re-transfer). */
export default function ExecutiveDashboard({ role }) {
  return <HostQueue role={role} />;
}
