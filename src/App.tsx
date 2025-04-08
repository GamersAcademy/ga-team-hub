
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import OrdersDashboard from "./pages/admin/OrdersDashboard";
import TeamManagement from "./pages/admin/TeamManagement";
import KnowledgeBase from "./pages/admin/KnowledgeBase";
import MyTasks from "./pages/team/MyTasks";
import TeamKnowledgeBase from "./pages/team/TeamKnowledgeBase";
import DeveloperDashboard from "./pages/developer/DeveloperDashboard";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin/orders" element={<OrdersDashboard />} />
              <Route path="/admin/team" element={<TeamManagement />} />
              <Route path="/admin/knowledge" element={<KnowledgeBase />} />
              
              {/* Team Routes */}
              <Route path="/team/tasks" element={<MyTasks />} />
              <Route path="/team/knowledge" element={<TeamKnowledgeBase />} />
              
              {/* Developer Routes */}
              <Route path="/developer" element={<DeveloperDashboard />} />
              
              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  </QueryClientProvider>
);

export default App;
