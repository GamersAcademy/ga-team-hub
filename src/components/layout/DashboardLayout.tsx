
import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { Toaster } from "sonner";
import { AttendanceModal } from "../modals/AttendanceModal";
import LanguageToggle from "../common/LanguageToggle";

interface DashboardLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

const DashboardLayout = ({
  children,
  requireAuth = true,
  allowedRoles,
}: DashboardLayoutProps) => {
  const { isAuthenticated, currentUser, isLoading } = useAuth();
  const { direction } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

  // Only run the effect if we are inside a Router context
  useEffect(() => {
    // Check if authentication is required but user is not logged in
    if (requireAuth && !isLoading && !isAuthenticated) {
      navigate("/login");
    }

    // Check if user role is allowed for this route
    if (
      requireAuth &&
      !isLoading &&
      isAuthenticated &&
      allowedRoles &&
      currentUser &&
      !allowedRoles.includes(currentUser.role)
    ) {
      // Redirect based on user role
      if (currentUser.role === "employee") {
        navigate("/team/tasks");
      } else if (currentUser.role === "admin") {
        navigate("/admin/orders");
      } else if (currentUser.role === "developer") {
        navigate("/developer");
      } else {
        navigate("/login");
      }
    }
  }, [requireAuth, isAuthenticated, allowedRoles, currentUser, isLoading, navigate]);

  // Show loading state if still loading authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200" />
          <div className="h-4 w-24 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  // Don't render children if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Dummy data for the attendance modal
  const dummyStaffMember = currentUser || {
    id: "dummy",
    name: "User",
    email: "user@example.com",
    role: "employee",
    shiftStart: "09:00",
    shiftEnd: "17:00"
  };

  return (
    <div className={`flex h-screen bg-gray-50 ${direction === "rtl" ? "text-right" : ""}`}>
      <SidebarNav 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      <div className="flex flex-1 flex-col lg:pl-64">
        <div className="p-4 flex justify-end">
          <LanguageToggle />
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
      <AttendanceModal 
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        staffMember={dummyStaffMember as any}
        onAttendanceSubmit={() => {}}
      />
    </div>
  );
};

export default DashboardLayout;
