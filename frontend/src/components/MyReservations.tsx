import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ticketService } from '../services/ticketService';
import { Reservation } from '../types/ticket';
import { useToast } from './ui/use-toast';

export function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await ticketService.getMyReservations();
      setReservations(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reservations. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading reservations...</div>;
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold">No Reservations</h2>
        <p className="text-gray-500 mt-2">You haven't made any reservations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
      {reservations.map((reservation) => (
        <Card key={reservation.id}>
          <CardHeader>
            <CardTitle>Reservation #{reservation.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Status:</strong> <span className="capitalize">{reservation.status}</span></p>
              <p><strong>Quantity:</strong> {reservation.quantity}</p>
              <p><strong>Created:</strong> {new Date(reservation.createdAt).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 