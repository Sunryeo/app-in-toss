import { useState, useEffect, useRef } from 'react';
import { PomodoroSettings, TimerStatus } from '../types';

export function usePomodoro(initialSettings: PomodoroSettings) {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(initialSettings.workDuration * 60);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0); // 총 집중 시간 (초)
  const [shouldShowEnergyCheck, setShouldShowEnergyCheck] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status]);

  const handleTimerComplete = () => {
    if (status === 'running') {
      // 작업 완료
      setCompletedPomodoros(prev => prev + 1);
      setTotalFocusTime(prev => prev + settings.workDuration * 60);
      setCurrentCycle(prev => prev + 1); // 작업 완료 시 사이클 증가
      setStatus('idle');
      setShouldShowEnergyCheck(true); // 에너지 체크 모달 표시
    } else if (status === 'break') {
      // 휴식 완료 - 다음 작업 준비
      setStatus('idle');
    }
  };

  const start = () => {
    if (status === 'idle') {
      setTimeLeft(settings.workDuration * 60);
    }
    setStatus('running');
  };

  const pause = () => {
    setStatus('paused');
  };

  const resume = () => {
    setStatus('running');
  };

  const stop = () => {
    setStatus('idle');
    setTimeLeft(settings.workDuration * 60);
  };

  const startBreak = () => {
    setStatus('break');
    setTimeLeft(settings.breakDuration * 60);
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    if (status === 'idle') {
      setTimeLeft(newSettings.workDuration * 60);
    }
  };

  const closeEnergyCheck = () => {
    setShouldShowEnergyCheck(false);
  };

  return {
    settings,
    status,
    timeLeft,
    currentCycle,
    completedPomodoros,
    totalFocusTime,
    shouldShowEnergyCheck,
    start,
    pause,
    resume,
    stop,
    startBreak,
    updateSettings,
    closeEnergyCheck,
  };
}
