
// User types
export type UserRole = 'admin' | 'employee' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sections?: string[];
  avatar?: string;
}

// Order types
export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  department: string;
  orderDate: string;
  assignedStaff?: User;
  status: OrderStatus;
  details: {
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    shippingAddress?: string;
    notes?: string;
  };
  timeline?: {
    assigned?: string;
    started?: string;
    completed?: string;
  };
  expectedCompletionTime?: number; // in minutes
  images?: string[]; // URLs to uploaded images
  trackingNotes?: TaskNote[]; // Notes added during tracking
}

// Staff types
export interface StaffMember extends User {
  sections: string[]; // Multiple sections (replaces department)
  position: string;
  shiftStart: string;
  shiftEnd: string;
  daysOff: string[];
  allowedCompletionTime?: number; // in minutes
  taskCompletionStats?: {
    averageTime: number;
    tasksCompleted: number;
    lateCompletions: number;
    totalDelayMinutes: number; // Total minutes of delay across all tasks
    delaysByDay: Record<string, number>; // Delays grouped by day (date string -> minutes)
  };
}

// Knowledge base types
export type KnowledgeType = 'guide' | 'instruction' | 'policy' | 'faq';

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: KnowledgeType;
  department?: string;
  category: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'video' | 'document';
    url: string;
  }>;
}

// Attendance types
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}

// Task types
export interface TaskNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: string;
  attachments?: Array<{
    id: string;
    url: string;
    type: 'image' | 'text';
  }>;
}

// API Integration types
export interface ApiIntegration {
  id: string;
  name: string;
  endpoint: string;
  authType: 'api_key' | 'oauth' | 'basic';
  status: 'active' | 'inactive';
  lastSynced?: string;
}

// Custom section types
export type SectionType = 'canva' | 'youtube' | 'discord' | 'linkedin' | 'fortnite';

// Performance tracking
export interface DelayReport {
  orderId: string;
  userId: string;
  userName: string;
  orderDate: string;
  completionDate?: string;
  allowedTime: number; // in minutes
  actualTime?: number; // in minutes
  delayTime?: number; // in minutes (negative means completed early)
  status: OrderStatus;
}
