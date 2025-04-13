
export type User = {
  id: string;
  name: string;
  email: string;
};

export type QueueType = "consultation" | "documents";

export enum TicketStatus {
  WAITING = "waiting",
  NEXT = "next",
  SERVING = "serving",
  SERVED = "served",
  MISSED = "missed",
  CANCELLED = "cancelled"
}

export type Ticket = {
  id: string;
  queueType: QueueType;
  number: string;
  status: TicketStatus;
  position: number;
  estimatedTime: number | null; // in minutes
  createdAt: string;
  userId: string;
};

export type Queue = {
  id: string;
  name: string;
  type: QueueType;
  description: string;
  currentTicket: string | null;
  averageWaitTime: number; // in minutes
  ticketsCount: number;
};
