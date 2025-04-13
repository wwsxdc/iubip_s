import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import ProfileSection from "@/components/ProfileSection";
import TicketInfo from "@/components/TicketInfo";
import { api } from "@/services/api";
import { Ticket } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const userTickets = await api.getTickets();
        setTickets(userTickets);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить билеты",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user, navigate, toast]);

  const handleTicketUpdate = async () => {
    if (!user) return;
    
    try {
      const userTickets = await api.getTickets();
      setTickets(userTickets);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные билетов",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mobile-container">
      <Header title="Профиль" showBack />
      
      <main className="flex-1 p-4">
        <ProfileSection />
        
        <h2 className="text-xl font-bold mb-4">История билетов</h2>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : tickets.length > 0 ? (
          <div>
            {tickets.map((ticket) => (
              <TicketInfo 
                key={ticket.id} 
                ticket={ticket}
                onUpdate={handleTicketUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">У вас нет билетов</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
