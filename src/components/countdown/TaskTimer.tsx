
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Clock, Timer } from "lucide-react";

interface TaskTimerProps {
  taskId: string;
  allowedTime: number; // in minutes
  startTime?: string;
  isWithinShift: boolean;
}

const TaskTimer = ({ taskId, allowedTime, startTime, isWithinShift }: TaskTimerProps) => {
  const { t } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState<number>(allowedTime * 60); // convert to seconds
  const [isOvertime, setIsOvertime] = useState(false);
  const [isPaused, setIsPaused] = useState(!isWithinShift);

  // Effect for countdown timer
  useEffect(() => {
    if (!isWithinShift) {
      setIsPaused(true);
      return;
    } else {
      setIsPaused(false);
    }

    // Start timer
    const timer = setInterval(() => {
      // Only count down if not paused
      if (!isPaused) {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          if (newTime <= 0 && !isOvertime) {
            setIsOvertime(true);
            // Play alert sound when time runs out
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/1028/1028-preview.mp3");
            audio.volume = 0.5;
            audio.play();
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWithinShift, isPaused]);

  // Format the time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const hrs = Math.floor(absSeconds / 3600);
    const mins = Math.floor((absSeconds % 3600) / 60);
    const secs = absSeconds % 60;
    
    const formattedTime = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    return seconds < 0 ? `-${formattedTime}` : formattedTime;
  };

  return (
    <div className="mt-2">
      {isPaused ? (
        <Alert variant="outline" className="bg-blue-50 border-blue-200">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle className="text-blue-600">{t("timerPaused")}</AlertTitle>
          <AlertDescription className="text-blue-600">
            {t("timerResumeShift")}
          </AlertDescription>
        </Alert>
      ) : isOvertime ? (
        <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-2 rounded-md border border-red-200">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <div className="font-medium">{t("overtime")}</div>
            <div className="text-lg font-bold">{formatTime(timeRemaining)}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-3 py-2 rounded-md border border-yellow-200">
          <Timer className="h-5 w-5" />
          <div>
            <div className="font-medium">{t("timeRemaining")}</div>
            <div className="text-lg font-bold">{formatTime(timeRemaining)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTimer;
