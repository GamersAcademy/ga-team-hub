
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mockStaffMembers } from "@/data/mockData";

export const AttendanceModal = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isClockIn, setIsClockIn] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get staff details if current user is a team member
  const staffDetails = currentUser && 
    mockStaffMembers.find(staff => staff.id === currentUser.id);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Check if it's time to show the modal
  useEffect(() => {
    if (!currentUser || currentUser.role !== "team" || !staffDetails) return;
    
    const checkAttendanceTime = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Parse shift start and end times
      const [startHour, startMinute] = staffDetails.shiftStart.split(":").map(Number);
      const [endHour, endMinute] = staffDetails.shiftEnd.split(":").map(Number);
      
      // Check if it's within 15 minutes of shift start
      if (
        (currentHours === startHour && currentMinutes >= startMinute && currentMinutes <= startMinute + 15) ||
        (currentHours === startHour + 1 && startMinute > 45 && currentMinutes <= (startMinute + 15) % 60)
      ) {
        setIsClockIn(true);
        setIsOpen(true);
      }
      
      // Check if it's within 15 minutes of shift end
      else if (
        (currentHours === endHour && currentMinutes >= endMinute - 15 && currentMinutes <= endMinute) ||
        (currentHours === endHour - 1 && endMinute < 15 && currentMinutes >= 60 - (15 - endMinute))
      ) {
        setIsClockIn(false);
        setIsOpen(true);
      }
    };
    
    // Check once immediately
    checkAttendanceTime();
    
    // Then check every minute
    const intervalId = setInterval(checkAttendanceTime, 60000);
    
    return () => clearInterval(intervalId);
  }, [currentUser, staffDetails]);

  const handleAttendance = () => {
    const timeString = currentTime.toLocaleTimeString();
    
    if (isClockIn) {
      toast.success(`Clocked in at ${timeString}`, {
        description: "Your shift has started. Have a productive day!",
      });
    } else {
      toast.success(`Clocked out at ${timeString}`, {
        description: "Your shift has ended. See you tomorrow!",
      });
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-teal-500" />
            {isClockIn ? "Start Your Shift" : "End Your Shift"}
          </DialogTitle>
          <DialogDescription>
            {isClockIn 
              ? "Please confirm that you're present and ready to start your shift."
              : "Please confirm that you're ending your shift for today."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentTime.toLocaleDateString()}
            </div>
          </div>
          
          {staffDetails && (
            <div className="bg-muted p-3 rounded-md mb-6">
              <p className="text-sm font-medium">Shift Information:</p>
              <div className="text-sm mt-1">
                <p>Start: {staffDetails.shiftStart}</p>
                <p>End: {staffDetails.shiftEnd}</p>
              </div>
            </div>
          )}
          
          <Button 
            onClick={handleAttendance} 
            className="w-full gap-2" 
            variant={isClockIn ? "default" : "outline"}
          >
            <CheckCircle className="h-4 w-4" />
            {isClockIn ? "I'm Present" : "End My Shift"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
