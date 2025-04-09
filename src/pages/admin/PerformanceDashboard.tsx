
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/data/mockData";
import {
  ArrowDownToLine,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useLanguage } from "@/context/LanguageContext";
import { addDays, format } from "date-fns";

const PerformanceDashboard = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"day" | "month" | "custom">("day");
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  // Mock attendance data
  const attendanceData = mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    department: user.department || "",
    checkIn: "09:00 AM",
    checkOut: "05:00 PM",
    totalHours: "8.0",
    status: Math.random() > 0.2 ? "on-time" : "late",
    lateMinutes: Math.random() > 0.2 ? 0 : Math.floor(Math.random() * 30) + 1
  }));

  // Mock order execution data
  const orderExecutionData = mockUsers.flatMap(user => 
    Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
      id: `exe-${user.id}-${i}`,
      staffId: user.id,
      staffName: user.name,
      department: user.department || "",
      orderId: `ORD-${Math.floor(Math.random() * 1000) + 1000}`,
      startTime: "10:30 AM",
      finishTime: "11:45 AM",
      allowedTime: "60 min",
      overtime: Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0
    }))
  );

  // Mock delays data
  const delaysByEmployee = mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    department: user.department || "",
    totalDelays: Math.floor(Math.random() * 120)
  }));

  const delaysByDepartment = [
    { department: "YouTube", totalDelays: 45 },
    { department: "Discord", totalDelays: 78 },
    { department: "LinkedIn", totalDelays: 32 },
    { department: "Fortnite", totalDelays: 97 }
  ];

  // Handle export to CSV
  const handleExportCSV = (tabName: string) => {
    // Implementation would depend on the actual data structure
    // For now, just show a toast
    toast.success(`Exported ${tabName} data to CSV`);
  };

  return (
    <DashboardLayout allowedRoles={["admin", "manager"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("performance.title")}</h1>
            <p className="text-muted-foreground">
              {t("performance.description")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end">
            <Button 
              onClick={() => handleExportCSV("performance")}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowDownToLine className="h-4 w-4" />
              {t("performance.export")}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("performance.filters")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Tabs 
                value={filter} 
                onValueChange={(v) => setFilter(v as any)} 
                className="w-full sm:w-auto"
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-[400px]">
                  <TabsTrigger value="day" className="flex gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{t("performance.day")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="month" className="flex gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{t("performance.month")}</span>
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{t("performance.customRange")}</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {filter === "custom" && (
                <DateRangePicker 
                  date={dateRange}
                  onDateChange={setDateRange}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Data Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">{t("performance.attendance")}</TabsTrigger>
            <TabsTrigger value="execution">{t("performance.orderExecution")}</TabsTrigger>
            <TabsTrigger value="delays">{t("performance.delays")}</TabsTrigger>
          </TabsList>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{t("performance.attendance")}</CardTitle>
                  <Button 
                    onClick={() => handleExportCSV("attendance")}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    {t("performance.export")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("performance.employee")}</TableHead>
                        <TableHead>{t("performance.department")}</TableHead>
                        <TableHead>{t("performance.checkIn")}</TableHead>
                        <TableHead>{t("performance.checkOut")}</TableHead>
                        <TableHead>{t("performance.totalHours")}</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{item.checkIn}</TableCell>
                          <TableCell>{item.checkOut}</TableCell>
                          <TableCell>{item.totalHours}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${item.status === 'on-time' ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span>
                                {item.status === 'on-time' ? 
                                  'On time' : 
                                  `Late by ${item.lateMinutes} mins`
                                }
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Execution Tab */}
          <TabsContent value="execution" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{t("performance.orderExecution")}</CardTitle>
                  <Button 
                    onClick={() => handleExportCSV("execution")}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    {t("performance.export")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("performance.employee")}</TableHead>
                        <TableHead>{t("performance.department")}</TableHead>
                        <TableHead>{t("performance.orderID")}</TableHead>
                        <TableHead>{t("performance.startTime")}</TableHead>
                        <TableHead>{t("performance.finishTime")}</TableHead>
                        <TableHead>{t("performance.allowedTime")}</TableHead>
                        <TableHead>{t("performance.overtimeMinutes")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderExecutionData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.staffName}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{item.orderId}</TableCell>
                          <TableCell>{item.startTime}</TableCell>
                          <TableCell>{item.finishTime}</TableCell>
                          <TableCell>{item.allowedTime}</TableCell>
                          <TableCell>
                            <span className={item.overtime > 0 ? 'text-red-500 font-medium' : ''}>
                              {item.overtime}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Delays Tab */}
          <TabsContent value="delays" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* By Employee */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t("performance.totalDelays")} - {t("performance.employee")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("performance.employee")}</TableHead>
                          <TableHead>{t("performance.department")}</TableHead>
                          <TableHead>{t("performance.totalDelays")} (mins)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {delaysByEmployee.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.department}</TableCell>
                            <TableCell>
                              <span className={item.totalDelays > 60 ? 'text-red-500 font-medium' : ''}>
                                {item.totalDelays}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              {/* By Department */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t("performance.totalDelays")} - {t("performance.department")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("performance.department")}</TableHead>
                          <TableHead>{t("performance.totalDelays")} (mins)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {delaysByDepartment.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.department}</TableCell>
                            <TableCell>
                              <span className={item.totalDelays > 60 ? 'text-red-500 font-medium' : ''}>
                                {item.totalDelays}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PerformanceDashboard;
