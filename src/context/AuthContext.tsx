
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers } from '@/data/mockData';
import { User, UserRole } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  redirectBasedOnRole: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check if authentication state is ready
  const isAuthenticated = !!currentUser;

  // Redirect based on user role
  const redirectBasedOnRole = () => {
    if (!currentUser) return;
    
    if (currentUser.role === 'admin') {
      navigate('/admin/orders');
    } else if (currentUser.role === 'employee') {
      navigate('/team/tasks');
    } else if (currentUser.role === 'developer') {
      navigate('/developer');
    }
  };

  useEffect(() => {
    // Check if already logged in from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        
        // Redirect based on role
        if (user.role === 'admin') {
          navigate('/admin/orders');
        } else if (user.role === 'employee') {
          navigate('/team/tasks');
        } else if (user.role === 'developer') {
          navigate('/developer');
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('user');
      }
    } else {
      // If not logged in, redirect to login
      navigate('/login');
    }
    
    // Set loading to false after authentication check
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(user => user.email === email);
        
        if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Redirect based on role
          if (user.role === 'admin') {
            navigate('/admin/orders');
          } else if (user.role === 'employee') {
            navigate('/team/tasks');
          } else if (user.role === 'developer') {
            navigate('/developer');
          }
          
          resolve(true);
        } else {
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isLoggedIn, 
      isAuthenticated, 
      isLoading,
      redirectBasedOnRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
