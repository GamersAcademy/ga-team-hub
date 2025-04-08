
// User types
export type UserRole = 'admin' | 'manager' | 'team' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
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
}

// Staff types
export interface StaffMember extends User {
  department: string;
  position: string;
  shiftStart: string;
  shiftEnd: string;
  daysOff: string[];
  taskCompletionStats?: {
    averageTime: number;
    tasksCompleted: number;
    lateCompletions: number;
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
