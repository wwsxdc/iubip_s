
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, User, LogOut } from "lucide-react";

type HeaderProps = {
  title: string;
  showBack?: boolean;
  showProfile?: boolean;
};

const Header = ({ title, showBack = false, showProfile = false }: HeaderProps) => {
  // Check if we're in a router context
  let navigate;
  let canUseRouter = false;
  
  try {
    navigate = useNavigate();
    canUseRouter = true;
  } catch (error) {
    console.log("Header is being used outside of Router context");
  }
  
  const { logout, isAuthenticated } = useAuth();

  const handleBack = () => {
    if (canUseRouter) {
      navigate(-1);
    } else {
      // Fallback for when used outside router
      window.history.back();
    }
  };

  const handleProfile = () => {
    if (canUseRouter) {
      navigate("/profile");
    } else {
      // Fallback for when used outside router
      window.location.href = "/profile";
    }
  };

  const handleLogout = () => {
    logout();
    
    if (canUseRouter) {
      navigate("/");
    } else {
      // Fallback for when used outside router
      window.location.href = "/";
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
              <ArrowLeft className="size-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold text-university-800">{title}</h1>
        </div>
        
        {isAuthenticated && showProfile && (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleProfile}>
              <User className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="size-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
