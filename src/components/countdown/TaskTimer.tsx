
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { PlayCircle, PauseCircle, Clock, AlertTriangle } from "lucide-react";

interface TaskTimerProps {
  taskId: string;
  allowedTime: number; // in minutes
  startTime?: string;
  isWithinShift: boolean;
}

const TaskTimer = ({ taskId, allowedTime, startTime, isWithinShift }: TaskTimerProps) => {
  const { t } = useLanguage();
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(allowedTime * 60);
  const [isRunning, setIsRunning] = useState<boolean>(!!startTime && isWithinShift);
  const [isOvertime, setIsOvertime] = useState<boolean>(false);
  const [overtimeSeconds, setOvertimeSeconds] = useState<number>(0);

  // Calculate total milliseconds since start
  useEffect(() => {
    if (!startTime) return;
    
    const startDate = new Date(startTime);
    const now = new Date();
    const elapsedMs = now.getTime() - startDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMs / 1000);
    
    // If already in overtime
    if (elapsedSeconds > allowedTime * 60) {
      setTimeLeftSeconds(0);
      setIsOvertime(true);
      setOvertimeSeconds(elapsedSeconds - (allowedTime * 60));
    } else {
      setTimeLeftSeconds((allowedTime * 60) - elapsedSeconds);
    }
  }, [startTime, allowedTime]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && isWithinShift) {
      interval = setInterval(() => {
        if (!isOvertime && timeLeftSeconds > 0) {
          setTimeLeftSeconds(prev => prev - 1);
          if (timeLeftSeconds === 1) {
            setIsOvertime(true);
          }
        } else if (isOvertime) {
          setOvertimeSeconds(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeftSeconds, isOvertime, isWithinShift]);

  // Effect to pause timer when outside of shift
  useEffect(() => {
    if (!isWithinShift && isRunning) {
      setIsRunning(false);
    }
  }, [isWithinShift, isRunning]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = Math.max(0, Math.min(100, (timeLeftSeconds / (allowedTime * 60)) * 100));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-medium">
            {isOvertime ? t("overtime") : t("timeRemaining")}
          </span>
        </div>
        <Button 
          variant={isRunning ? "default" : "outline"}
          size="sm"
          onClick={() => setIsRunning(!isRunning)}
          disabled={!isWithinShift}
          title={!isWithinShift ? t("outsideShiftHours") : ""}
          className="h-7 px-2"
        >
          {isRunning ? (
            <PauseCircle className="h-4 w-4" />
          ) : (
            <PlayCircle className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="border rounded-md p-3 bg-gray-50">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-muted-foreground">{formatTime(0)}</span>
          <span className="text-sm text-muted-foreground">{formatTime(allowedTime * 60)}</span>
        </div>
        <Progress value={isOvertime ? 0 : progressPercent} className="h-2" />
        
        <div className="mt-2 flex justify-between items-center">
          {isOvertime ? (
            <div className="flex items-center gap-1 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-bold">{formatTime(overtimeSeconds)}</span>
            </div>
          ) : (
            <span className="font-bold">{formatTime(timeLeftSeconds)}</span>
          )}
          
          {!isWithinShift && (
            <span className="text-xs text-muted-foreground px-2 py-1 bg-gray-100 rounded">
              {t("pausedOutOfShift")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskTimer;
