import { createRoute } from '@granite-js/react-native';
import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { CircularTimer } from '../components/CircularTimer';
import { TimerSettingsModal } from '../components/TimerSettingsModal';
import { EnergyCheckModal } from '../components/EnergyCheckModal';
import { usePomodoro } from '../hooks/usePomodoro';
import { useEnergyData } from '../hooks/useEnergyData';
import { PomodoroSettings, EnergyLevel } from '../types';

export const Route = createRoute('/', {
  component: Page,
});

function Page() {
  const navigation = Route.useNavigation();
  const [showSettings, setShowSettings] = useState(false);
  const { addEnergyRecord } = useEnergyData();

  const initialSettings: PomodoroSettings = {
    workDuration: 0.1, // 5초 (테스트용: 5/60분)
    breakDuration: 0.1, // 5초 (테스트용: 5/60분)
  };

  const {
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
  } = usePomodoro(initialSettings);

  const handleStart = () => {
    if (status === 'paused') {
      resume();
    } else {
      start();
    }
  };

  const handleEnergySelect = (energyLevel: EnergyLevel) => {
    addEnergyRecord(energyLevel);
    closeEnergyCheck();
    startBreak();
  };

  const handleEnergySkip = () => {
    closeEnergyCheck();
    startBreak();
  };

  const totalTime = status === 'break' ? settings.breakDuration * 60 : settings.workDuration * 60;

  // 총 집중 시간을 시간:분:초 형식으로 변환
  const formatTotalTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}시간`);
    if (minutes > 0 || hours > 0) parts.push(`${minutes}분`);
    parts.push(`${seconds}초`);

    return parts.join(' ');
  };

  return (
    <View style={styles.container}>
      {/* 탭 네비게이션 */}
      <View style={styles.tabBar}>
        <Pressable style={styles.activeTab} onPress={() => {}}>
          <Txt typography="t3" style={styles.activeTabText}>
            타이머
          </Txt>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => navigation.navigate('/about')}>
          <Txt typography="t3" style={styles.tabText}>
            인사이트
          </Txt>
        </Pressable>
      </View>

      {/* 오늘 완료한 포모도로 */}
      <View style={styles.header}>
        <Txt typography="t5" style={styles.headerLabel}>
          오늘 완료한 포모도로
        </Txt>
        <View style={styles.statsRow}>
          <Txt typography="t1" style={styles.pomodoroCount}>
            {completedPomodoros}
          </Txt>
          <Txt typography="t4" style={styles.cycleInfoHeader}>
            {currentCycle}/4 포모도로
          </Txt>
        </View>
      </View>

      {/* 중앙 타이머 */}
      <View style={styles.timerSection}>
        <View style={styles.timerContent}>
          {/* 상태 표시 */}
          {status !== 'idle' && (
            <View style={styles.statusBadge}>
              <Txt typography="t6" style={styles.statusText}>
                {status === 'break' ? '🌿 휴식 중' : '💪 집중 중'}
              </Txt>
            </View>
          )}

          <CircularTimer timeLeft={timeLeft} totalTime={totalTime} status={status} />
        </View>

        <View style={styles.buttonGroup}>
          {status === 'idle' && (
            <>
              <Pressable style={styles.primaryButton} onPress={handleStart}>
                <Txt typography="t3" style={styles.primaryButtonText}>
                  시작하기
                </Txt>
              </Pressable>
              <Pressable style={styles.settingsButton} onPress={() => setShowSettings(true)}>
                <Txt typography="t6" style={styles.settingsButtonText}>
                  ⚙️ 타이머 설정
                </Txt>
              </Pressable>
            </>
          )}

          {(status === 'running' || status === 'break') && (
            <View style={styles.activeButtons}>
              <Pressable style={styles.secondaryButton} onPress={pause}>
                <Txt typography="t3" style={styles.secondaryButtonText}>
                  일시정지
                </Txt>
              </Pressable>
              <Pressable style={styles.tertiaryButton} onPress={stop}>
                <Txt typography="t3" style={styles.tertiaryButtonText}>
                  중단
                </Txt>
              </Pressable>
            </View>
          )}

          {status === 'paused' && (
            <View style={styles.activeButtons}>
              <Pressable style={styles.primaryButton} onPress={handleStart}>
                <Txt typography="t3" style={styles.primaryButtonText}>
                  재개
                </Txt>
              </Pressable>
              <Pressable style={styles.tertiaryButton} onPress={stop}>
                <Txt typography="t3" style={styles.tertiaryButtonText}>
                  중단
                </Txt>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* 하단 - 총 집중 시간 */}
      <View style={styles.footer}>
        <Txt typography="t7" style={styles.footerLabel}>
          {status === 'break' ? '휴식 시간' : '집중 시간'}
        </Txt>
        <Txt typography="t5" style={styles.totalTime}>
          총 {formatTotalTime(totalFocusTime)}
        </Txt>
      </View>

      {/* 모달들 */}
      <TimerSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        currentSettings={settings}
        onApply={updateSettings}
      />

      <EnergyCheckModal
        visible={shouldShowEnergyCheck}
        onClose={closeEnergyCheck}
        onSelect={handleEnergySelect}
        onSkip={handleEnergySkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EB',
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tabText: {
    color: '#6B7684',
  },
  activeTab: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#3182F6',
  },
  activeTabText: {
    color: '#3182F6',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerLabel: {
    color: '#4E5968',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  timerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  timerContent: {
    alignItems: 'center',
    width: '100%',
  },
  statusBadge: {
    backgroundColor: '#F4F5F7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    color: '#4E5968',
    fontWeight: '600',
  },
  cycleInfoHeader: {
    color: '#6B7684',
    fontWeight: '600',
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 400,
    marginTop: 48,
  },
  primaryButton: {
    backgroundColor: '#3182F6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  settingsButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 48,
    justifyContent: 'center',
  },
  settingsButtonText: {
    color: '#4E5968',
  },
  secondaryButton: {
    backgroundColor: '#F4F5F7',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#3182F6',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E8EB',
    flex: 1,
    minHeight: 52,
    justifyContent: 'center',
  },
  tertiaryButtonText: {
    color: '#4E5968',
  },
  activeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
  footerLabel: {
    marginBottom: 4,
    color: '#8B95A1',
  },
  totalTime: {
    lineHeight: 24,
    color: '#191F28',
  },
  pomodoroCount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginTop: 8,
    lineHeight: 56,
    includeFontPadding: false,
    color: '#3182F6',
  },
});
