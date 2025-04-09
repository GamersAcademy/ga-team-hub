
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const Index = () => {
  const { isAuthenticated, currentUser, redirectBasedOnRole } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their appropriate dashboard
  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      redirectBasedOnRole();
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, currentUser, redirectBasedOnRole, navigate]);

  // This content will be shown briefly during redirect
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-teal-500" />
            <span className="font-bold text-xl">OrderFlow Team Hub</span>
          </div>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </header>

      {/* Loading State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default Index;
