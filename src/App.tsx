
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import PerformanceDashboard from "./pages/admin/PerformanceDashboard";
import TutorialsDashboard from "./pages/admin/TutorialsDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Admin Routes */}
              <Route path="/admin/orders" element={<OrdersDashboard />} />
              <Route path="/admin/team" element={<TeamManagement />} />
              <Route path="/admin/knowledge" element={<KnowledgeBase />} />
              <Route path="/admin/performance" element={<PerformanceDashboard />} />
              <Route path="/admin/tutorials" element={<TutorialsDashboard />} />
              
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
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
