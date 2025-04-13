import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Электронная очередь
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Удобная система управления очередями для приемной кампании университета
            </p>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            <div className="bg-card rounded-lg border p-4 shadow-sm mb-4">
              <h2 className="font-semibold text-primary mb-2">Преимущества</h2>
              <ul className="text-sm text-left space-y-2">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Запись в очередь онлайн</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Уведомления о статусе</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>Отслеживание позиции в очереди</span>
                </li>
              </ul>
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={() => navigate("/login")}
            >
              Войти
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/register")}
            >
              Зарегистрироваться
            </Button>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Университетская система очередей
      </footer>
    </div>
  );
};

export default Index;
