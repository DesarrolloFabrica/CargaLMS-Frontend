import type { UserRole } from "../../../shared/types/domain";
import { notificationService } from "../services/notificationService";

interface NotificationBellProps {
  role: UserRole;
}

export function NotificationBell({ role }: NotificationBellProps) {
  const notifications = notificationService.listByRole(role);
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
      Notificaciones: <span className="font-bold">{notifications.length}</span>
    </div>
  );
}
