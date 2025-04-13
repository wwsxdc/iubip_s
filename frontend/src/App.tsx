import { jsxDEV } from "react/jsx-dev-runtime";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import QueueSelection from "./pages/QueueSelection";
import QueueStatus from "./pages/QueueStatus";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { TicketList } from "./components/TicketList";
import { MyReservations } from "./components/MyReservations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/queue-selection" element={<QueueSelection />} />
            <Route path="/queue/:queueId" element={<QueueStatus />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/tickets" element={<TicketList />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
