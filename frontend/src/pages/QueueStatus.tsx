import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { api } from "@/services/api";
import { Queue, Ticket, TicketStatus, QueueType, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, Users, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Расширяем тип Ticket для поддержки backend формата
interface BackendTicket extends Omit<Ticket, 'queueType' | 'userId' | 'estimatedTime' | 'createdAt'> {
  queue_id: string;
  queue_type: string;
  user_id: string;
  estimated_time: number;
  created_at: string;
}

const QueueStatus = () => {
  const { id: queueId } = useParams<{ id: string }>();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<Queue | null>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Проверяем авторизацию
    const checkAuth = async () => {
      try {
        const userData = await api.getUser();
        setUser(userData);
      } catch (error) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      
      loadQueueData();
    };
    
    const loadQueueData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!queueId) {
          setError("Не указан идентификатор очереди");
          return;
        }

        const queueIdNumber = parseInt(queueId, 10);
        if (isNaN(queueIdNumber)) {
          setError("Некорректный идентификатор очереди");
          return;
        }

        const queueData = await api.getQueueById(queueIdNumber);
        setQueue(queueData);
        
        // Получаем билеты пользователя
        const tickets = await api.getTickets();
        
        // Проверяем, есть ли у пользователя билет в этой очереди
        const userTicket = tickets.find(t => (t as unknown as BackendTicket).queue_id.toString() === queueId);
        
        if (userTicket) {
          const backendTicket = userTicket as unknown as BackendTicket;
          setTicket({
            ...userTicket,
            queueType: backendTicket.queue_type as QueueType,
            userId: backendTicket.user_id,
            status: backendTicket.status as TicketStatus,
            estimatedTime: backendTicket.estimated_time,
            createdAt: backendTicket.created_at,
          });
        }
      } catch (error) {
        setError("Ошибка при загрузке данных");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [queueId, navigate, location.pathname]);

  const handleGetTicket = async () => {
    if (!queue || !queueId) return;
    
    const queueIdNumber = parseInt(queueId, 10);
    if (isNaN(queueIdNumber)) {
      toast({
        title: "Ошибка",
        description: "Некорректный идентификатор очереди",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      const newTicket = await api.createTicket(queueIdNumber);
      
      const backendTicket = newTicket as unknown as BackendTicket;
      setTicket({
        ...newTicket,
        queueType: backendTicket.queue_type as QueueType,
        userId: backendTicket.user_id,
        status: backendTicket.status as TicketStatus,
        estimatedTime: backendTicket.estimated_time,
        createdAt: backendTicket.created_at,
      });
      
      toast({
        title: "Билет получен!",
        description: `Ваш номер: ${newTicket.number}`,
        variant: "default",
      });
      
      // Обновляем информацию об очереди
      const updatedQueue = await api.getQueueById(queueIdNumber);
      setQueue(updatedQueue);
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить билет. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!ticket || !queueId) return;
    
    const queueIdNumber = parseInt(queueId, 10);
    if (isNaN(queueIdNumber)) {
      toast({
        title: "Ошибка",
        description: "Некорректный идентификатор очереди",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const ticketId = parseInt(ticket.id, 10);
      if (isNaN(ticketId)) {
        throw new Error("Некорректный идентификатор билета");
      }
      await api.cancelTicket(ticketId);
      
      toast({
        title: "Билет отменен",
        description: "Вы успешно отменили свой билет.",
        variant: "default",
      });
      
      setTicket(null);
      
      // Обновляем информацию об очереди
      const updatedQueue = await api.getQueueById(queueIdNumber);
      setQueue(updatedQueue);
      
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отменить билет. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = () => {
    if (ticket) {
      const ticketId = typeof ticket.id === 'string' ? parseInt(ticket.id, 10) : ticket.id;
      navigate(`/ticket/${ticketId}`);
    }
  };

  if (error) {
    return (
      <div className="mobile-container">
        <Header title="Ошибка" showBack />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Произошла ошибка</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container">
      <Header title="Информация об очереди" showBack showProfile />
      
      <main className="flex-1 p-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-60 w-full rounded-lg" />
          </div>
        ) : queue ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{queue.name}</CardTitle>
                <CardDescription>{queue.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {queue.currentTicket && (
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Текущий номер:</span>
                      <span className="ticket-number text-xl font-bold text-primary">
                        {queue.currentTicket}
                      </span>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between text-sm pt-2">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>~{queue.averageWaitTime} мин. ожидания</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                    <span>{queue.ticketsCount} в очереди</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {ticket ? (
              <Card className="mb-6 border-2 border-primary">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>Ваш билет</span>
                    <span className="ticket-number text-xl text-primary">{ticket.number}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      {ticket.status === TicketStatus.NEXT ? (
                        <>
                          <AlertCircle className="h-5 w-5 mr-2 text-green-600" />
                          <span className="font-medium text-green-800">Ваша очередь скоро подойдет!</span>
                        </>
                      ) : ticket.status === TicketStatus.WAITING ? (
                        <>
                          <Clock className="h-5 w-5 mr-2 text-amber-600" />
                          <span className="font-medium">
                            Позиция в очереди: <strong>{ticket.position}</strong>
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                          <span className="font-medium">Ваш билет активен</span>
                        </>
                      )}
                    </div>
                    
                    {ticket.estimatedTime && (
                      <div className="flex items-center justify-center">
                        <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                        <span>
                          Примерное время ожидания: <strong>{ticket.estimatedTime} мин.</strong>
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleViewTicket}
                  >
                    Просмотреть билет
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={handleCancelTicket}
                  >
                    Отменить билет
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Получить билет</CardTitle>
                  <CardDescription>
                    Нажмите кнопку ниже, чтобы встать в очередь
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleGetTicket}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Получение билета...
                      </>
                    ) : (
                      'Получить билет'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
};

export default QueueStatus;
