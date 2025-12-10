export type EnergyLevel = 'good' | 'normal' | 'tired';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break';

export interface PomodoroSettings {
  workDuration: number; // 분 단위
  breakDuration: number; // 분 단위
}

export interface PomodoroSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  energyLevel?: EnergyLevel;
  taskName?: string;
  completed: boolean;
}

export interface EnergyData {
  hour: number;
  day: number; // 0-6 (일요일-토요일)
  energyLevel: EnergyLevel;
  timestamp: Date;
}

export interface InsightData {
  goldenHours: Array<{ hour: number; count: number }>;
  heatmapData: EnergyData[];
  totalRecords: number;
  daysRecorded: number;
}
