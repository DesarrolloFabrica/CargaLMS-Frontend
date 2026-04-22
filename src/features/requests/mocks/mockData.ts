import {
  RequestStatus,
} from "../../../shared/types/domain";
import type {
  AcademicCourse,
  InAppNotification,
  LmsLoadRequest,
  UserRole,
  WorkflowEvent,
} from "../../../shared/types/domain";

export const mockCourses: AcademicCourse[] = [
  {
    id: "course-1",
    code: "ADM101",
    name: "Introduccion a la Administracion",
    program: "Administracion",
    courseType: "Teorico",
    categoryCun: "CUN-A",
    parentFolderRef: "drive-root-admin",
    active: true,
  },
  {
    id: "course-2",
    code: "SIS201",
    name: "Arquitectura de Software",
    program: "Ingenieria de Sistemas",
    courseType: "Mixto",
    categoryCun: "CUN-B",
    parentFolderRef: "drive-root-sis",
    active: true,
  },
];

export const mockRequests: LmsLoadRequest[] = [];
export const mockEvents: WorkflowEvent[] = [];
export const mockNotifications: InAppNotification[] = [];

export function createEvent(
  requestId: string,
  actorRole: UserRole,
  actorId: string,
  fromStatus: RequestStatus | null,
  toStatus: RequestStatus,
  comment?: string,
): WorkflowEvent {
  return {
    id: crypto.randomUUID(),
    requestId,
    fromStatus,
    toStatus,
    actorRole,
    actorId,
    comment,
    createdAt: new Date().toISOString(),
  };
}
