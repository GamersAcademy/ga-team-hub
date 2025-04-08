
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Download } from "lucide-react";
import { mockStaffMembers, mockAttendanceRecords } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";

const PerformanceStats = () => {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<"day" | "month" | "range">("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  // Generate mock attendance data
  const attendanceData = mockAttendanceRecords.map(record => {
    const employee = mockStaffMembers.find(s => s.id === record.userId);
    
    // Calculate if late
    const scheduledTime = employee?.shiftStart || "09:00";
    const [scheduledHour, scheduledMinute] = scheduledTime.split(":").map(Number);
    
    const clockInTime = record.clockIn;
    const [clockInHour, clockInMinute] = clockInTime.split(":").map(Number);
    
    const isLate = 
      clockInHour > scheduledHour || 
      (clockInHour === scheduledHour && clockInMinute > scheduledMinute);
    
    let delayMinutes = 0;
    if (isLate) {
      delayMinutes = (clockInHour - scheduledHour) * 60 + (clockInMinute - scheduledMinute);
    }
    
    return {
      ...record,
      employeeName: employee?.name || "Unknown",
      scheduledStart: scheduledTime,
      isLate,
      delayMinutes
    };
  });

  // Generate mock order completion data
  const orderCompletionData = mockStaffMembers.flatMap(staff => {
    return Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => {
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 7));
      
      const allowedTime = staff.allowedCompletionTime || 60;
      const actualTime = allowedTime + Math.floor(Math.random() * 60) - 30;
      const delayTime = actualTime - allowedTime;
      
      return {
        id: `ord-${staff.id}-${i}`,
        orderId: `ORD-${new Date().getFullYear()}-${(i + 100).toString().padStart(3, '0')}`,
        employeeId: staff.id,
        employeeName: staff.name,
        orderDate: orderDate.toISOString(),
        completionDate: new Date().toISOString(),
        allowedTime,
        actualTime,
        delayTime,
        onTime: delayTime <= 0
      };
    });
  });

  // Filter data based on selected date/range
  const filterData = (data: any[], dateField: string) => {
    if (filterType === "day") {
      const day = format(selectedDate, "yyyy-MM-dd");
      return data.filter(item => {
        const itemDate = format(new Date(item[dateField]), "yyyy-MM-dd");
        return itemDate === day;
      });
    } else if (filterType === "month") {
      return data.filter(item => {
        const itemDate = format(new Date(item[dateField]), "yyyy-MM");
        return itemDate === selectedMonth;
      });
    } else if (filterType === "range" && dateRange.from) {
      return data.filter(item => {
        const itemDate = new Date(item[dateField]);
        if (dateRange.from && dateRange.to) {
          return itemDate >= dateRange.from && itemDate <= dateRange.to;
        } else if (dateRange.from) {
          return itemDate >= dateRange.from;
        }
        return true;
      });
    }
    return data;
  };

  // Filtered data
  const filteredAttendance = filterData(attendanceData, "date");
  const filteredOrderCompletion = filterData(orderCompletionData, "orderDate");

  // Attendance table columns
  const attendanceColumns = [
    {
      key: "date",
      label: t("date"),
      render: (value: string) => format(new Date(value), "yyyy-MM-dd"),
    },
    {
      key: "employeeName",
      label: t("employee"),
    },
    {
      key: "scheduledStart",
      label: t("shiftStart"),
    },
    {
      key: "clockIn",
      label: t("checkIn"),
    },
    {
      key: "clockOut",
      label: t("checkOut"),
      render: (value: string) => value || "-",
    },
    {
      key: "isLate",
      label: t("status"),
      render: (value: boolean) => {
        return value ? (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {t("late")}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t("present")}
          </Badge>
        );
      },
    },
    {
      key: "delayMinutes",
      label: t("delay"),
      render: (value: number) => value > 0 ? `${value} ${t("minutes")}` : "-",
    },
  ];

  // Order completion table columns
  const orderCompletionColumns = [
    {
      key: "orderId",
      label: t("orders"),
    },
    {
      key: "employeeName",
      label: t("employee"),
    },
    {
      key: "orderDate",
      label: t("date"),
      render: (value: string) => format(new Date(value), "yyyy-MM-dd"),
    },
    {
      key: "allowedTime",
      label: t("timeAllowed"),
      render: (value: number) => `${value} ${t("minutes")}`,
    },
    {
      key: "actualTime",
      label: t("timeTaken"),
      render: (value: number) => `${value} ${t("minutes")}`,
    },
    {
      key: "delayTime",
      label: t("delay"),
      render: (value: number) => value > 0 ? `${value} ${t("minutes")}` : "-",
    },
    {
      key: "onTime",
      label: t("status"),
      render: (value: boolean) => {
        return value ? (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {t("completed")}
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            {t("late")}
          </Badge>
        );
      },
    },
  ];

  return (
    <DashboardLayout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">{t("performancePage")}</h1>
            <p className="text-muted-foreground">
              {t("track")} {t("employee")} {t("performance")} {t("and")} {t("attendance")}
            </p>
          </div>
          
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>{t("export")}</span>
          </Button>
        </div>
        
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>{t("filterBy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>{t("filterBy")}</Label>
                <Select value={filterType} onValueChange={(value: "day" | "month" | "range") => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">{t("day")}</SelectItem>
                    <SelectItem value="month">{t("month")}</SelectItem>
                    <SelectItem value="range">{t("dateRange")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {filterType === "day" && (
                <div className="space-y-2">
                  <Label>{t("selectDate")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>{t("selectDate")}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              
              {filterType === "month" && (
                <div className="space-y-2">
                  <Label>{t("selectMonth")}</Label>
                  <Input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
              
              {filterType === "range" && (
                <div className="space-y-2">
                  <Label>{t("dateRange")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dateRange.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>{t("selectDateRange")}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Data Tabs */}
        <Tabs defaultValue="attendance">
          <TabsList className="mb-4">
            <TabsTrigger value="attendance">{t("attendanceData")}</TabsTrigger>
            <TabsTrigger value="orders">{t("orderCompletionData")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>{t("attendanceData")}</CardTitle>
                <CardDescription>
                  {t("view")} {t("employee")} {t("attendance")} {t("records")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={attendanceColumns}
                  data={filteredAttendance}
                  searchable={true}
                  searchKeys={["employeeName"]}
                  filterable={true}
                  filterKey="isLate"
                  filterOptions={[
                    { label: t("present"), value: "false" },
                    { label: t("late"), value: "true" },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{t("orderCompletionData")}</CardTitle>
                <CardDescription>
                  {t("view")} {t("tasks")} {t("completion")} {t("statistics")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={orderCompletionColumns}
                  data={filteredOrderCompletion}
                  searchable={true}
                  searchKeys={["orderId", "employeeName"]}
                  filterable={true}
                  filterKey="onTime"
                  filterOptions={[
                    { label: t("completed"), value: "true" },
                    { label: t("late"), value: "false" },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PerformanceStats;
