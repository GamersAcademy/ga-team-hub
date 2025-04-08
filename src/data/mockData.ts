
import { 
  User, 
  Order, 
  StaffMember, 
  KnowledgeItem, 
  AttendanceRecord,
  ApiIntegration 
} from "../types";

// Mock users
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Ahmed Ali",
    email: "ahmed@orderflow.com",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed"
  },
  {
    id: "2",
    name: "Sara Mohammed",
    email: "sara@orderflow.com",
    role: "admin",
    sections: ["Electronics"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara"
  },
  {
    id: "3",
    name: "Mohammed Hassan",
    email: "mohammed@orderflow.com",
    role: "employee",
    sections: ["Clothing"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed"
  },
  {
    id: "4",
    name: "Fatima Abdullah",
    email: "fatima@orderflow.com",
    role: "employee",
    sections: ["Electronics"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
  },
  {
    id: "5",
    name: "Omar Khalid",
    email: "omar@orderflow.com",
    role: "developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar"
  }
];

// Mock staff members with extended details
export const mockStaffMembers: StaffMember[] = [
  {
    id: "2",
    name: "Sara Mohammed",
    email: "sara@orderflow.com",
    role: "admin",
    sections: ["Electronics"],
    position: "Department Manager",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    daysOff: ["Friday"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    taskCompletionStats: {
      averageTime: 45,
      tasksCompleted: 120,
      lateCompletions: 5,
      totalDelayMinutes: 240,
      delaysByDay: {
        "2024-04-01": 60,
        "2024-04-02": 90,
        "2024-04-03": 90
      }
    }
  },
  {
    id: "3",
    name: "Mohammed Hassan",
    email: "mohammed@orderflow.com",
    role: "employee",
    sections: ["Clothing"],
    position: "Senior Team Member",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    daysOff: ["Saturday"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    taskCompletionStats: {
      averageTime: 38,
      tasksCompleted: 150,
      lateCompletions: 12,
      totalDelayMinutes: 320,
      delaysByDay: {
        "2024-04-01": 80,
        "2024-04-02": 120,
        "2024-04-03": 120
      }
    }
  },
  {
    id: "4",
    name: "Fatima Abdullah",
    email: "fatima@orderflow.com",
    role: "employee",
    sections: ["Electronics"],
    position: "Team Member",
    shiftStart: "10:00",
    shiftEnd: "18:00",
    daysOff: ["Thursday"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    taskCompletionStats: {
      averageTime: 42,
      tasksCompleted: 95,
      lateCompletions: 8,
      totalDelayMinutes: 180,
      delaysByDay: {
        "2024-04-01": 45,
        "2024-04-02": 75,
        "2024-04-03": 60
      }
    }
  },
  {
    id: "6",
    name: "Khalid Saeed",
    email: "khalid@orderflow.com",
    role: "employee",
    sections: ["Home Goods"],
    position: "Team Member",
    shiftStart: "08:00",
    shiftEnd: "16:00",
    daysOff: ["Sunday"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Khalid",
    taskCompletionStats: {
      averageTime: 50,
      tasksCompleted: 85,
      lateCompletions: 10,
      totalDelayMinutes: 240,
      delaysByDay: {
        "2024-04-01": 90,
        "2024-04-02": 60,
        "2024-04-03": 90
      }
    }
  }
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: "ord1",
    orderId: "ORD-2023-001",
    customerId: "CUST-001",
    customerName: "Layla Mahmoud",
    department: "Electronics",
    orderDate: "2023-04-07T10:30:00",
    status: "pending",
    assignedStaff: mockUsers[3],
    details: {
      items: [
        { id: "item1", name: "Smartphone", quantity: 1, price: 3999 },
        { id: "item2", name: "Screen Protector", quantity: 2, price: 99 }
      ],
      shippingAddress: "123 Riyadh St, Riyadh",
      notes: "Please gift wrap"
    },
    expectedCompletionTime: 30
  },
  {
    id: "ord2",
    orderId: "ORD-2023-002",
    customerId: "CUST-002",
    customerName: "Youssef Ibrahim",
    department: "Clothing",
    orderDate: "2023-04-07T11:15:00",
    status: "in_progress",
    assignedStaff: mockUsers[2],
    details: {
      items: [
        { id: "item3", name: "T-shirt", quantity: 3, price: 150 },
        { id: "item4", name: "Jeans", quantity: 1, price: 250 }
      ],
      shippingAddress: "456 Jeddah Rd, Jeddah"
    },
    timeline: {
      assigned: "2023-04-07T11:20:00",
      started: "2023-04-07T11:30:00"
    },
    expectedCompletionTime: 45
  },
  {
    id: "ord3",
    orderId: "ORD-2023-003",
    customerId: "CUST-003",
    customerName: "Aisha Hamad",
    department: "Electronics",
    orderDate: "2023-04-07T09:45:00",
    status: "completed",
    assignedStaff: mockUsers[3],
    details: {
      items: [
        { id: "item5", name: "Laptop", quantity: 1, price: 5999 },
        { id: "item6", name: "Laptop Bag", quantity: 1, price: 350 }
      ],
      shippingAddress: "789 Dammam Blvd, Dammam"
    },
    timeline: {
      assigned: "2023-04-07T09:50:00",
      started: "2023-04-07T10:00:00",
      completed: "2023-04-07T10:40:00"
    },
    expectedCompletionTime: 60
  },
  {
    id: "ord4",
    orderId: "ORD-2023-004",
    customerId: "CUST-004",
    customerName: "Tariq Nasser",
    department: "Home Goods",
    orderDate: "2023-04-07T12:30:00",
    status: "pending",
    details: {
      items: [
        { id: "item7", name: "Coffee Table", quantity: 1, price: 1200 },
        { id: "item8", name: "Floor Lamp", quantity: 2, price: 450 }
      ],
      shippingAddress: "101 Madinah Ave, Madinah",
      notes: "Call before delivery"
    },
    expectedCompletionTime: 90
  },
  {
    id: "ord5",
    orderId: "ORD-2023-005",
    customerId: "CUST-005",
    customerName: "Noor Abdullah",
    department: "Electronics",
    orderDate: "2023-04-07T13:15:00",
    status: "cancelled",
    assignedStaff: mockUsers[3],
    details: {
      items: [
        { id: "item9", name: "Bluetooth Speaker", quantity: 1, price: 599 }
      ],
      shippingAddress: "202 Tabuk St, Tabuk"
    },
    timeline: {
      assigned: "2023-04-07T13:20:00"
    },
    expectedCompletionTime: 30
  }
];

// Mock knowledge base items
export const mockKnowledgeItems: KnowledgeItem[] = [
  {
    id: "kb1",
    title: "Order Processing Guide",
    content: "This comprehensive guide covers the standard procedure for processing incoming orders...",
    type: "guide",
    category: "Procedures",
    createdBy: "Ahmed Ali",
    createdAt: "2023-03-15T10:00:00",
    attachments: [
      {
        id: "att1",
        name: "Processing Diagram",
        type: "image",
        url: "/placeholder.svg"
      },
      {
        id: "att2",
        name: "Training Video",
        type: "video",
        url: "/placeholder.svg"
      }
    ]
  },
  {
    id: "kb2",
    title: "Electronics Department Reference",
    content: "Reference guide for all electronics products including warranty information...",
    type: "instruction",
    department: "Electronics",
    category: "Products",
    createdBy: "Sara Mohammed",
    createdAt: "2023-03-20T14:30:00",
    updatedAt: "2023-04-01T09:15:00"
  },
  {
    id: "kb3",
    title: "Clothing Department Sizing Guide",
    content: "Comprehensive sizing information for all clothing brands in our inventory...",
    type: "instruction",
    department: "Clothing",
    category: "Products",
    createdBy: "Mohammed Hassan",
    createdAt: "2023-03-25T11:45:00"
  },
  {
    id: "kb4",
    title: "Customer Service Policy",
    content: "Guidelines for handling customer inquiries, complaints, and returns...",
    type: "policy",
    category: "Customer Service",
    createdBy: "Ahmed Ali",
    createdAt: "2023-03-10T08:20:00",
    updatedAt: "2023-03-30T16:00:00"
  },
  {
    id: "kb5",
    title: "Frequently Asked Questions",
    content: "Answers to common questions from customers regarding orders and shipping...",
    type: "faq",
    category: "Customer Service",
    createdBy: "Sara Mohammed",
    createdAt: "2023-03-18T13:10:00"
  }
];

// Mock attendance records
export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "att1",
    userId: "3",
    date: "2023-04-07",
    clockIn: "09:02:34",
    clockOut: "17:05:22",
    status: "present"
  },
  {
    id: "att2",
    userId: "4",
    date: "2023-04-07",
    clockIn: "10:15:45",
    clockOut: "18:00:12",
    status: "late",
    notes: "Traffic delay"
  },
  {
    id: "att3",
    userId: "2",
    date: "2023-04-07",
    clockIn: "07:55:30",
    clockOut: "16:10:05",
    status: "present"
  },
  {
    id: "att4",
    userId: "3",
    date: "2023-04-06",
    clockIn: "09:00:12",
    clockOut: "17:02:45",
    status: "present"
  },
  {
    id: "att5",
    userId: "4",
    date: "2023-04-06",
    clockIn: "10:05:39",
    clockOut: "18:00:00",
    status: "present"
  }
];

// Mock API integrations
export const mockApiIntegrations: ApiIntegration[] = [
  {
    id: "api1",
    name: "Salla Platform",
    endpoint: "https://api.salla.dev/admin/v2/orders",
    authType: "oauth",
    status: "active",
    lastSynced: "2023-04-07T14:30:00"
  },
  {
    id: "api2",
    name: "Shipping Provider",
    endpoint: "https://api.shipping-provider.com/v1",
    authType: "api_key",
    status: "active",
    lastSynced: "2023-04-07T13:15:00"
  },
  {
    id: "api3",
    name: "Inventory System",
    endpoint: "https://inventory.example.com/api",
    authType: "basic",
    status: "inactive"
  }
];

// Current logged in user (for demo purposes)
// This would normally come from authentication
export const getCurrentUser = (): User | null => {
  // For demo purposes, return a mock user
  // In a real app, this would check the authenticated user
  return mockUsers[0]; // Default to admin
};

// Helper function to get all orders for a specific staff member
export const getStaffOrders = (userId: string): Order[] => {
  return mockOrders.filter(order => order.assignedStaff?.id === userId);
};

// Helper function to get all attendance records for a staff member
export const getStaffAttendance = (userId: string): AttendanceRecord[] => {
  return mockAttendanceRecords.filter(record => record.userId === userId);
};
