import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockOrders, mockUsers } from "@/data/mockData";
import { Order, OrderStatus } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const OrdersDashboard = () => {
  const { t, direction } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Auto-refresh setup (simulate API polling)
  useEffect(() => {
    const autoRefreshInterval = setInterval(() => {
      // Simulate API check for new orders
      if (Math.random() > 0.7) { // 30% chance of new order
        handleRefresh();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(autoRefreshInterval);
  }, []);

  // Handle search
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        searchQuery === "" ||
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "all" || order.status === activeTab;

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
        if (status === "in_progress") {
          timeline.started = new Date().toISOString();
        } else if (status === "completed") {
          timeline.completed = new Date().toISOString();
        }
        
        return { ...order, status, timeline };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    toast.success(`${t("order")} ${t("status")} ${t("updated")} ${t("to")} ${status}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Simulating new order coming in
      const shouldAddNewOrder = Math.random() > 0.5;
      
      if (shouldAddNewOrder) {
        const newOrder: Order = {
          id: `ord${orders.length + 1}`,
          orderId: `ORD-${new Date().getFullYear()}-${(orders.length + 10).toString().padStart(3, '0')}`,
          customerId: `CUST-${(orders.length + 10).toString().padStart(3, '0')}`,
          customerName: "New Customer",
          department: ["Electronics", "Clothing", "Home Goods"][Math.floor(Math.random() * 3)],
          orderDate: new Date().toISOString(),
          status: "pending",
          details: {
            items: [
              { 
                id: `item-new-${Date.now()}`, 
                name: "New Product", 
                quantity: Math.floor(Math.random() * 3) + 1, 
                price: Math.floor(Math.random() * 1000) + 100 
              }
            ],
            shippingAddress: "Customer Address"
          },
          expectedCompletionTime: 30 + Math.floor(Math.random() * 60)
        };
        
        setOrders([newOrder, ...orders]);
        
        // Play notification sound for new order
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play();
        
        toast.success(t("newOrderReceived"), {
          description: `${t("order")} #${newOrder.orderId} ${t("from")} ${newOrder.customerName}`,
        });
      } else {
        toast.info(t("noNewOrders"));
      }
      
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1500);
  };

  // Stats counts
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const inProgressCount = orders.filter((order) => order.status === "in_progress").length;
  const completedCount = orders.filter((order) => order.status === "completed").length;

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${direction === "rtl" ? "md:flex-row-reverse text-right" : ""}`}>
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("ordersDashboard")}</h1>
            <p className="text-muted-foreground">
              {t("manageOrders")}
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

        {/* Orders grid */}
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
            <h3 className="text-lg font-medium">{t("noOrdersFound")}</h3>
            <p className="text-muted-foreground text-center max-w-md mt-1">
              {searchQuery
                ? t("adjustSearch")
                : t("ordersWillAppear")}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrdersDashboard;
