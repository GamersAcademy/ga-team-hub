import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";
type Translations = Record<string, Record<Language, string>>;

// Translations dictionary
const translations: Translations = {
  // General
  "app.name": {
    en: "OrderFlow Team Hub",
    ar: "منصة إدارة الطلبات"
  },
  "login": {
    en: "Login",
    ar: "تسجيل الدخول"
  },
  "logout": {
    en: "Logout",
    ar: "تسجيل الخروج"
  },
  "email": {
    en: "Email",
    ar: "البريد الإلكتروني"
  },
  "password": {
    en: "Password",
    ar: "كلمة المرور"
  },
  "forgotPassword": {
    en: "Forgot password?",
    ar: "نسيت كلمة المرور؟"
  },
  "signIn": {
    en: "Sign In",
    ar: "تسجيل الدخول"
  },
  "signingIn": {
    en: "Signing in...",
    ar: "جاري تسجيل الدخول..."
  },
  "demoAccounts": {
    en: "Demo Accounts",
    ar: "حسابات تجريبية"
  },
  "clickToFill": {
    en: "Click to automatically fill login credentials",
    ar: "انقر لملء بيانات تسجيل الدخول تلقائيًا"
  },
  
  // User roles
  "admin": {
    en: "Admin",
    ar: "مدير"
  },
  "employee": {
    en: "Employee",
    ar: "موظف"
  },
  "developer": {
    en: "Developer",
    ar: "مطور"
  },
  
  // Dashboard
  "dashboard": {
    en: "Dashboard",
    ar: "لوحة التحكم"
  },
  "orders": {
    en: "Orders",
    ar: "الطلبات"
  },
  "tasks": {
    en: "Tasks",
    ar: "المهام"
  },
  "team": {
    en: "Team",
    ar: "الفريق"
  },
  "knowledge": {
    en: "Knowledge Base",
    ar: "قاعدة المعرفة"
  },
  "performance": {
    en: "Performance",
    ar: "الأداء"
  },
  
  // Orders & Tasks
  "ordersDashboard": {
    en: "Orders Dashboard",
    ar: "لوحة الطلبات"
  },
  "manageOrders": {
    en: "Manage and track all incoming orders",
    ar: "إدارة ومتابعة جميع الطلبات الواردة"
  },
  "myTasks": {
    en: "My Tasks",
    ar: "مهامي"
  },
  "viewManageTasks": {
    en: "View and manage your assigned orders",
    ar: "عرض وإدارة الطلبات المسندة إليك"
  },
  "pendingOrders": {
    en: "Pending Orders",
    ar: "الطلبات المعلقة"
  },
  "inProgress": {
    en: "In Progress",
    ar: "قيد التنفيذ"
  },
  "completed": {
    en: "Completed",
    ar: "مكتملة"
  },
  "lastUpdated": {
    en: "Last updated",
    ar: "آخر تحديث"
  },
  "refresh": {
    en: "Refresh",
    ar: "تحديث"
  },
  "refreshing": {
    en: "Refreshing...",
    ar: "جاري التحديث..."
  },
  "searchOrders": {
    en: "Search orders by ID or customer...",
    ar: "البحث عن الطلبات بواسطة الرقم أو العميل..."
  },
  "all": {
    en: "All",
    ar: "الكل"
  },
  "pending": {
    en: "Pending",
    ar: "معلق"
  },
  "noOrdersFound": {
    en: "No orders found",
    ar: "لم يتم العثور على طلبات"
  },
  "adjustSearch": {
    en: "Try adjusting your search or filter criteria",
    ar: "حاول تعديل معايير البحث أو التصفية"
  },
  "ordersWillAppear": {
    en: "Orders will appear here once they are received",
    ar: "ستظهر الطلبات هنا بمجرد استلامها"
  },
  "details": {
    en: "Details",
    ar: "التفاصيل"
  },
  "track": {
    en: "Track",
    ar: "متابعة"
  },
  
  // Order statuses
  "shipping": {
    en: "Shipping in Progress",
    ar: "جاري الشحن"
  },
  "almostDone": {
    en: "Almost Done",
    ar: "على وشك الانتهاء"
  },
  "delivered": {
    en: "Delivered",
    ar: "تم الطلب"
  },
  "issue": {
    en: "Issue with Order",
    ar: "مشكلة في الطلب"
  },
  "awaitingReview": {
    en: "Awaiting Review",
    ar: "بانتظار المراجعة"
  },
  "pendingConfirmation": {
    en: "Pending Confirmation",
    ar: "قيد التأكيد"
  },
  "unknown": {
    en: "Unknown",
    ar: "غير معروف"
  },
  
  // Team Management
  "teamManagement": {
    en: "Team Management",
    ar: "إدارة الفريق"
  },
  "manageStaff": {
    en: "Manage staff, track performance, and view attendance",
    ar: "إدارة الموظفين وتتبع الأداء وعرض الحضور"
  },
  "addStaff": {
    en: "Add Staff",
    ar: "إضافة موظف"
  },
  "totalStaff": {
    en: "Total Staff",
    ar: "إجمالي الموظفين"
  },
  "avgCompletionTime": {
    en: "Avg. Completion Time",
    ar: "متوسط وقت الإنجاز"
  },
  "lateCompletions": {
    en: "Late Completions",
    ar: "الإنجازات المتأخرة"
  },
  "staffManagement": {
    en: "Staff Management",
    ar: "إدارة الموظفين"
  },
  "attendanceRecords": {
    en: "Attendance Records",
    ar: "سجلات الحضور"
  },
  "searchStaff": {
    en: "Search staff by name or section...",
    ar: "البحث عن الموظفين بالاسم أو القسم..."
  },
  "sections": {
    en: "Sections",
    ar: "الأقسام"
  },
  "canva": {
    en: "Canva",
    ar: "كانفا"
  },
  "youtube": {
    en: "YouTube",
    ar: "يوتيوب"
  },
  "discord": {
    en: "Discord",
    ar: "ديسكورد"
  },
  "linkedin": {
    en: "LinkedIn",
    ar: "لينكدإن"
  },
  "fortnite": {
    en: "Fortnite",
    ar: "فورتنايت"
  },
  "performanceReport": {
    en: "Performance Report",
    ar: "تقرير الأداء"
  },
  "delays": {
    en: "Delays",
    ar: "التأخيرات"
  },
  
  // Track order
  "orderProgress": {
    en: "Order Progress",
    ar: "تقدم الطلب"
  },
  "uploadImages": {
    en: "Upload Images",
    ar: "تحميل الصور"
  },
  "notes": {
    en: "Notes",
    ar: "ملاحظات"
  },
  "addNote": {
    en: "Add Note",
    ar: "إضافة ملاحظة"
  },
  "saveNote": {
    en: "Save Note",
    ar: "حفظ الملاحظة"
  },
  "orderStatus": {
    en: "Order Status",
    ar: "حالة الطلب"
  },
  "trackingStatus": {
    en: "Tracking Status",
    ar: "حالة التتبع"
  },
  "estimatedCompletion": {
    en: "Estimated Completion Time",
    ar: "الوقت المقدر للإنجاز"
  },
  "hours": {
    en: "Hours",
    ar: "ساعات"
  },
  "minutes": {
    en: "Minutes",
    ar: "دقائق"
  },
  "seconds": {
    en: "Seconds",
    ar: "ثوانٍ"
  },
  "timeRemaining": {
    en: "Time Remaining",
    ar: "الوقت المتبقي"
  },
  "overtime": {
    en: "Overtime",
    ar: "وقت إضافي"
  },
  "cancel": {
    en: "Cancel",
    ar: "إلغاء"
  },
  "save": {
    en: "Save",
    ar: "حفظ"
  },
  "close": {
    en: "Close",
    ar: "إغلاق"
  },
  
  // Knowledge Base
  "addNewGuide": {
    en: "Add New Guide Page",
    ar: "إضافة صفحة دليل جديدة"
  },
  "title": {
    en: "Title",
    ar: "العنوان"
  },
  "content": {
    en: "Content",
    ar: "المحتوى"
  },
  "addLink": {
    en: "Add External Link",
    ar: "إضافة رابط خارجي"
  },
  "uploadFile": {
    en: "Upload File",
    ar: "تحميل ملف"
  },
  
  // Performance Page
  "performancePage": {
    en: "Performance Stats",
    ar: "إحصائيات الأداء"
  },
  "filterBy": {
    en: "Filter By",
    ar: "تصفية حسب"
  },
  "day": {
    en: "Day",
    ar: "يوم"
  },
  "month": {
    en: "Month",
    ar: "شهر"
  },
  "dateRange": {
    en: "Date Range",
    ar: "نطاق التاريخ"
  },
  "attendanceData": {
    en: "Attendance Data",
    ar: "بيانات الحضور"
  },
  "checkIn": {
    en: "Check In",
    ar: "تسجيل الحضور"
  },
  "checkOut": {
    en: "Check Out",
    ar: "تسجيل الانصراف"
  },
  "delay": {
    en: "Delay",
    ar: "تأخير"
  },
  "orderCompletionData": {
    en: "Order Completion Data",
    ar: "بيانات إنجاز الطلبات"
  },
  "timeAllowed": {
    en: "Time Allowed",
    ar: "الوقت المسموح به"
  },
  "timeTaken": {
    en: "Time Taken",
    ar: "الوقت المستغرق"
  },
  "submission": {
    en: "Submission",
    ar: "الإرسال"
  }
};

interface LanguageContextType {
  language: Language;
  direction: Direction;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguage] = useState<Language>("en");
  const direction: Direction = "ltr";

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ar" : "en");
  };

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    direction,
    toggleLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
