import axios from "axios";
import { Queue, Ticket, User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Создаём экземпляр axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // включаем передачу куки
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Общая обработка ошибок
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      return Promise.reject(new Error('Unauthorized'));
    }

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Unknown error';

    return Promise.reject(new Error(errorMessage));
  }
);

// Обёртка для запросов
const request = async <T = any>(url: string, options = {}): Promise<T> => {
  const response = await apiClient.request<T>({
    url,
    ...options,
  });
  return response.data;
};

export const api = {
  // Queue methods
  getQueues: () => request<Queue[]>('/api/queues'),
  getQueueById: (id: number) => request<Queue>(`/api/queues/${id}`),

  // Ticket methods
  getTickets: () => request<Ticket[]>('/api/tickets'),
  getTicketById: (id: number) => request<Ticket>(`/api/tickets/${id}`),
  createTicket: (queueId: number) => request<Ticket>('/api/tickets', {
    method: 'POST',
    data: { queueId },
  }),
  cancelTicket: (ticketId: number) => request<void>(`/api/tickets/${ticketId}`, {
    method: 'DELETE',
  }),

  // User methods
  getUser: () => request<User>('/api/user'),
};
