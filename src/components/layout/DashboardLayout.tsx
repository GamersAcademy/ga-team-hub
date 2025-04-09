
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { AttendanceModal } from "../modals/AttendanceModal";
import { toast as sonnerToast } from "sonner";

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
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);

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
      if (currentUser.role === "team") {
        navigate("/team/tasks");
      } else if (currentUser.role === "admin" || currentUser.role === "manager") {
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openAttendanceModal = () => {
    setIsAttendanceModalOpen(true);
  };

  const closeAttendanceModal = () => {
    setIsAttendanceModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarNav onToggle={toggleSidebar} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster position="top-right" />
      {currentUser && (
        <AttendanceModal 
          isOpen={isAttendanceModalOpen}
          onClose={closeAttendanceModal}
          staffMember={currentUser}
          onAttendanceSubmit={() => {
            // Handle attendance submission
            sonnerToast.success("Attendance recorded");
            closeAttendanceModal();
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
