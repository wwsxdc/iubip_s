
import { Queue } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type QueueCardProps = {
  queue: Queue;
};

const QueueCard = ({ queue }: QueueCardProps) => {
  // Check if we're in a router context
  let navigate;
  let canUseRouter = false;
  
  try {
    navigate = useNavigate();
    canUseRouter = true;
  } catch (error) {
    console.log("QueueCard is being used outside of Router context");
  }

  const handleSelectQueue = () => {
    if (canUseRouter) {
      navigate(`/queue/${queue.id}`);
    } else {
      // Fallback for when used outside router
      window.location.href = `/queue/${queue.id}`;
    }
  };

  return (
    <Card className="queue-card mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{queue.name}</CardTitle>
        <CardDescription>{queue.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>~{queue.averageWaitTime} мин. ожидания</span>
          </div>
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            <span>{queue.ticketsCount} человек в очереди</span>
          </div>
        </div>
        {queue.currentTicket && (
          <div className="text-sm bg-muted p-2 rounded-md">
            <span className="font-medium">Текущий номер: </span>
            <span className="ticket-number font-bold">{queue.currentTicket}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSelectQueue} 
          className="w-full bg-university-600 hover:bg-university-700"
        >
          Встать в очередь
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QueueCard;
