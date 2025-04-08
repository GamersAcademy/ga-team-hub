import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TrackDialog } from "@/components/dashboard/TrackDialog";
import { Order, OrderStatus } from "@/types";
import {
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Package,
  Timer,
  User,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  Route,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface OrderCardProps {
  order: Order;
  isDetailView?: boolean;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
}

export const OrderCard = ({
  order,
  isDetailView = false,
  onStatusChange,
}: OrderCardProps) => {
  const { t, direction } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    order.expectedCompletionTime || null
  );

  // Format order date
  const orderDate = new Date(order.orderDate);
  const formattedDate = orderDate.toLocaleDateString();
  const formattedTime = orderDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Get status badge styles
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> {t("pending")}
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Route className="h-3 w-3 mr-1" /> {t("shipping")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> {t("completed")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> {t("issue")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Info className="h-3 w-3 mr-1" /> {t("unknown")}
          </Badge>
        );
    }
  };

  // Handle status change
  const handleStatusChange = (status: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(order.id, status);
      toast.success(`${t("orders")} ${order.orderId} ${t("orderStatus")} ${status}`);
    }
  };

  // Timer display
  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return t("overtime");
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}${t("hours").charAt(0)} ` : ""}${mins}${t("minutes").charAt(0)}`;
  };

  return (
    <>
      <Card className={cn(
        "h-full", 
        order.status === "in_progress" && "border-blue-300",
        direction === "rtl" && "text-right"
      )}>
        <CardHeader className="pb-2">
          <div className={cn(
            "flex justify-between items-start",
            direction === "rtl" && "flex-row-reverse"
          )}>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {t("orders")} #{order.orderId}
              </div>
              <CardTitle className="text-lg">{order.customerName}</CardTitle>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-sm space-y-2">
            <div className={cn(
              "flex items-center gap-2",
              direction === "rtl" && "flex-row-reverse"
            )}>
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>{order.department}</span>
            </div>
            
            <div className={cn(
              "flex items-center gap-2",
              direction === "rtl" && "flex-row-reverse"
            )}>
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formattedDate} {t("at")} {formattedTime}
              </span>
            </div>

            {order.assignedStaff && (
              <div className={cn(
                "flex items-center gap-2",
                direction === "rtl" && "flex-row-reverse"
              )}>
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.assignedStaff.name}</span>
              </div>
            )}
            
            {(order.status === "in_progress" || order.status === "pending") && 
             order.expectedCompletionTime && (
              <div className={cn(
                "flex items-center gap-2 mt-3",
                direction === "rtl" && "flex-row-reverse"
              )}>
                <Timer className="h-4 w-4 text-muted-foreground" />
                <div className={cn(
                  "flex items-center gap-1",
                  direction === "rtl" && "flex-row-reverse"
                )}>
                  <span className="font-medium">
                    {formatTimeRemaining(order.expectedCompletionTime)}
                  </span>
                  {order.expectedCompletionTime <= 15 && (
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Info className="h-4 w-4" />
                <span>{t("details")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>{t("orders")} #{order.orderId} {t("details")}</DialogTitle>
                <DialogDescription>
                  {t("complete")} {t("information")} {t("about")} {t("this")} {t("order")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4 overflow-auto pr-4 max-h-[60vh]">
                {/* Customer and Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("customer")}</h4>
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {order.customerId}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("order")}</h4>
                    <p className="text-sm">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedTime}
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-sm font-medium mb-3">{t("items")}</h4>
                  <div className="space-y-2">
                    {order.details.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between py-2 border-b"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {t("quantity")}: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          SAR {item.price.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{t("total")}</p>
                      <p className="text-lg font-bold">
                        SAR{" "}
                        {order.details.items
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          )
                          .toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {order.details.shippingAddress && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      {t("shipping")} {t("address")}
                    </h4>
                    <p className="text-sm">{order.details.shippingAddress}</p>
                  </div>
                )}

                {/* Notes */}
                {order.details.notes && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      {t("customer")} {t("notes")}
                    </h4>
                    <p className="text-sm">{order.details.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t("close")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => setIsTrackDialogOpen(true)}
          >
            <Route className="h-4 w-4" />
            <span>{t("track")}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                {t("details")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsTrackDialogOpen(true)}>
                {t("track")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <TrackDialog
        order={order}
        open={isTrackDialogOpen}
        onOpenChange={setIsTrackDialogOpen}
        onStatusChange={onStatusChange}
      />
    </>
  );
};

export default OrderCard;
