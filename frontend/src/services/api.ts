import { Queue, Ticket, User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

export const api = {
  // Queue methods
  getQueues: () => request('/queues'),
  getQueueById: (id: number) => request(`/queues/${id}`),

  // Ticket methods
  getTickets: () => request('/tickets'),
  getTicketById: (id: number) => request(`/tickets/${id}`),
  createTicket: (queueId: number) => request('/tickets', {
    method: 'POST',
    body: JSON.stringify({ queueId }),
  }),
  cancelTicket: (ticketId: number) => request(`/tickets/${ticketId}`, {
    method: 'DELETE',
  }),

  // User methods
  getUser: () => request('/user'),
};
