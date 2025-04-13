
import { Ticket, TicketStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, AlertCircle, CheckCircle, XCircle, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";
import { useState } from "react";

type TicketInfoProps = {
  ticket: Ticket;
  onUpdate?: () => void;
};

const TicketInfo = ({ ticket, onUpdate }: TicketInfoProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.WAITING:
        return <Badge variant="outline" className="ticket-status-waiting">В ожидании</Badge>;
      case TicketStatus.NEXT:
        return <Badge variant="outline" className="ticket-status-next">Следующий</Badge>;
      case TicketStatus.SERVING:
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Обслуживается</Badge>;
      case TicketStatus.SERVED:
        return <Badge variant="outline" className="ticket-status-served">Обслужен</Badge>;
      case TicketStatus.MISSED:
        return <Badge variant="outline" className="ticket-status-missed">Пропущен</Badge>;
      case TicketStatus.CANCELLED:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Отменен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const handleCancelTicket = async () => {
    setLoading(true);
    try {
      await api.cancelTicket(ticket.id);
      toast({
        title: "Билет отменен",
        description: `Билет ${ticket.number} был успешно отменен.`,
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отменить билет. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`mb-4 border-2 ${ticket.status === TicketStatus.NEXT ? 'border-green-500 shadow-md' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Билет <span className="ticket-number text-university-700">{ticket.number}</span>
          </CardTitle>
          {getStatusBadge(ticket.status)}
        </div>
        <p className="text-xs text-muted-foreground">
          Создан: {formatDate(ticket.createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {ticket.status === TicketStatus.WAITING && (
              <>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Позиция в очереди: <strong>{ticket.position}</strong></span>
                </div>
                {ticket.estimatedTime && (
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Примерное время ожидания: <strong>{ticket.estimatedTime} мин.</strong></span>
                  </div>
                )}
              </>
            )}
            
            {ticket.status === TicketStatus.NEXT && (
              <div className="p-2 bg-green-50 rounded-md border border-green-200 text-sm flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-green-600" />
                <span className="text-green-800">Приготовьтесь! Скоро ваша очередь</span>
              </div>
            )}
            
            {ticket.status === TicketStatus.SERVING && (
              <div className="p-2 bg-blue-50 rounded-md border border-blue-200 text-sm flex items-center">
                <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
                <span className="text-blue-800">Подойдите к окну обслуживания</span>
              </div>
            )}
            
            {ticket.status === TicketStatus.MISSED && (
              <div className="p-2 bg-red-50 rounded-md border border-red-200 text-sm flex items-center">
                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                <span className="text-red-800">Вы пропустили свою очередь</span>
              </div>
            )}

            {(ticket.status === TicketStatus.WAITING || ticket.status === TicketStatus.NEXT) && (
              <Button 
                variant="outline" 
                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 mt-2"
                onClick={handleCancelTicket}
                disabled={loading}
              >
                {loading ? "Отмена..." : "Отменить билет"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketInfo;
