import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { EnergyData, EnergyLevel } from '../types';

interface EnergyHeatmapProps {
  data: EnergyData[];
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const getEnergyColor = (level: EnergyLevel | null): string => {
  if (!level) return '#F4F5F7';
  switch (level) {
    case 'good':
      return '#4CAF50';
    case 'normal':
      return '#FFC107';
    case 'tired':
      return '#F44336';
  }
};

export function EnergyHeatmap({ data }: EnergyHeatmapProps) {
  // 시간대별, 요일별 에너지 데이터 매핑
  const heatmapGrid: (EnergyLevel | null)[][] = DAYS.map((_, dayIndex) =>
    HOURS.map(hour => {
      const record = data.find(d => d.day === dayIndex && d.hour === hour);
      return record?.energyLevel ?? null;
    })
  );

  return (
    <View style={styles.container}>
      <Txt typography="t3" color="grey900" style={styles.title}>
        시간대별 에너지 히트맵
      </Txt>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* 시간 헤더 */}
          <View style={styles.hourHeader}>
            <View style={styles.dayLabel} />
            {HOURS.map(hour => (
              <View key={hour} style={styles.hourCell}>
                <Txt typography="t7" color="grey600">
                  {hour}
                </Txt>
              </View>
            ))}
          </View>

          {/* 히트맵 그리드 */}
          {DAYS.map((day, dayIndex) => (
            <View key={dayIndex} style={styles.row}>
              <View style={styles.dayLabel}>
                <Txt typography="t6" color="grey700">
                  {day}
                </Txt>
              </View>
              {heatmapGrid[dayIndex]?.map((energyLevel, hourIndex) => (
                <View
                  key={hourIndex}
                  style={[
                    styles.cell,
                    { backgroundColor: getEnergyColor(energyLevel) },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 범례 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#4CAF50' }]} />
          <Txt typography="t7" color="grey600">
            좋음
          </Txt>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#FFC107' }]} />
          <Txt typography="t7" color="grey600">
            보통
          </Txt>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#F44336' }]} />
          <Txt typography="t7" color="grey600">
            피곤함
          </Txt>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    marginBottom: 16,
  },
  hourHeader: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  hourCell: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabel: {
    width: 32,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    width: 24,
    height: 24,
    marginHorizontal: 1,
    borderRadius: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});
