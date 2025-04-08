
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { StaffMember, AttendanceRecord } from "@/types";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: StaffMember;
  onAttendanceSubmit: (record: AttendanceRecord) => void;
}

export function AttendanceModal({
  isOpen,
  onClose,
  staffMember,
  onAttendanceSubmit,
}: AttendanceModalProps) {
  const { t } = useLanguage();
  const [clockIn, setClockIn] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [clockOut, setClockOut] = useState<string>("");
  const [status, setStatus] = useState<"present" | "late" | "absent">("present");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Handle form submission
  const handleSubmit = () => {
    // Validate inputs
    if (!clockIn || !date) {
      toast.error(t("pleaseEnterRequiredFields"));
      return;
    }

    // Calculate if late based on shift start
    const isLate = clockIn > staffMember.shiftStart && staffMember.role === "employee";
    
    // Create new attendance record
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      userId: staffMember.id,
      date,
      clockIn,
      clockOut: clockOut || undefined,
      status: isLate ? "late" : status,
      notes: notes || undefined,
    };
    
    onAttendanceSubmit(newRecord);
    
    // Reset form and close modal
    setClockIn(new Date().toTimeString().slice(0, 5));
    setClockOut("");
    setStatus("present");
    setNotes("");
    setDate(new Date().toISOString().slice(0, 10));
    
    onClose();
    toast.success(t("attendanceRecordAdded"));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("recordAttendance")}</DialogTitle>
          <DialogDescription>
            {t("recordAttendanceFor")} {staffMember.name}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="date">{t("date")}</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="clockIn">{t("clockIn")}</Label>
              <Input
                id="clockIn"
                type="time"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clockOut">{t("clockOut")}</Label>
              <Input
                id="clockOut"
                type="time"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                placeholder={t("optional")}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="status">{t("status")}</Label>
            <select
              id="status"
              className="w-full h-10 px-3 border rounded-md"
              value={status}
              onChange={(e) => setStatus(e.target.value as "present" | "late" | "absent")}
            >
              <option value="present">{t("present")}</option>
              <option value="late">{t("late")}</option>
              <option value="absent">{t("absent")}</option>
            </select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("optional")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AttendanceModal;
