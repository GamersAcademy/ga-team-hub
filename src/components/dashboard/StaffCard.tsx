
import React, { useState } from "react";
import { StaffMember } from "@/types";
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
  Clock,
  Mail,
  Phone,
  User,
  Calendar,
  MoreHorizontal,
  UserCheck,
  Settings,
  Edit,
  Trash2,
  Bell,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { format } from "date-fns";

interface StaffCardProps {
  staff: StaffMember;
  onUpdate?: (staff: StaffMember) => void;
  onDelete?: (id: string) => void;
}

export const StaffCard = ({ staff, onUpdate, onDelete }: StaffCardProps) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to safely handle displaying department
  const renderDepartment = (department: string | string[]): string => {
    if (Array.isArray(department)) {
      return department.join(", ");
    }
    return department;
  };
  
  // Create placeholder performance data
  const getRandomPerformance = () => {
    return {
      lastWeekHours: Math.round(Math.random() * 40) + 20,
      ordersCompleted: Math.round(Math.random() * 30) + 5,
      avgCompletionTime: Math.round(Math.random() * 60) + 10,
      late: Math.round(Math.random() * 5),
    };
  };

  // Handle delete
  const handleDelete = () => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to remove ${staff.name}?`)) {
      if (onDelete) {
        onDelete(staff.id);
      }
      toast.success(`${staff.name} has been removed from the team`);
    }
  };

  // Ensure daysOff property is handled safely
  const renderDaysOff = () => {
    if (!staff.daysOff) return "None";
    if (Array.isArray(staff.daysOff)) {
      return staff.daysOff.join(", ");
    }
    return staff.daysOff;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              {staff.avatar ? (
                <AvatarImage src={staff.avatar} alt={staff.name} />
              ) : (
                <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-base">{staff.name}</CardTitle>
              <div className="text-sm text-muted-foreground">{staff.position}</div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>View Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPerformanceOpen(true)}>Performance</DropdownMenuItem>
              {onDelete && <DropdownMenuItem onClick={handleDelete}>Remove</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pb-1">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{renderDepartment(staff.department)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{staff.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>
            {staff.shiftStart} - {staff.shiftEnd}
          </span>
        </div>
        
        {staff.taskCompletionStats && (
          <HoverCard>
            <HoverCardTrigger>
              <div className="mt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span>
                    {Math.round(
                      ((staff.taskCompletionStats.tasksCompleted - staff.taskCompletionStats.lateCompletions) /
                        Math.max(1, staff.taskCompletionStats.tasksCompleted)) *
                        100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    ((staff.taskCompletionStats.tasksCompleted - staff.taskCompletionStats.lateCompletions) /
                      Math.max(1, staff.taskCompletionStats.tasksCompleted)) *
                    100
                  }
                  className="h-1.5"
                />
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                <p className="text-sm">Performance Metrics</p>
                <div className="text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Tasks Completed:</span>
                    <span className="font-medium">{staff.taskCompletionStats.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Completions:</span>
                    <span className="font-medium">{staff.taskCompletionStats.lateCompletions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Completion Time:</span>
                    <span className="font-medium">{staff.taskCompletionStats.averageTime} mins</span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </CardContent>
      <CardFooter className="pt-3">
        <div className="flex items-center w-full justify-between">
          <Badge variant={staff.role === "admin" ? "default" : staff.role === "manager" ? "secondary" : "outline"}>
            {staff.role}
          </Badge>
          <Button onClick={() => setIsProfileOpen(true)} variant="ghost" size="sm">
            View Profile
          </Button>
        </div>
      </CardFooter>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Staff Profile</DialogTitle>
            <DialogDescription>
              Complete information about this staff member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {staff.avatar ? (
                  <AvatarImage src={staff.avatar} alt={staff.name} />
                ) : (
                  <AvatarFallback className="text-lg">{getInitials(staff.name)}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-medium text-lg">{staff.name}</h3>
                <p className="text-sm text-muted-foreground">{staff.email}</p>
                <p className="text-sm capitalize mt-1">
                  {staff.position} • {renderDepartment(staff.department)}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Work Schedule</h4>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{staff.shiftStart} - {staff.shiftEnd}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Days Off</h4>
                  <div className="flex items-center gap-2 text-sm mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{renderDaysOff()}</span>
                  </div>
                </div>
              </div>
              
              {staff.taskCompletionStats && (
                <div>
                  <h4 className="text-sm font-medium">Performance</h4>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="bg-gray-50 p-2 rounded-md text-center">
                      <p className="text-sm">{staff.taskCompletionStats.tasksCompleted}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md text-center">
                      <p className="text-sm">{staff.taskCompletionStats.averageTime}m</p>
                      <p className="text-xs text-muted-foreground">Avg Time</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md text-center">
                      <p className="text-sm">{staff.taskCompletionStats.lateCompletions}</p>
                      <p className="text-xs text-muted-foreground">Late</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Performance Dialog */}
      <Dialog open={isPerformanceOpen} onOpenChange={setIsPerformanceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Performance Metrics</DialogTitle>
            <DialogDescription>
              Detailed performance for {staff.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* This would be populated with actual performance data */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <UserCheck className="h-4 w-4" /> Weekly Stats
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Hours Worked</p>
                    <p className="text-lg font-medium">{getRandomPerformance().lastWeekHours}h</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Orders Completed</p>
                    <p className="text-lg font-medium">{getRandomPerformance().ordersCompleted}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" /> Timing
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Avg Completion</p>
                    <p className="text-lg font-medium">{getRandomPerformance().avgCompletionTime}m</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-muted-foreground">Late Orders</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-medium">{getRandomPerformance().late}</p>
                      {getRandomPerformance().late > 3 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Last 30 Days</h4>
                <div className="h-36 bg-gray-50 mt-2 rounded-md flex items-center justify-center">
                  {/* This would be a chart in a real implementation */}
                  <p className="text-muted-foreground text-xs">[Performance Chart]</p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsPerformanceOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

