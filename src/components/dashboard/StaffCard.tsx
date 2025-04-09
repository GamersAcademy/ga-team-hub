
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffMember } from "@/types";
import { getStaffAttendance, getStaffOrders } from "@/data/mockData";
import { CalendarDays, Clock, Edit, User } from "lucide-react";
import { toast } from "sonner";

interface StaffCardProps {
  staff: StaffMember;
  onUpdate?: (updatedStaff: StaffMember) => void;
}

export const StaffCard = ({ staff, onUpdate }: StaffCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState<StaffMember>({ ...staff });
  
  const attendanceRecords = getStaffAttendance(staff.id);
  const staffOrders = getStaffOrders(staff.id);
  
  const completedOrders = staffOrders.filter(order => order.status === "completed").length;
  const pendingOrders = staffOrders.filter(order => order.status === "pending").length;
  const inProgressOrders = staffOrders.filter(order => order.status === "in_progress").length;

  const handleSaveChanges = () => {
    if (onUpdate) {
      onUpdate(editedStaff);
      setIsEditing(false);
      toast.success(`Updated ${staff.name}'s information`);
    }
  };

  const calculatePerformanceLevel = () => {
    const { taskCompletionStats } = staff;
    if (!taskCompletionStats) return "N/A";
    
    const { lateCompletions, tasksCompleted } = taskCompletionStats;
    const latePercentage = (lateCompletions / tasksCompleted) * 100;
    
    if (latePercentage <= 5) return "Excellent";
    if (latePercentage <= 15) return "Good";
    if (latePercentage <= 30) return "Average";
    return "Needs Improvement";
  };

  const getPerformanceBadge = () => {
    const level = calculatePerformanceLevel();
    
    switch (level) {
      case "Excellent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">{level}</Badge>;
      case "Good":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">{level}</Badge>;
      case "Average":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">{level}</Badge>;
      case "Needs Improvement":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">{level}</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  // Function to safely handle displaying department
  const renderDepartment = (department: string | string[]): string => {
    if (Array.isArray(department)) {
      return department.join(", ");
    }
    return department;
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={staff.avatar} alt={staff.name} />
              <AvatarFallback>
                {staff.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{staff.name}</CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {staff.position}
              </p>
            </div>
          </div>
          <div>
            {getPerformanceBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-1">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{renderDepartment(staff.department)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>Day off: {staff.daysOff.join(", ")}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{staff.shiftStart} - {staff.shiftEnd}</span>
        </div>
        
        {staff.taskCompletionStats && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm">
            <div className="font-medium mb-1">Performance Stats:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>Tasks Completed:</div>
              <div className="text-right">{staff.taskCompletionStats.tasksCompleted}</div>
              
              <div>Avg. Time:</div>
              <div className="text-right">{staff.taskCompletionStats.averageTime} mins</div>
              
              <div>Late Completions:</div>
              <div className="text-right">{staff.taskCompletionStats.lateCompletions}</div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              View & Edit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Staff Member" : "Staff Details"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Update staff member information" 
                  : `Details for ${staff.name}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback className="text-lg">
                        {staff.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{staff.email}</p>
                      <p className="text-sm capitalize mt-1">
                        {staff.position} • {renderDepartment(staff.department)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium">Shift Schedule</div>
                      <p>{staff.shiftStart} - {staff.shiftEnd}</p>
                    </div>
                    <div>
                      <div className="font-medium">Day Off</div>
                      <p>{staff.daysOff.join(", ")}</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-md p-3">
                    <div className="font-medium mb-2">Current Tasks</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-yellow-50 rounded-md p-2 text-yellow-700">
                        <div className="font-medium">{pendingOrders}</div>
                        <div className="text-xs">Pending</div>
                      </div>
                      <div className="bg-blue-50 rounded-md p-2 text-blue-700">
                        <div className="font-medium">{inProgressOrders}</div>
                        <div className="text-xs">In Progress</div>
                      </div>
                      <div className="bg-green-50 rounded-md p-2 text-green-700">
                        <div className="font-medium">{completedOrders}</div>
                        <div className="text-xs">Completed</div>
                      </div>
                    </div>
                  </div>

                  {attendanceRecords.length > 0 && (
                    <div>
                      <div className="font-medium mb-2">Recent Attendance</div>
                      <div className="space-y-2">
                        {attendanceRecords.slice(0, 3).map(record => (
                          <div key={record.id} className="flex justify-between text-sm border-b pb-1 last:border-0">
                            <div>{new Date(record.date).toLocaleDateString()}</div>
                            <div className="flex gap-2">
                              <span>In: {record.clockIn}</span>
                              <span>Out: {record.clockOut || "N/A"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editedStaff.name}
                        onChange={(e) =>
                          setEditedStaff({ ...editedStaff, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedStaff.email}
                        onChange={(e) =>
                          setEditedStaff({ ...editedStaff, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={editedStaff.department}
                        onValueChange={(value) =>
                          setEditedStaff({ ...editedStaff, department: value })
                        }
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Home Goods">Home Goods</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={editedStaff.position}
                        onChange={(e) =>
                          setEditedStaff({
                            ...editedStaff,
                            position: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="shiftStart">Shift Start</Label>
                      <Input
                        id="shiftStart"
                        type="time"
                        value={editedStaff.shiftStart}
                        onChange={(e) =>
                          setEditedStaff({
                            ...editedStaff,
                            shiftStart: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="shiftEnd">Shift End</Label>
                      <Input
                        id="shiftEnd"
                        type="time"
                        value={editedStaff.shiftEnd}
                        onChange={(e) =>
                          setEditedStaff({
                            ...editedStaff,
                            shiftEnd: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="dayOff">Day Off</Label>
                    <Select
                      value={editedStaff.daysOff[0]}
                      onValueChange={(value) =>
                        setEditedStaff({ ...editedStaff, daysOff: [value] })
                      }
                    >
                      <SelectTrigger id="dayOff">
                        <SelectValue placeholder="Select day off" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="default">Close</Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
