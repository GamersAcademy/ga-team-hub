
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { StaffCard } from "@/components/dashboard/StaffCard";
import PerformanceReport from "@/components/dashboard/PerformanceReport";
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
import { StaffMember, AttendanceRecord, DelayReport } from "@/types";
import { DataTable } from "@/components/ui/DataTable";
import {
  AlertCircle,
  Calendar,
  ChartBarIcon,
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
import { SectionManager } from "@/components/dashboard/SectionManager";
import { cn } from "@/lib/utils";

const TeamManagement = () => {
  const { t, direction } = useLanguage();
  const [staff, setStaff] = useState<StaffMember[]>(mockStaffMembers.map(s => ({
    ...s, 
    sections: s.department ? [s.department] : [],
    role: s.role === "team" ? "employee" : s.role // Convert to new role name
  })));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [showPerformanceReport, setShowPerformanceReport] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
    name: "",
    email: "",
    role: "employee",
    sections: ["canva"],
    position: "Team Member",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    daysOff: ["Friday"],
    allowedCompletionTime: 60, // 1 hour default
  });

  // Create mock performance data
  const mockPerformanceData: DelayReport[] = staff.flatMap(s => {
    return Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, i) => ({
      orderId: `ORD-${s.id}-${i}`,
      userId: s.id,
      userName: s.name,
      orderDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      completionDate: new Date().toISOString(),
      allowedTime: 60,
      actualTime: 60 + Math.floor(Math.random() * 120),
      delayTime: Math.floor(Math.random() * 120),
      status: "completed" as OrderStatus
    }));
  });

  // Filtered staff based on search
  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.sections.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
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
      toast.error(t("fillRequiredFields"));
      return;
    }

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name || "",
      email: newStaff.email || "",
      role: newStaff.role as "employee" | "admin",
      sections: newStaff.sections || ["canva"],
      position: newStaff.position || "Team Member",
      shiftStart: newStaff.shiftStart || "09:00",
      shiftEnd: newStaff.shiftEnd || "17:00",
      daysOff: newStaff.daysOff || ["Friday"],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      allowedCompletionTime: newStaff.allowedCompletionTime || 60,
      taskCompletionStats: {
        averageTime: 0,
        tasksCompleted: 0,
        lateCompletions: 0,
        totalDelayMinutes: 0,
        delaysByDay: {}
      },
    };

    setStaff([...staff, newMember]);
    setIsAddingStaff(false);
    setNewStaff({
      name: "",
      email: "",
      role: "employee",
      sections: ["canva"],
      position: "Team Member",
      shiftStart: "09:00",
      shiftEnd: "17:00",
      daysOff: ["Friday"],
      allowedCompletionTime: 60,
    });
    toast.success(`${t("added")} ${newMember.name} ${t("toTeam")}`);
  };

  // Attendance table columns
  const attendanceColumns = [
    {
      key: "date",
      label: t("date"),
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "userId",
      label: t("employee"),
      render: (_: string, row: AttendanceRecord) => {
        const member = staff.find((s) => s.id === row.userId);
        return member ? member.name : t("unknown");
      },
    },
    {
      key: "clockIn",
      label: t("clockIn"),
    },
    {
      key: "clockOut",
      label: t("clockOut"),
      render: (value: string) => value || t("notClockedOut"),
    },
    {
      key: "status",
      label: t("status"),
      render: (value: string) => {
        switch (value) {
          case "present":
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t("present")}</Badge>;
          case "late":
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{t("late")}</Badge>;
          case "absent":
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t("absent")}</Badge>;
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
  }, 0) / (totalStaff || 1);
  const totalLateCompletions = staff.reduce((acc, member) => {
    return member.taskCompletionStats ? acc + member.taskCompletionStats.lateCompletions : acc;
  }, 0);

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className={cn(
          "flex flex-col md:flex-row md:items-center md:justify-between gap-4",
          direction === "rtl" && "md:flex-row-reverse text-right"
        )}>
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("teamManagement")}</h1>
            <p className="text-muted-foreground">
              {t("manageStaff")}
            </p>
          </div>
          
          <div className={cn(
            "flex gap-2",
            direction === "rtl" && "flex-row-reverse"
          )}>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowPerformanceReport(!showPerformanceReport)}
            >
              <ChartBarIcon className="h-4 w-4" />
              {t("performanceReport")}
            </Button>
            
            <Dialog open={isAddingStaff} onOpenChange={setIsAddingStaff}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  <span>{t("addStaff")}</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("addNewStaff")}</DialogTitle>
                  <DialogDescription>
                    {t("createNewStaff")}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">{t("name")}*</Label>
                      <Input
                        id="name"
                        value={newStaff.name || ""}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, name: e.target.value })
                        }
                        placeholder="John Doe"
                        required
                        className={direction === "rtl" ? "text-right" : ""}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">{t("email")}*</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newStaff.email || ""}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, email: e.target.value })
                        }
                        placeholder="john@example.com"
                        required
                        className={direction === "rtl" ? "text-right" : ""}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="role">{t("role")}</Label>
                      <Select
                        value={newStaff.role || "employee"}
                        onValueChange={(value) =>
                          setNewStaff({ ...newStaff, role: value as "employee" | "admin" })
                        }
                      >
                        <SelectTrigger id="role">
                          <SelectValue placeholder={t("selectRole")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employee">{t("employee")}</SelectItem>
                          <SelectItem value="admin">{t("admin")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="position">{t("position")}</Label>
                      <Input
                        id="position"
                        value={newStaff.position || ""}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, position: e.target.value })
                        }
                        placeholder={t("employee")}
                        className={direction === "rtl" ? "text-right" : ""}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>{t("sections")}</Label>
                    {newStaff.sections && (
                      <SectionManager 
                        staffMember={newStaff as StaffMember} 
                        onUpdate={(sections) => setNewStaff({...newStaff, sections})} 
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="shiftStart">{t("shiftStart")}</Label>
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
                      <Label htmlFor="shiftEnd">{t("shiftEnd")}</Label>
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
                    <Label htmlFor="dayOff">{t("dayOff")}</Label>
                    <Select
                      value={newStaff.daysOff ? newStaff.daysOff[0] : "Friday"}
                      onValueChange={(value) =>
                        setNewStaff({ ...newStaff, daysOff: [value] })
                      }
                    >
                      <SelectTrigger id="dayOff">
                        <SelectValue placeholder={t("selectDayOff")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sunday">{t("sunday")}</SelectItem>
                        <SelectItem value="Monday">{t("monday")}</SelectItem>
                        <SelectItem value="Tuesday">{t("tuesday")}</SelectItem>
                        <SelectItem value="Wednesday">{t("wednesday")}</SelectItem>
                        <SelectItem value="Thursday">{t("thursday")}</SelectItem>
                        <SelectItem value="Friday">{t("friday")}</SelectItem>
                        <SelectItem value="Saturday">{t("saturday")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Allowed task completion time */}
                  <div className="space-y-1">
                    <Label>{t("allowedTaskTime")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="timeHours">{t("hours")}</Label>
                        <Input
                          id="timeHours"
                          type="number"
                          min="0"
                          value={newStaff.allowedCompletionTime ? Math.floor(newStaff.allowedCompletionTime / 60) : 1}
                          onChange={(e) => {
                            const hours = parseInt(e.target.value) || 0;
                            const minutes = newStaff.allowedCompletionTime ? newStaff.allowedCompletionTime % 60 : 0;
                            setNewStaff({
                              ...newStaff,
                              allowedCompletionTime: hours * 60 + minutes
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="timeMinutes">{t("minutes")}</Label>
                        <Input
                          id="timeMinutes"
                          type="number"
                          min="0"
                          max="59"
                          value={newStaff.allowedCompletionTime ? newStaff.allowedCompletionTime % 60 : 0}
                          onChange={(e) => {
                            const minutes = parseInt(e.target.value) || 0;
                            const hours = newStaff.allowedCompletionTime ? Math.floor(newStaff.allowedCompletionTime / 60) : 1;
                            setNewStaff({
                              ...newStaff,
                              allowedCompletionTime: hours * 60 + minutes
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingStaff(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleAddStaff}>{t("addStaffMember")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">{t("totalStaff")}</p>
              <p className="text-2xl font-bold text-blue-900">{totalStaff}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium">{t("avgCompletionTime")}</p>
              <p className="text-2xl font-bold text-green-900">{averageCompletionTime.toFixed(0)} {t("mins")}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-green-700" />
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-amber-800 font-medium">{t("lateCompletions")}</p>
              <p className="text-2xl font-bold text-amber-900">{totalLateCompletions}</p>
            </div>
            <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>

        {/* Performance report */}
        {showPerformanceReport && (
          <PerformanceReport staff={staff} report={mockPerformanceData} />
        )}

        <Tabs defaultValue="staff">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="staff" className="flex-1">{t("staffManagement")}</TabsTrigger>
            <TabsTrigger value="attendance" className="flex-1">{t("attendanceRecords")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-4">
            <div className="relative">
              <Search className={`absolute ${direction === "rtl" ? "right-2.5" : "left-2.5"} top-2.5 h-4 w-4 text-muted-foreground`} />
              <Input
                placeholder={t("searchStaff")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={direction === "rtl" ? "pr-8 text-right" : "pl-8"}
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
                <h3 className="text-lg font-medium">{t("noStaffFound")}</h3>
                <p className="text-muted-foreground text-center max-w-md mt-1">
                  {searchQuery ? t("adjustSearch") : t("addStaffToStart")}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="attendance">
            <div className="space-y-4">
              <div className={cn(
                "flex flex-col sm:flex-row justify-between gap-4",
                direction === "rtl" && "sm:flex-row-reverse"
              )}>
                <div className={cn(
                  "flex gap-2",
                  direction === "rtl" && "flex-row-reverse"
                )}>
                  <Button variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{t("selectDate")}</span>
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>{t("filter")}</span>
                  </Button>
                </div>
                
                <div className={cn(
                  "flex gap-2",
                  direction === "rtl" && "flex-row-reverse"
                )}>
                  <Button variant="outline" className="gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    <span>{t("refresh")}</span>
                  </Button>
                  
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    <span>{t("export")}</span>
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
                  { label: t("present"), value: "present" },
                  { label: t("late"), value: "late" },
                  { label: t("absent"), value: "absent" },
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

// Import ChartBarIcon from lucide
import { BarChart as ChartBarIcon } from "lucide-react";
