
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StaffCard } from "@/components/dashboard/StaffCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockUsers } from "@/data/mockData";
import { StaffMember } from "@/types";
import { Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

// Available departments
const departments = ["YouTube", "Discord", "LinkedIn", "Fortnite"];

const TeamManagement = () => {
  const { t } = useLanguage();
  const [staff, setStaff] = useState<StaffMember[]>(mockUsers as StaffMember[]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState(departments);
  const [newDepartment, setNewDepartment] = useState("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  
  // New staff member form state
  const [newStaffMember, setNewStaffMember] = useState<Partial<StaffMember>>({
    id: `staff-${Date.now()}`,
    name: "",
    email: "",
    role: "team",
    department: [],
    position: "",
    avatar: "",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    daysOff: ["Friday"],
  });

  // Helper function to safely handle department string for searching
  const getDepartmentString = (department: string | string[]): string => {
    if (Array.isArray(department)) {
      return department.join(" ");
    }
    return department;
  };

  // Filtered staff based on search
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getDepartmentString(member.department).toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field: keyof StaffMember, value: any) => {
    setNewStaffMember({
      ...newStaffMember,
      [field]: value,
    });
  };

  const handleAddStaff = () => {
    if (!newStaffMember.name || !newStaffMember.email || selectedDepartments.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const staffWithDept = {
      ...newStaffMember,
      department: selectedDepartments,
      daysOff: newStaffMember.daysOff || ["Friday"],
      taskCompletionStats: {
        averageTime: 0,
        tasksCompleted: 0,
        lateCompletions: 0,
      },
    } as StaffMember;
    
    setStaff([...staff, staffWithDept]);
    setNewStaffMember({
      id: `staff-${Date.now()}`,
      name: "",
      email: "",
      role: "team",
      department: [],
      position: "",
      avatar: "",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      daysOff: ["Friday"],
    });
    setSelectedDepartments([]);
    setIsAddModalOpen(false);
    
    toast.success("Staff member added successfully");
  };

  const handleDepartmentSelection = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  const handleAddDepartment = () => {
    if (!newDepartment || availableDepartments.includes(newDepartment)) {
      toast.error("Please enter a unique department name");
      return;
    }

    setAvailableDepartments([...availableDepartments, newDepartment]);
    setNewDepartment("");
    setIsAddDeptModalOpen(false);
    
    toast.success("Department added successfully");
  };

  const handleRemoveDepartment = (dept: string) => {
    // Check if any staff members are currently in this department
    const staffInDept = staff.some(member => {
      if (Array.isArray(member.department)) {
        return member.department.includes(dept);
      }
      return member.department === dept;
    });

    if (staffInDept) {
      toast.error("Cannot remove department that has assigned staff");
      return;
    }

    setAvailableDepartments(availableDepartments.filter(d => d !== dept));
    toast.success("Department removed successfully");
  };

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Team Management</h1>
            <p className="text-muted-foreground">
              Manage staff members and departments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Dialog open={isAddDeptModalOpen} onOpenChange={setIsAddDeptModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Manage Departments
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage Departments</DialogTitle>
                  <DialogDescription>
                    Add or remove departments from the system.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="new-department">New Department</Label>
                      <Input
                        id="new-department"
                        placeholder="Enter department name"
                        value={newDepartment}
                        onChange={(e) => setNewDepartment(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddDepartment} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>

                  <div>
                    <Label>Existing Departments</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availableDepartments.map((dept) => (
                        <div key={dept} className="flex justify-between items-center p-2 border rounded">
                          <span>{dept}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 w-8 p-0"
                            onClick={() => handleRemoveDepartment(dept)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDeptModalOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Staff Member</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new team member
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newStaffMember.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newStaffMember.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Enter position title"
                      value={newStaffMember.position}
                      onChange={(e) => handleInputChange("position", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Departments</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {availableDepartments.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`dept-${dept}`} 
                            checked={selectedDepartments.includes(dept)}
                            onCheckedChange={() => handleDepartmentSelection(dept)}
                          />
                          <Label htmlFor={`dept-${dept}`} className="cursor-pointer">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shift-start">Shift Start</Label>
                      <Input
                        id="shift-start"
                        type="time"
                        value={newStaffMember.shiftStart}
                        onChange={(e) => handleInputChange("shiftStart", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shift-end">Shift End</Label>
                      <Input
                        id="shift-end"
                        type="time"
                        value={newStaffMember.shiftEnd}
                        onChange={(e) => handleInputChange("shiftEnd", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      defaultValue={newStaffMember.role}
                      onValueChange={(value) => handleInputChange("role", value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="team">Team Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStaff}>
                    Add Staff
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search field */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Staff members grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((member) => (
            <StaffCard key={member.id} staff={member} />
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border rounded-lg">
            <p className="text-lg font-medium">No staff members found</p>
            <p className="text-muted-foreground text-center">
              Try adjusting your search or add new staff members
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamManagement;
