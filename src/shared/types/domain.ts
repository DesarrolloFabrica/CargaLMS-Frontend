export type UserRole = "GIF" | "COORDINATOR";

export const RequestStatus = {
  CREATED: "CREATED",
  ASSIGNED_TO_COORDINATOR: "ASSIGNED_TO_COORDINATOR",
  CREDENTIALS_REGISTERED: "CREDENTIALS_REGISTERED",
  RETURNED_FOR_ADJUSTMENT: "RETURNED_FOR_ADJUSTMENT",
  VALIDATED: "VALIDATED",
  CLOSED: "CLOSED",
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export interface AcademicCourse {
  id: string;
  code: string;
  name: string;
  program: string;
  courseType: string;
  categoryCun: string;
  parentFolderRef: string;
  active: boolean;
}

export interface LmsCredentials {
  id: string;
  requestId: string;
  username: string;
  password: string;
  generatedAt: string;
  notes?: string;
}

export interface WorkflowEvent {
  id: string;
  requestId: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus;
  actorRole: UserRole;
  actorId: string;
  comment?: string;
  createdAt: string;
}

export interface LmsLoadRequest {
  id: string;
  /** Nombre de la materia tal como lo ingresa el GIF. */
  courseName: string;
  /** Tipo de oferta: pregrado, postgrado, etc. (texto + sugerencias por datalist). */
  courseLevelType: string;
  driveUrl: string;
  materialDescription: string;
  status: RequestStatus;
  requestedBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  credentials?: LmsCredentials;
}

export interface InAppNotification {
  id: string;
  userRoleTarget: UserRole;
  requestId: string;
  type: "REQUEST_CREATED" | "CREDENTIALS_READY" | "REQUEST_RETURNED";
  read: boolean;
  createdAt: string;
  message: string;
}
