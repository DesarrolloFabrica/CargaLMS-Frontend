import { RequestStatus } from "../types/domain";

export const statusLabel: Record<RequestStatus, string> = {
  [RequestStatus.CREATED]: "Creada",
  [RequestStatus.ASSIGNED_TO_COORDINATOR]: "Asignada a coordinador",
  [RequestStatus.CREDENTIALS_REGISTERED]: "Credenciales registradas",
  [RequestStatus.RETURNED_FOR_ADJUSTMENT]: "Devuelta para ajuste",
  [RequestStatus.VALIDATED]: "Validada",
  [RequestStatus.CLOSED]: "Cerrada",
};
