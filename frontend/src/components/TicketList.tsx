import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ticketService } from '@/services/ticketService';
import { Ticket } from '@/types/ticket';
import { useToast } from '@/components/ui/use-toast';

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await ticketService.getAllTickets();
      setTickets(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tickets. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReservation = async (ticketId: string) => {
    try {
      await ticketService.createReservation(ticketId, 1);
      toast({
        title: "Success",
        description: "Ticket reserved successfully!",
      });
      loadTickets(); // Refresh the list to update availability
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reserve ticket. Please try again.",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading tickets...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {tickets.map((ticket) => (
        <Card key={ticket.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
            <CardDescription>{ticket.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Date:</strong> {ticket.date}</p>
              <p><strong>Time:</strong> {ticket.time}</p>
              <p><strong>Location:</strong> {ticket.location}</p>
              <p><strong>Price:</strong> ${ticket.price}</p>
              <p><strong>Available Seats:</strong> {ticket.availableSeats}</p>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              onClick={() => handleReservation(ticket.id)}
              disabled={ticket.availableSeats === 0}
              className="w-full"
            >
              {ticket.availableSeats > 0 ? 'Reserve Ticket' : 'Sold Out'}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 