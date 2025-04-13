import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import QueueCard from "@/components/QueueCard";
import { api } from "@/services/api";
import { Queue } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const QueueSelection = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        setLoading(true);
        const availableQueues = await api.getQueues();
        setQueues(availableQueues);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список очередей",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQueues();
  }, [toast]);

  return (
    <div className="mobile-container">
      <Header title="Выбор очереди" showBack showProfile />
      
      <main className="flex-1 p-4">
        <h2 className="text-xl font-bold mb-4">Доступные очереди</h2>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ) : queues.length > 0 ? (
          <div>
            {queues.map((queue) => (
              <QueueCard key={queue.id} queue={queue} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Нет доступных очередей</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QueueSelection;
