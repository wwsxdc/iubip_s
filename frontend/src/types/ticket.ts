export interface Ticket {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  location: string;
}

export interface Reservation {
  id: string;
  ticketId: string;
  userId: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
} 