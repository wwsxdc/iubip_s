import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";


type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Упрощенная проверка аутентификации без CSRF
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include',
    });

    const response = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Login server error:", error);
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  } finally {
    setLoading(false);
  }
};


  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });
      // Упрощенная регистрация без CSRF
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          password_confirmation: password 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Registration server error:", error);
      
        // Логируем каждую конкретную ошибку валидации
        if (error.errors) {
          for (const field in error.errors) {
            console.error(`${field}: ${error.errors[field].join(', ')}`);
          }
        }
      
        throw new Error(error.message || 'Registration failed');
      }
      

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Registration error:", error); // Логируем ошибку на клиенте
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      // В случае ошибки все равно выходим на клиенте
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
