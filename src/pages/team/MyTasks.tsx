import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders } from "@/data/mockData";
import { Order, OrderStatus } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import TaskTimer from "@/components/countdown/TaskTimer";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCcw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

const MyTasks = () => {
  const { t, direction } = useLanguage();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Determine if current time is within user's shift
  const isWithinShift = () => {
    if (!currentUser) return false;
    
    // Mock implementation
    return true;
  };

  // Auto-refresh for new task assignments
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Simulate checking for new tasks
      const shouldCheckForTasks = Math.random() > 0.7; // 30% chance
      if (shouldCheckForTasks) {
        handleRefresh();
      }
    }, 45000); // Check every 45 seconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Initial load of orders
  useEffect(() => {
    // Filter to only show orders assigned to current user
    const userOrders = mockOrders.filter(
      (order) => order.assignedStaff?.id === currentUser?.id
    );
    setOrders(userOrders);
    setFilteredOrders(userOrders);
    setIsLoading(false);
  }, [currentUser]);

  // Handle search and filtering
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab = activeTab === "all" || order.status === activeTab;

      return matchesSearch && matchesTab;
    });

    setFilteredOrders(filtered);
  }, [searchQuery, activeTab, orders]);

  // Handle status change
  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const timeline = { ...order.timeline } || {};
        
        // Update timeline based on status
        if (status === "in_progress" && !timeline.started) {
          timeline.started = new Date().toISOString();
        } else if (status === "completed" && !timeline.completed) {
          timeline.completed = new Date().toISOString();
          
          // Play completion sound
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.volume = 0.5;
          audio.play();
        }
        
        return { ...order, status, timeline };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    toast.success(`${t("task")} ${t("status")} ${t("updated")} ${t("to")} ${status}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Simulate a new order assignment
      const shouldAddNewOrder = Math.random() > 0.5;
      
      if (shouldAddNewOrder && currentUser) {
        const unassignedOrders = mockOrders.filter(
          (order) => !order.assignedStaff && order.status === "pending"
        );
        
        if (unassignedOrders.length > 0) {
          const randomIndex = Math.floor(Math.random() * unassignedOrders.length);
          const newAssignedOrder = {
            ...unassignedOrders[randomIndex],
            assignedStaff: currentUser,
            timeline: { assigned: new Date().toISOString() }
          };
          
          setOrders([newAssignedOrder, ...orders]);
          
          // Play notification sound for new task
          const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
          audio.play();
          
          toast.success(t("newTaskAssigned"), {
            description: `${t("order")} #${newAssignedOrder.orderId} ${t("from")} ${newAssignedOrder.customerName}`,
          });
        } else {
          toast.info(t("noNewTasksAvailable"));
        }
      } else {
        toast.info(t("noChangesFound"));
      }
      
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  // Stats counts
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const inProgressCount = orders.filter((order) => order.status === "in_progress").length;
  const completedCount = orders.filter((order) => order.status === "completed").length;

  // Render conditional loading state
  if (isLoading && orders.length === 0) {
    return (
      <DashboardLayout allowedRoles={["employee"]}>
        <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">{t("loadingTasks")}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRoles={["employee"]}>
      <div className="space-y-6">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${direction === "rtl" ? "md:flex-row-reverse text-right" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("myTasks")}</h1>
            <p className="text-muted-foreground">
              {t("viewManageTasks")}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 ${direction === "rtl" ? "flex-row-reverse" : ""}`}>
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {t("lastUpdated")}: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              <span>{isLoading ? t("refreshing") : t("refresh")}</span>
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-yellow-800 font-medium">{t("pendingOrders")}</p>
              <p className="text-2xl font-bold text-yellow-900">{pendingCount}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-700" />
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">{t("inProgress")}</p>
              <p className="text-2xl font-bold text-blue-900">{inProgressCount}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">{t("completed")}</p>
              <p className="text-2xl font-bold text-green-900">{completedCount}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </div>

        {/* Active task timer */}
        {orders.some(order => order.status === "in_progress") && (
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium mb-2">{t("activeTask")}</h3>
            {orders
              .filter(order => order.status === "in_progress")
              .map(order => (
                <div key={order.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span>#{order.orderId} - {order.customerName}</span>
                  </div>
                  <TaskTimer 
                    taskId={order.id} 
                    allowedTime={order.expectedCompletionTime || 60} 
                    startTime={order.timeline?.started}
                    isWithinShift={isWithinShift()}
                  />
                </div>
              ))
            }
          </div>
        )}

        {/* Search and filter */}
        <div className={`flex flex-col sm:flex-row gap-4 ${direction === "rtl" ? "sm:flex-row-reverse" : ""}`}>
          <div className="relative flex-1">
            <Search className={`absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`} />
            <Input
              placeholder={t("searchOrders")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={direction === "rtl" ? "pr-8 text-right" : "pl-8"}
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            className="w-full sm:w-auto"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">{t("all")}</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1">{t("pending")}</TabsTrigger>
              <TabsTrigger value="in_progress" className="flex-1">{t("inProgress")}</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">{t("completed")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tasks grid */}
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
            <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-lg font-medium">{t("noTasksFound")}</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {searchQuery || activeTab !== "all"
                ? t("adjustSearch")
                : t("noAssignedTasks")}
            </p>
            <Button variant="outline" onClick={handleRefresh} className="mt-4 gap-2">
              <RefreshCcw className="h-4 w-4" />
              {t("checkForNewTasks")}
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTasks;
