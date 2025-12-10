import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TimerStatus } from '../types';

interface CircularTimerProps {
  timeLeft: number; // 초 단위
  totalTime: number; // 초 단위
  status?: TimerStatus;
}

export function CircularTimer({ timeLeft, totalTime, status = 'idle' }: CircularTimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = timeLeft / totalTime;

  // 상태별 색상 설정
  const progressColor = status === 'break' ? '#10B981' : '#3182F6'; // 휴식: 초록, 작업: 파랑
  const backgroundColor = status === 'break' ? '#D1FAE5' : '#F4F5F7'; // 휴식: 연한 초록, 작업: 회색

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { backgroundColor }]}>
        <View
          style={[
            styles.progressCircle,
            {
              opacity: progress,
              backgroundColor: progressColor
            }
          ]}
        />
        <View style={styles.innerCircle}>
          <Text style={styles.timerText}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  innerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#191F28',
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
