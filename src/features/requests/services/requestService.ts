import {
  RequestStatus,
} from "../../../shared/types/domain";
import type {
  InAppNotification,
  LmsCredentials,
  LmsLoadRequest,
  UserRole,
  WorkflowEvent,
} from "../../../shared/types/domain";
import { createEvent, mockEvents, mockNotifications, mockRequests } from "../mocks/mockData";

function pushNotification(
  target: UserRole,
  requestId: string,
  type: InAppNotification["type"],
  message: string,
) {
  mockNotifications.unshift({
    id: crypto.randomUUID(),
    userRoleTarget: target,
    requestId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

function ensureTransition(current: RequestStatus, next: RequestStatus): void {
  const validTransitions: Record<RequestStatus, RequestStatus[]> = {
    [RequestStatus.CREATED]: [RequestStatus.ASSIGNED_TO_COORDINATOR],
    [RequestStatus.ASSIGNED_TO_COORDINATOR]: [RequestStatus.CREDENTIALS_REGISTERED],
    [RequestStatus.CREDENTIALS_REGISTERED]: [RequestStatus.VALIDATED, RequestStatus.RETURNED_FOR_ADJUSTMENT],
    [RequestStatus.RETURNED_FOR_ADJUSTMENT]: [RequestStatus.CREDENTIALS_REGISTERED],
    [RequestStatus.VALIDATED]: [RequestStatus.CLOSED],
    [RequestStatus.CLOSED]: [],
  };

  if (!validTransitions[current].includes(next)) {
    throw new Error(`Transicion invalida: ${current} -> ${next}`);
  }
}

function addEvent(event: WorkflowEvent) {
  mockEvents.unshift(event);
}

export const requestService = {
  listRequestsByRole(role: UserRole): LmsLoadRequest[] {
    if (role === "GIF") return mockRequests;
    return mockRequests.filter(
      (request) =>
        request.status === RequestStatus.ASSIGNED_TO_COORDINATOR ||
        request.status === RequestStatus.RETURNED_FOR_ADJUSTMENT,
    );
  },

  createRequest(input: {
    courseName: string;
    courseLevelType: string;
    driveUrl: string;
    materialDescription: string;
    requestedBy: string;
    assignedTo: string;
  }): LmsLoadRequest {
    const createdAt = new Date().toISOString();
    const request: LmsLoadRequest = {
      id: crypto.randomUUID(),
      courseName: input.courseName.trim(),
      courseLevelType: input.courseLevelType.trim(),
      driveUrl: input.driveUrl,
      materialDescription: input.materialDescription,
      status: RequestStatus.ASSIGNED_TO_COORDINATOR,
      requestedBy: input.requestedBy,
      assignedTo: input.assignedTo,
      createdAt,
      updatedAt: createdAt,
    };
    mockRequests.unshift(request);
    addEvent(
      createEvent(request.id, "GIF", input.requestedBy, null, RequestStatus.ASSIGNED_TO_COORDINATOR, "Solicitud creada"),
    );
    pushNotification("COORDINATOR", request.id, "REQUEST_CREATED", "Nueva solicitud pendiente para cargar en LMS");
    return request;
  },

  registerCredentials(input: {
    requestId: string;
    username: string;
    password: string;
    notes?: string;
    actorId: string;
  }): LmsLoadRequest {
    const request = mockRequests.find((item) => item.id === input.requestId);
    if (!request) {
      throw new Error("Solicitud no encontrada");
    }
    ensureTransition(request.status, RequestStatus.CREDENTIALS_REGISTERED);

    const credentials: LmsCredentials = {
      id: crypto.randomUUID(),
      requestId: request.id,
      username: input.username,
      password: input.password,
      notes: input.notes,
      generatedAt: new Date().toISOString(),
    };

    const previousStatus = request.status;
    request.status = RequestStatus.CREDENTIALS_REGISTERED;
    request.credentials = credentials;
    request.updatedAt = new Date().toISOString();
    addEvent(
      createEvent(
        request.id,
        "COORDINATOR",
        input.actorId,
        previousStatus,
        RequestStatus.CREDENTIALS_REGISTERED,
        "Credenciales registradas",
      ),
    );
    pushNotification("GIF", request.id, "CREDENTIALS_READY", "Credenciales listas para validacion");
    return request;
  },

  validateRequest(requestId: string, actorId: string): LmsLoadRequest {
    const request = mockRequests.find((item) => item.id === requestId);
    if (!request) {
      throw new Error("Solicitud no encontrada");
    }
    ensureTransition(request.status, RequestStatus.VALIDATED);
    const previousStatus = request.status;
    request.status = RequestStatus.VALIDATED;
    request.updatedAt = new Date().toISOString();
    addEvent(
      createEvent(request.id, "GIF", actorId, previousStatus, RequestStatus.VALIDATED, "GIF valida carga"),
    );

    ensureTransition(request.status, RequestStatus.CLOSED);
    const statusAfterValidation = request.status;
    request.status = RequestStatus.CLOSED;
    request.updatedAt = new Date().toISOString();
    addEvent(
      createEvent(
        request.id,
        "GIF",
        actorId,
        statusAfterValidation,
        RequestStatus.CLOSED,
        "Solicitud cerrada",
      ),
    );
    return request;
  },

  returnForAdjustment(requestId: string, actorId: string, comment: string): LmsLoadRequest {
    const request = mockRequests.find((item) => item.id === requestId);
    if (!request) {
      throw new Error("Solicitud no encontrada");
    }
    ensureTransition(request.status, RequestStatus.RETURNED_FOR_ADJUSTMENT);
    const previousStatus = request.status;
    request.status = RequestStatus.RETURNED_FOR_ADJUSTMENT;
    request.updatedAt = new Date().toISOString();
    addEvent(
      createEvent(
        request.id,
        "GIF",
        actorId,
        previousStatus,
        RequestStatus.RETURNED_FOR_ADJUSTMENT,
        comment,
      ),
    );
    pushNotification("COORDINATOR", request.id, "REQUEST_RETURNED", "GIF devolvio la solicitud para ajustes");
    return request;
  },

  listTimeline(requestId: string): WorkflowEvent[] {
    return mockEvents.filter((event) => event.requestId === requestId);
  },

  listNotifications(role: UserRole): InAppNotification[] {
    return mockNotifications.filter((notification) => notification.userRoleTarget === role);
  },
};
