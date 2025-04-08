
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
import { SectionManager } from "./SectionManager";
import { cn } from "@/lib/utils";

interface StaffCardProps {
  staff: StaffMember;
  onUpdate?: (updatedStaff: StaffMember) => void;
}

export const StaffCard = ({ staff, onUpdate }: StaffCardProps) => {
  const { t, direction } = useLanguage();
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

  const handleUpdateSections = (sections: string[]) => {
    setEditedStaff({ ...editedStaff, sections });
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

  // Get section badge colors
  const getSectionBadges = () => {
    if (!staff.sections || staff.sections.length === 0) {
      return <span className="text-muted-foreground">{t("notAssigned")}</span>;
    }

    return staff.sections.map(section => {
      let badgeClass = "bg-gray-100 text-gray-800";
      
      if (section.toLowerCase() === "canva") {
        badgeClass = "bg-purple-100 text-purple-800";
      } else if (section.toLowerCase() === "youtube") {
        badgeClass = "bg-red-100 text-red-800";
      } else if (section.toLowerCase() === "discord") {
        badgeClass = "bg-indigo-100 text-indigo-800";
      } else if (section.toLowerCase() === "linkedin") {
        badgeClass = "bg-blue-100 text-blue-800";
      } else if (section.toLowerCase() === "fortnite") {
        badgeClass = "bg-green-100 text-green-800";
      }
      
      return (
        <Badge 
          key={section} 
          variant="outline" 
          className={badgeClass}
        >
          {t(section.toLowerCase())}
        </Badge>
      );
    });
  };

  return (
    <Card className={cn("h-full", direction === "rtl" && "text-right")}>
      <CardHeader className="pb-2">
        <div className={cn(
          "flex items-start justify-between",
          direction === "rtl" && "flex-row-reverse"
        )}>
          <div className={cn(
            "flex items-center gap-3",
            direction === "rtl" && "flex-row-reverse"
          )}>
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
        <div className={cn(
          "flex flex-wrap gap-2 mb-2",
          direction === "rtl" && "justify-end"
        )}>
          {getSectionBadges()}
        </div>
        
        <div className={cn(
          "flex items-center gap-2 text-sm",
          direction === "rtl" && "flex-row-reverse"
        )}>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>{t("dayOff")}: {staff.daysOff.join(", ")}</span>
        </div>
        
        <div className={cn(
          "flex items-center gap-2 text-sm",
          direction === "rtl" && "flex-row-reverse"
        )}>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{staff.shiftStart} - {staff.shiftEnd}</span>
        </div>
        
        {staff.taskCompletionStats && (
          <div className="mt-4 bg-gray-50 p-3 rounded-md text-sm">
            <div className="font-medium mb-1">{t("performanceStats")}:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div>{t("tasksCompleted")}:</div>
              <div className={direction === "rtl" ? "text-left" : "text-right"}>
                {staff.taskCompletionStats.tasksCompleted}
              </div>
              
              <div>{t("avgTime")}:</div>
              <div className={direction === "rtl" ? "text-left" : "text-right"}>
                {staff.taskCompletionStats.averageTime} {t("mins")}
              </div>
              
              <div>{t("lateCompletions")}:</div>
              <div className={direction === "rtl" ? "text-left" : "text-right"}>
                {staff.taskCompletionStats.lateCompletions}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2">
              <Edit className="h-4 w-4" />
              {t("viewEdit")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? t("editStaffMember") : t("staffDetails")}
              </DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? t("updateStaffInfo") 
                  : `${t("detailsFor")} ${staff.name}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {!isEditing ? (
                <>
                  <div className={cn(
                    "flex items-center gap-4",
                    direction === "rtl" && "flex-row-reverse"
                  )}>
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={staff.avatar} alt={staff.name} />
                      <AvatarFallback className="text-lg">
                        {staff.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={direction === "rtl" ? "text-right" : ""}>
                      <h3 className="font-medium text-lg">{staff.name}</h3>
                      <p className="text-sm text-muted-foreground">{staff.email}</p>
                      <p className="text-sm capitalize mt-1">
                        {staff.position}
                      </p>
                    </div>
                  </div>

                  <SectionManager 
                    staffMember={staff}
                    onUpdate={handleUpdateSections}
                  />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="font-medium">{t("shiftSchedule")}</div>
                      <p>{staff.shiftStart} - {staff.shiftEnd}</p>
                    </div>
                    <div>
                      <div className="font-medium">{t("dayOff")}</div>
                      <p>{staff.daysOff.join(", ")}</p>
                    </div>
                  </div>

                  <div className="bg-muted rounded-md p-3">
                    <div className="font-medium mb-2">{t("currentTasks")}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-yellow-50 rounded-md p-2 text-yellow-700">
                        <div className="font-medium">{pendingOrders}</div>
                        <div className="text-xs">{t("pending")}</div>
                      </div>
                      <div className="bg-blue-50 rounded-md p-2 text-blue-700">
                        <div className="font-medium">{inProgressOrders}</div>
                        <div className="text-xs">{t("inProgress")}</div>
                      </div>
                      <div className="bg-green-50 rounded-md p-2 text-green-700">
                        <div className="font-medium">{completedOrders}</div>
                        <div className="text-xs">{t("completed")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Allowed time section */}
                  <div className="space-y-1">
                    <div className="font-medium">{t("allowedTaskTime")}</div>
                    <div className="flex items-center">
                      {editedStaff.allowedCompletionTime ? (
                        <p>{Math.floor(editedStaff.allowedCompletionTime / 60)} {t("hours")} {editedStaff.allowedCompletionTime % 60} {t("minutes")}</p>
                      ) : (
                        <p>{t("notSet")}</p>
                      )}
                    </div>
                  </div>

                  {attendanceRecords.length > 0 && (
                    <div>
                      <div className="font-medium mb-2">{t("recentAttendance")}</div>
                      <div className="space-y-2">
                        {attendanceRecords.slice(0, 3).map(record => (
                          <div key={record.id} className="flex justify-between text-sm border-b pb-1 last:border-0">
                            <div>{new Date(record.date).toLocaleDateString()}</div>
                            <div className="flex gap-2">
                              <span>{t("in")}: {record.clockIn}</span>
                              <span>{t("out")}: {record.clockOut || "N/A"}</span>
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
                      <Label htmlFor="name">{t("name")}</Label>
                      <Input
                        id="name"
                        value={editedStaff.name}
                        onChange={(e) =>
                          setEditedStaff({ ...editedStaff, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">{t("email")}</Label>
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

                  <SectionManager 
                    staffMember={editedStaff}
                    onUpdate={handleUpdateSections}
                  />

                  <div className="space-y-1">
                    <Label htmlFor="position">{t("position")}</Label>
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

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="shiftStart">{t("shiftStart")}</Label>
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
                      <Label htmlFor="shiftEnd">{t("shiftEnd")}</Label>
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
                    <Label htmlFor="dayOff">{t("dayOff")}</Label>
                    <Select
                      value={editedStaff.daysOff[0]}
                      onValueChange={(value) =>
                        setEditedStaff({ ...editedStaff, daysOff: [value] })
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

                  {/* Allowed completion time */}
                  <div className="space-y-1">
                    <Label htmlFor="allowedTime">{t("allowedTaskTime")}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="timeHours">{t("hours")}</Label>
                        <Input
                          id="timeHours"
                          type="number"
                          min="0"
                          value={editedStaff.allowedCompletionTime ? Math.floor(editedStaff.allowedCompletionTime / 60) : 0}
                          onChange={(e) => {
                            const hours = parseInt(e.target.value) || 0;
                            const minutes = editedStaff.allowedCompletionTime ? editedStaff.allowedCompletionTime % 60 : 0;
                            setEditedStaff({
                              ...editedStaff,
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
                          value={editedStaff.allowedCompletionTime ? editedStaff.allowedCompletionTime % 60 : 0}
                          onChange={(e) => {
                            const minutes = parseInt(e.target.value) || 0;
                            const hours = editedStaff.allowedCompletionTime ? Math.floor(editedStaff.allowedCompletionTime / 60) : 0;
                            setEditedStaff({
                              ...editedStaff,
                              allowedCompletionTime: hours * 60 + minutes
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    {t("saveChanges")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    {t("edit")}
                  </Button>
                  <Button variant="default" onClick={() => {}} className="dialog-close">
                    {t("close")}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
