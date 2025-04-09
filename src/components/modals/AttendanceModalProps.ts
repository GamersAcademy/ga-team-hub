
import { User } from "@/types";

export interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffMember: User | null;
  onAttendanceSubmit: () => void;
}
