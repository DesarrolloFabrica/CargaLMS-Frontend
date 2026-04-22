import { requestService } from "../../requests/services/requestService";
import type { UserRole } from "../../../shared/types/domain";

export const notificationService = {
  listByRole(role: UserRole) {
    return requestService.listNotifications(role);
  },
};
