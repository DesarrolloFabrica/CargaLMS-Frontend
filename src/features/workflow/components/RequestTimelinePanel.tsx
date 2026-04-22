import type { WorkflowEvent } from "../../../shared/types/domain";
import { statusLabel } from "../../../shared/lib/status";

interface RequestTimelinePanelProps {
  events: WorkflowEvent[];
}

export function RequestTimelinePanel({ events }: RequestTimelinePanelProps) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Timeline</h3>
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="rounded border border-slate-200 p-2 text-sm">
            <p className="font-medium text-slate-700">{statusLabel[event.toStatus]}</p>
            <p className="text-xs text-slate-500">
              {event.actorRole} - {new Date(event.createdAt).toLocaleString()}
            </p>
            {event.comment ? <p className="mt-1 text-xs text-slate-600">{event.comment}</p> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
