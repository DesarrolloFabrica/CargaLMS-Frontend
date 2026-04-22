import { RequestStatus } from "../types/domain";
import { statusLabel } from "../lib/status";

const toneByStatus: Record<RequestStatus, string> = {
  [RequestStatus.CREATED]: "bg-slate-200 text-slate-700",
  [RequestStatus.ASSIGNED_TO_COORDINATOR]: "bg-blue-100 text-blue-700",
  [RequestStatus.CREDENTIALS_REGISTERED]: "bg-indigo-100 text-indigo-700",
  [RequestStatus.RETURNED_FOR_ADJUSTMENT]: "bg-amber-100 text-amber-700",
  [RequestStatus.VALIDATED]: "bg-emerald-100 text-emerald-700",
  [RequestStatus.CLOSED]: "bg-green-100 text-green-700",
};

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${toneByStatus[status]}`}>
      {statusLabel[status]}
    </span>
  );
}
