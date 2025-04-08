
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StaffCard } from "@/components/dashboard/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockStaffMembers, mockAttendanceRecords } from "@/data/mockData";
import { StaffMember, AttendanceRecord } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import {
  AlertCircle,
  Calendar,
  Clock,
  Download,
  Filter,
  Plus,
  RefreshCcw,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const TeamManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffMembers);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    email: "",
    role: "team",
    department: "Electronics",
    position: "Team Member",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    daysOff: ["Friday"],
  });

  // Filtered staff based on search
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle updating staff member
  const handleUpdateStaff = (updatedStaff: StaffMember) => {
    setStaff(
      staff.map((member) =>
        member.id === updatedStaff.id ? updatedStaff : member
      )
    );
  };

  // Handle adding new staff member
  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email) {
      toast.error("Please fill out all required fields");
      return;
    }

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name || "",
      email: newStaff.email || "",
      role: newStaff.role as "team" | "manager",
      department: newStaff.department || "Electronics",
      position: newStaff.position || "Team Member",
      shiftStart: newStaff.shiftStart || "09:00",
      shiftEnd: newStaff.shiftEnd || "17:00",
      daysOff: newStaff.daysOff || ["Friday"],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      taskCompletionStats: {
        averageTime: 0,
        tasksCompleted: 0,
        lateCompletions: 0,
      },
    };

    setStaff([...staff, newMember]);
    setIsAddingStaff(false);
    setNewStaff({
      name: "",
      email: "",
      role: "team",
      department: "Electronics",
      position: "Team Member",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      daysOff: ["Friday"],
    });
    toast.success(`Added ${newMember.name} to the team`);
  };

  // Attendance table columns
  const attendanceColumns = [
    {
      key: "date",
      label: "Date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "userId",
      label: "Staff Member",
      render: (_: string, row: AttendanceRecord) => {
        const member = staff.find((s) => s.id === row.userId);
        return member ? member.name : "Unknown";
      },
    },
    {
      key: "clockIn",
      label: "Clock In",
    },
    {
      key: "clockOut",
      label: "Clock Out",
      render: (value: string) => value || "Not clocked out",
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        switch (value) {
          case "present":
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Present</Badge>;
          case "late":
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Late</Badge>;
          case "absent":
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Absent</Badge>;
          default:
            return value;
        }
      },
    },
  ];

  // Metrics for dashboard
  const totalStaff = staff.length;
  const averageCompletionTime = staff.reduce((acc, member) => {
    return member.taskCompletionStats ? acc + member.taskCompletionStats.averageTime : acc;
  }, 0) / totalStaff;
  const totalLateCompletions = staff.reduce((acc, member) => {
    return member.taskCompletionStats ? acc + member.taskCompletionStats.lateCompletions : acc;
  }, 0);

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Team Management</h1>
            <p className="text-muted-foreground">
              Manage staff, track performance, and view attendance
            </p>
          </div>
          
          <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Staff</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Create a new staff account and set their details below
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name*</Label>
                    <Input
                      id="name"
                      value={newStaff.name || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, name: e.target.value })
                      }
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email*</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStaff.email || ""}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newStaff.role || "team"}
                      onValueChange={(value) =>
                        setNewStaff({ ...newStaff, role: value as "team" | "manager" })
                      }
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="team">Team Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newStaff.department || "Electronics"}
                      onValueChange={(value) =>
                        setNewStaff({ ...newStaff, department: value })
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
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newStaff.position || ""}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, position: e.target.value })
                    }
                    placeholder="Team Member"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="shiftStart">Shift Start</Label>
                    <Input
                      id="shiftStart"
                      type="time"
                      value={newStaff.shiftStart || "09:00"}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, shiftStart: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="shiftEnd">Shift End</Label>
                    <Input
                      id="shiftEnd"
                      type="time"
                      value={newStaff.shiftEnd || "17:00"}
                      onChange={(e) =>
                        setNewStaff({ ...newStaff, shiftEnd: e.target.value })
                      }
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="dayOff">Day Off</Label>
                  <Select
                    value={newStaff.daysOff ? newStaff.daysOff[0] : "Friday"}
                    onValueChange={(value) =>
                      setNewStaff({ ...newStaff, daysOff: [value] })
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
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddStaff}>Add Staff Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">Total Staff</p>
              <p className="text-2xl font-bold text-blue-900">{totalStaff}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">Avg. Completion Time</p>
              <p className="text-2xl font-bold text-green-900">{averageCompletionTime.toFixed(0)} mins</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium">Late Completions</p>
              <p className="text-2xl font-bold text-amber-900">{totalLateCompletions}</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>

        <Tabs defaultValue="staff">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="staff" className="flex-1">Staff Management</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1">Attendance Records</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>

            {filteredStaff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStaff.map((member) => (
                  <StaffCard
                    key={member.id}
                    staff={member}
                    onUpdate={handleUpdateStaff}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No staff members found</h3>
                <p className="text-muted-foreground text-center max-w-md mt-1">
                  {searchQuery ? "Try adjusting your search criteria" : "Add staff members to get started"}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="attendance">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Select Date</span>
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    <span>Refresh</span>
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
              
              <DataTable
                columns={attendanceColumns}
                data={attendance}
                searchable={true}
                searchKeys={["userId", "date", "status"]}
                filterable={true}
                filterKey="status"
                filterOptions={[
                  { label: "Present", value: "present" },
                  { label: "Late", value: "late" },
                  { label: "Absent", value: "absent" },
                ]}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
