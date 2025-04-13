import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import TicketInfo from "@/components/TicketInfo";
import { api } from "@/services/api";
import { Ticket } from "@/types";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
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

  const handleRefresh = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userTickets = await api.getTickets();
      setTickets(userTickets);
      toast({
        title: "Обновлено",
        description: "Данные билетов обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mobile-container">
        <Header title="Главная" />
        <div className="flex-1 flex items-center justify-center p-4">
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <Header title="Главная" showProfile />
      
      <main className="flex-1 p-4">
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Мои билеты</h2>
            <Button variant="ghost" size="sm" onClick={handleRefresh}>
              Обновить
            </Button>
          </div>
          
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
                  onUpdate={handleRefresh}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 border rounded-lg bg-muted/50">
              <p className="mb-4 text-muted-foreground">У вас нет активных билетов</p>
              <Button 
                onClick={() => navigate("/queue-selection")}
                className="bg-primary hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Получить билет
              </Button>
            </div>
          )}
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Быстрая запись</h2>
          </div>
          <Button 
            onClick={() => navigate("/queue-selection")}
            className="w-full bg-primary hover:bg-primary/90 mb-4"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Выбрать очередь
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Home;
