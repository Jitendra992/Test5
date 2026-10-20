import HostQueue from '../components/HostQueue';
import { ROLES } from '../types';

/** MD can Accept / Decline / Hold and Transfer to COO or President. */
export default function MDDashboard() {
  return <HostQueue role={ROLES.MD} transferTargets={[ROLES.COO, ROLES.PRESIDENT]} />;
}
