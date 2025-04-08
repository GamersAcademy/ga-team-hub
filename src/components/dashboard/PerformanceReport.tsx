
import { useLanguage } from "@/context/LanguageContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DelayReport, StaffMember } from "@/types";
import { AlertTriangle, Clock } from "lucide-react";

interface PerformanceReportProps {
  staff: StaffMember[];
  report: DelayReport[] | null;
}

const PerformanceReport = ({ staff, report }: PerformanceReportProps) => {
  const { t } = useLanguage();

  // Early return if no report data
  if (!report || report.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("performanceReport")}</CardTitle>
          <CardDescription>{t("noDataAvailable")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <p className="text-center text-muted-foreground">
              {t("noDelayData")}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate total delay by employee
  const delayByEmployee = staff
    .map(employee => {
      const employeeOrders = report.filter(r => r.userId === employee.id);
      const totalDelay = employeeOrders.reduce((total, order) => {
        return total + (order.delayTime || 0);
      }, 0);
      const completedTasks = employeeOrders.filter(
        o => o.status === 'completed'
      ).length;

      return {
        id: employee.id,
        name: employee.name,
        totalDelay,
        completedTasks,
        averageDelay: completedTasks > 0 ? totalDelay / completedTasks : 0,
      };
    })
    .filter(e => e.completedTasks > 0)
    .sort((a, b) => b.totalDelay - a.totalDelay);

  // Prepare chart data - group by date
  const delaysByDate = report.reduce((acc: Record<string, number>, curr) => {
    if (!curr.completionDate || !curr.delayTime || curr.delayTime <= 0) return acc;

    const date = new Date(curr.completionDate).toLocaleDateString();
    if (!acc[date]) acc[date] = 0;
    acc[date] += curr.delayTime;
    return acc;
  }, {});

  const chartData = Object.entries(delaysByDate).map(([date, delay]) => ({
    date,
    delay: Math.round(delay),
  }));

  // Format minutes for display
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}${t("hours").charAt(0)} ${mins}${t("minutes").charAt(0)}`;
    }
    return `${mins}${t("minutes").charAt(0)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("performanceReport")}</CardTitle>
        <CardDescription>
          {t("delayAnalysis")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">{t("delaysByEmployee")}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("employee")}</TableHead>
                <TableHead>{t("completedTasks")}</TableHead>
                <TableHead>{t("totalDelay")}</TableHead>
                <TableHead>{t("averageDelay")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {delayByEmployee.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.completedTasks}</TableCell>
                  <TableCell className="text-red-600">
                    {formatMinutes(employee.totalDelay)}
                  </TableCell>
                  <TableCell>
                    {formatMinutes(employee.averageDelay)}
                    {employee.averageDelay > 30 && (
                      <AlertTriangle className="h-4 w-4 inline ml-1 text-amber-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {chartData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-3">{t("delaysByDay")}</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis 
                    label={{ 
                      value: t("delayInMinutes"), 
                      angle: -90, 
                      position: 'insideLeft' 
                    }} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatMinutes(value), t("delay")]}
                    labelFormatter={(label) => `${t("date")}: ${label}`} 
                  />
                  <Bar 
                    dataKey="delay" 
                    name={t("totalDelay")}
                    fill="#f87171" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceReport;
