
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import LanguageToggle from "@/components/common/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Container,
  LayoutDashboard,
  LogOut,
  Package2,
  Settings,
  User2,
  Users,
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  onToggle: () => void;
}

export function SidebarNav({
  isCollapsed,
  onToggle,
  className,
  ...props
}: SidebarNavProps) {
  const { t, direction } = useLanguage();
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Items for admin navigation
  const adminItems = [
    {
      title: t("orders"),
      href: "/admin/orders",
      icon: Package2,
      isActive: pathname.includes("/admin/orders"),
    },
    {
      title: t("team"),
      href: "/admin/team",
      icon: Users,
      isActive: pathname.includes("/admin/team"),
    },
    {
      title: t("knowledge"),
      href: "/admin/knowledge",
      icon: BookOpen,
      isActive: pathname.includes("/admin/knowledge"),
    },
    {
      title: t("performanceStats"),
      href: "/admin/performance",
      icon: BarChart3,
      isActive: pathname.includes("/admin/performance"),
    },
  ];

  // Items for employee navigation
  const employeeItems = [
    {
      title: t("myTasks"),
      href: "/team/tasks",
      icon: ClipboardList,
      isActive: pathname.includes("/team/tasks"),
    },
    {
      title: t("teamKnowledge"),
      href: "/team/knowledge",
      icon: BookOpen,
      isActive: pathname.includes("/team/knowledge"),
    },
  ];

  // Items for developer navigation
  const developerItems = [
    {
      title: t("dashboard"),
      href: "/developer",
      icon: LayoutDashboard,
      isActive: pathname.includes("/developer"),
    },
  ];

  // Determine which navigation items to show based on user role
  let navItems = [];
  if (currentUser?.role === "admin") {
    navItems = adminItems;
  } else if (currentUser?.role === "employee") {
    navItems = employeeItems;
  } else if (currentUser?.role === "developer") {
    navItems = developerItems;
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {!isCollapsed ? (
          <div className="flex items-center">
            <Container className="h-6 w-6 mr-2" />
            <span className="font-bold">OrderFlow</span>
          </div>
        ) : (
          <Container className="h-6 w-6 mx-auto" />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : direction === "rtl" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea
        className={cn(
          "flex flex-col flex-1 bg-background p-2 gap-2",
          isCollapsed && "p-1 gap-1"
        )}
      >
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className="no-underline"
            onMouseEnter={() => setHoveredItem(item.title)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Button
              variant={item.isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2"
              )}
              size={isCollapsed ? "icon" : "default"}
            >
              <item.icon className={isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-3"} />
              {!isCollapsed && <span>{item.title}</span>}
            </Button>
            {isCollapsed && hoveredItem === item.title && (
              <div className="absolute z-50 left-16 bg-background border shadow-md rounded p-2 text-sm whitespace-nowrap">
                {item.title}
              </div>
            )}
          </Link>
        ))}
      </ScrollArea>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex justify-center">
          <LanguageToggle />
        </div>
        {!isCollapsed && currentUser && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <User2 className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {currentUser.role}
                {currentUser.sections && currentUser.sections.length > 0
                  ? ` - ${currentUser.sections[0]}`
                  : ""}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-2"
          )}
          onClick={() => logout()}
        >
          <LogOut className={isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2"} />
          {!isCollapsed && <span>{t("logout")}</span>}
        </Button>
      </div>
    </div>
  );
}

export default SidebarNav;
