
import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Order, OrderStatus, TaskNote } from "@/types";
import {
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Loader2,
  MoreHorizontal,
  Package,
  Timer,
  Upload,
  User,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<TaskNote[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    order.expectedCompletionTime || null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> In Progress
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Info className="h-3 w-3 mr-1" /> Unknown
          </Badge>
        );
    }
  };

  // Handle status change
  const handleStatusChange = (status: OrderStatus) => {
    if (onStatusChange) {
      onStatusChange(order.id, status);
      toast.success(`Order ${order.orderId} status updated to ${status}`);
    }
  };

  // Handle adding a note
  const handleAddNote = () => {
    if (!noteText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    const newNote: TaskNote = {
      id: `note-${Date.now()}`,
      content: noteText,
      createdAt: new Date().toISOString(),
      createdBy: "Current User", // Would come from auth context in real app
      attachments: selectedFile
        ? [
            {
              id: `attachment-${Date.now()}`,
              url: URL.createObjectURL(selectedFile),
              type: selectedFile.type.startsWith("image/") ? "image" : "text",
            },
          ]
        : undefined,
    };

    setNotes([...notes, newNote]);
    setNoteText("");
    setSelectedFile(null);
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Timer display
  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Time's up!";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <>
      <Card className={cn("h-full", order.status === "in_progress" && "border-blue-300")}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Order #{order.orderId}
              </div>
              <CardTitle className="text-lg">{order.customerName}</CardTitle>
            </div>
            {getStatusBadge(order.status)}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span>{order.department}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>

            {order.assignedStaff && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.assignedStaff.name}</span>
              </div>
            )}
            
            {(order.status === "in_progress" || order.status === "pending") && 
             order.expectedCompletionTime && (
              <div className="flex items-center gap-2 mt-3">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-1">
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
                <span>Details</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Order #{order.orderId} Details</DialogTitle>
                <DialogDescription>
                  Complete information about this order
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 py-4">
                  {/* Customer and Order Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Customer</h4>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        ID: {order.customerId}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Order</h4>
                      <p className="text-sm">{formattedDate}</p>
                      <p className="text-sm text-muted-foreground">
                        {formattedTime}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Items</h4>
                    <div className="space-y-2">
                      {order.details.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 border-b"
                        >
                          <div>
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Quantity: {item.quantity}
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
                        <p className="text-sm font-medium">Total</p>
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
                        Shipping Address
                      </h4>
                      <p className="text-sm">{order.details.shippingAddress}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {order.details.notes && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        Customer Notes
                      </h4>
                      <p className="text-sm">{order.details.notes}</p>
                    </div>
                  )}

                  {/* Task Notes Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Task Notes</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAddingNote(!isAddingNote)}
                      >
                        {isAddingNote ? "Cancel" : "Add Note"}
                      </Button>
                    </div>

                    {isAddingNote && (
                      <div className="space-y-3 mb-4">
                        <Textarea
                          placeholder="Enter your note here..."
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor="file-upload"
                            className="cursor-pointer flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            {selectedFile ? selectedFile.name : "Attach File"}
                          </Label>
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/*,text/*"
                            className="hidden"
                            onChange={handleFileSelect}
                          />
                          <Button
                            onClick={handleAddNote}
                            size="sm"
                            className="ml-auto"
                          >
                            Save Note
                          </Button>
                        </div>
                      </div>
                    )}

                    {notes.length > 0 ? (
                      <div className="space-y-3">
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            className="bg-gray-50 rounded-md p-3"
                          >
                            <p className="text-sm">{note.content}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <FileText className="h-3 w-3" />
                              <span>
                                {new Date(
                                  note.createdAt
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(note.createdAt).toLocaleTimeString(
                                  [],
                                  { hour: "2-digit", minute: "2-digit" }
                                )}
                              </span>
                            </div>
                            {note.attachments && note.attachments.length > 0 && (
                              <div className="mt-2">
                                {note.attachments.map((attachment) => (
                                  <div key={attachment.id}>
                                    {attachment.type === "image" ? (
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <img
                                          src={attachment.url}
                                          alt="Attachment"
                                          className="mt-2 max-h-32 rounded-md"
                                        />
                                      </a>
                                    ) : (
                                      <a
                                        href={attachment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline"
                                      >
                                        View attachment
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No notes yet. Add a note to track progress.
                      </p>
                    )}
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="mt-4">
                {onStatusChange && order.status !== "completed" && order.status !== "cancelled" && (
                  <div className="flex gap-2">
                    {order.status === "pending" && (
                      <Button
                        onClick={() => handleStatusChange("in_progress")}
                        className="gap-2"
                      >
                        <Loader2 className="h-4 w-4" />
                        Start Task
                      </Button>
                    )}
                    {order.status === "in_progress" && (
                      <Button
                        onClick={() => handleStatusChange("completed")}
                        variant="default"
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Completed
                      </Button>
                    )}
                  </div>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStatusChange && (
                <>
                  {order.status === "pending" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                      Start Processing
                    </DropdownMenuItem>
                  )}
                  {order.status === "in_progress" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                      Mark as Completed
                    </DropdownMenuItem>
                  )}
                  {(order.status === "pending" || order.status === "in_progress") && (
                    <DropdownMenuItem onClick={() => handleStatusChange("cancelled")}>
                      Cancel Order
                    </DropdownMenuItem>
                  )}
                </>
              )}
              <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </>
  );
};
