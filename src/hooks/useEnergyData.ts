import { useState } from 'react';
import { EnergyLevel, EnergyData, InsightData } from '../types';

// 실제로는 AsyncStorage나 다른 저장소를 사용해야 합니다
export function useEnergyData() {
  const [energyRecords, setEnergyRecords] = useState<EnergyData[]>([]);

  const addEnergyRecord = (energyLevel: EnergyLevel) => {
    const now = new Date();
    const record: EnergyData = {
      hour: now.getHours(),
      day: now.getDay(),
      energyLevel,
      timestamp: now,
    };
    setEnergyRecords(prev => [...prev, record]);
  };

  const getInsights = (): InsightData => {
    // 시간대별 에너지 레벨 집계
    const hourCounts: Record<number, { good: number; normal: number; tired: number }> = {};

    energyRecords.forEach(record => {
      if (!hourCounts[record.hour]) {
        hourCounts[record.hour] = { good: 0, normal: 0, tired: 0 };
      }
      const counts = hourCounts[record.hour];
      if (counts) {
        counts[record.energyLevel]++;
      }
    });

    // 골든타임 계산 (좋음 기록이 많은 시간대 TOP 3)
    const goldenHours = Object.entries(hourCounts)
      .map(([hour, counts]) => ({
        hour: parseInt(hour),
        count: counts.good,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // 기록된 고유한 날짜 수 계산
    const uniqueDays = new Set(
      energyRecords.map(r => r.timestamp.toDateString())
    ).size;

    return {
      goldenHours,
      heatmapData: energyRecords,
      totalRecords: energyRecords.length,
      daysRecorded: uniqueDays,
    };
  };

  return {
    energyRecords,
    addEnergyRecord,
    getInsights,
  };
}
