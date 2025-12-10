import React, { useState } from 'react';
import { StyleSheet, View, Modal, Pressable } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { PomodoroSettings } from '../types';

interface TimerSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  currentSettings: PomodoroSettings;
  onApply: (settings: PomodoroSettings) => void;
}

export function TimerSettingsModal({
  visible,
  onClose,
  currentSettings,
  onApply,
}: TimerSettingsModalProps) {
  const [workDuration, setWorkDuration] = useState(currentSettings.workDuration);
  const [breakDuration, setBreakDuration] = useState(currentSettings.breakDuration);

  // AI 추천 설정 (현재는 하드코딩, 실제로는 학습 데이터 기반)
  const recommendedSettings: PomodoroSettings = {
    workDuration: 25,
    breakDuration: 5,
  };

  const handleApply = () => {
    onApply({ workDuration, breakDuration });
    onClose();
  };

  const handleUseRecommended = () => {
    setWorkDuration(recommendedSettings.workDuration);
    setBreakDuration(recommendedSettings.breakDuration);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
        <Txt typography="t2" style={styles.title}>
          타이머 설정
        </Txt>

        {/* AI 추천 박스 */}
        <View style={styles.recommendBox}>
          <Txt typography="t5" style={styles.recommendTitle}>
            지금 시간대 추천
          </Txt>
          <Txt typography="t6" style={styles.recommendText}>
            작업 {recommendedSettings.workDuration}분 / 휴식 {recommendedSettings.breakDuration}분
          </Txt>
          <Pressable style={styles.recommendButton} onPress={handleUseRecommended}>
            <Txt typography="t6" style={styles.recommendButtonText}>
              이 설정 사용하기
            </Txt>
          </Pressable>
        </View>

        {/* 작업 시간 슬라이더 */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Txt typography="t5" style={styles.sliderLabel}>
              작업 시간
            </Txt>
            <Txt typography="t3" style={styles.sliderValue}>
              {workDuration}분
            </Txt>
          </View>
          <View style={styles.sliderRow}>
            {[15, 20, 25, 30].map(duration => (
              <Pressable
                key={duration}
                style={[
                  styles.sliderOption,
                  workDuration === duration && styles.sliderOptionActive,
                ]}
                onPress={() => setWorkDuration(duration)}
              >
                <Txt
                  typography="t5"
                  style={workDuration === duration ? styles.sliderOptionTextActive : styles.sliderOptionText}
                >
                  {duration}분
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 휴식 시간 슬라이더 */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Txt typography="t5" style={styles.sliderLabel}>
              휴식 시간
            </Txt>
            <Txt typography="t3" style={styles.sliderValue}>
              {breakDuration}분
            </Txt>
          </View>
          <View style={styles.sliderRow}>
            {[5, 7, 10].map(duration => (
              <Pressable
                key={duration}
                style={[
                  styles.sliderOption,
                  breakDuration === duration && styles.sliderOptionActive,
                ]}
                onPress={() => setBreakDuration(duration)}
              >
                <Txt
                  typography="t5"
                  style={breakDuration === duration ? styles.sliderOptionTextActive : styles.sliderOptionText}
                >
                  {duration}분
                </Txt>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 적용 버튼 */}
        <Pressable style={styles.applyButton} onPress={handleApply}>
          <Txt typography="t3" style={styles.applyButtonText}>
            적용하기
          </Txt>
        </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    marginBottom: 24,
    color: '#191F28',
  },
  recommendBox: {
    backgroundColor: '#F4F5F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  recommendTitle: {
    color: '#191F28',
  },
  recommendText: {
    marginTop: 4,
    marginBottom: 12,
    color: '#6B7684',
  },
  recommendButton: {
    marginTop: 8,
    backgroundColor: '#F4F5F7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  recommendButtonText: {
    color: '#3182F6',
  },
  sliderSection: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderLabel: {
    color: '#191F28',
  },
  sliderValue: {
    color: '#3182F6',
  },
  sliderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderOption: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F4F5F7',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
    justifyContent: 'center',
  },
  sliderOptionActive: {
    backgroundColor: '#E7F0FF',
    borderColor: '#3182F6',
  },
  sliderOptionText: {
    color: '#4E5968',
    fontWeight: '500',
  },
  sliderOptionTextActive: {
    color: '#3182F6',
    fontWeight: '700',
  },
  applyButton: {
    marginTop: 16,
    backgroundColor: '#3182F6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
  },
});
