import { Ticket, Reservation } from '../types/ticket';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

export const ticketService = {
  async getAllTickets(): Promise<Ticket[]> {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'GET',
      credentials: 'include',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tickets');
    }
    return response.json();
  },

  async getTicketById(id: string): Promise<Ticket> {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch ticket');
    }
    return response.json();
  },

  async createReservation(ticketId: string, quantity: number): Promise<Reservation> {
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      credentials: 'include',
      headers: defaultHeaders,
      body: JSON.stringify({
        ticketId,
        quantity,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to create reservation');
    }
    return response.json();
  },

  async getMyReservations(): Promise<Reservation[]> {
    const response = await fetch(`${API_URL}/reservations/my`, {
      method: 'GET',
      credentials: 'include',
      headers: defaultHeaders,
    });
    if (!response.ok) {
      throw new Error('Failed to fetch reservations');
    }
    return response.json();
  },
}; 