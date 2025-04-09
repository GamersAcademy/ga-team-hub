
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  ClipboardList,
  Users,
  BookOpen,
  Code,
  LogOut,
  Menu,
  X,
  Bell,
  CheckCircle2,
  User,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNavProps } from "./SidebarNavProps";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const SidebarNav = ({ onToggle }: SidebarNavProps) => {
  const { currentUser, logout } = useAuth();
  // Safely access location - wrapped in try-catch to prevent errors outside Router context
  let location = { pathname: "/" };
  try {
    location = useLocation();
  } catch (error) {
    console.warn("useLocation hook called outside Router context");
  }
  
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // Admin and manager navigation items
  const adminNavItems: NavItem[] = [
    {
      title: "Orders Dashboard",
      href: "/admin/orders",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Team Management",
      href: "/admin/team",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Knowledge Base",
      href: "/admin/knowledge",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  // Team member navigation items
  const teamNavItems: NavItem[] = [
    {
      title: "My Tasks",
      href: "/team/tasks",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Knowledge Base",
      href: "/team/knowledge",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  // Developer navigation items
  const developerNavItems: NavItem[] = [
    {
      title: "API Dashboard",
      href: "/developer",
      icon: <Code className="h-5 w-5" />,
    },
  ];

  // Determine which nav items to use based on user role
  const navItems =
    currentUser?.role === "admin" || currentUser?.role === "manager"
      ? adminNavItems
      : currentUser?.role === "developer"
      ? developerNavItems
      : teamNavItems;

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo and header */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link to="/" className="flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-teal-500" />
          <h1 className="text-xl font-bold">OrderFlow Hub</h1>
        </Link>
      </div>

      {/* User info */}
      {currentUser && (
        <div className="flex items-center gap-3 px-6 py-4 border-b border-sidebar-border">
          <Avatar>
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">
              {currentUser.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {currentUser.role}
              {currentUser.department && ` • ${currentUser.department}`}
            </p>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === item.href &&
                    "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="px-3 py-4 border-t border-sidebar-border mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" onClick={onToggle}>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <CheckCircle2 className="h-6 w-6 text-teal-500" />
              <span className="font-bold">OrderFlow</span>
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <Button variant="outline" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </header>
      </>
    );
  }

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50">
      <SidebarContent />
    </div>
  );
};

export default SidebarNav;
