
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "../types";
import { mockUsers } from "../data/mockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  redirectBasedOnRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Function to redirect based on user role
  const redirectBasedOnRole = () => {
    if (!currentUser) return;

    switch (currentUser.role) {
      case "admin":
      case "manager":
        navigate("/admin/orders");
        break;
      case "team":
        navigate("/team/tasks");
        break;
      case "developer":
        navigate("/developer");
        break;
      default:
        navigate("/");
    }
  };

  // Auto-redirect when user changes
  useEffect(() => {
    if (currentUser && !isLoading) {
      redirectBasedOnRole();
    }
  }, [currentUser, isLoading]);

  // Login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email (in real app, would verify password too)
      const user = mockUsers.find(user => user.email === email);
      
      if (user) {
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
        redirectBasedOnRole();
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.info("You have been logged out");
    navigate("/login");
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    logout,
    redirectBasedOnRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
