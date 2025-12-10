import { createRoute } from '@granite-js/react-native';
import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { EnergyHeatmap } from '../components/EnergyHeatmap';
import { useEnergyData } from '../hooks/useEnergyData';

export const Route = createRoute('/about', {
  component: InsightsPage,
});

function InsightsPage() {
  const { getInsights } = useEnergyData();
  const insights = getInsights();

  const daysNeeded = Math.max(0, 14 - insights.daysRecorded);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Txt typography="t1" style={styles.pageTitle}>
          패턴 인사이트
        </Txt>

        {/* 데이터 수집 진행도 */}
        {daysNeeded > 0 && (
          <View style={styles.progressBox}>
            <Txt typography="t5" style={styles.progressText}>
              💡 {daysNeeded}일 더 기록하면 더 정확한 분석이 가능해요
            </Txt>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(insights.daysRecorded / 14) * 100}%` },
                ]}
              />
            </View>
            <Txt typography="t7" style={styles.progressDays}>
              {insights.daysRecorded}/14일 기록 완료
            </Txt>
          </View>
        )}

        {/* 골든타임 섹션 */}
        <View style={styles.section}>
          <Txt typography="t3" style={styles.sectionTitle}>
            ⭐ 당신의 골든타임
          </Txt>

          {insights.goldenHours.length > 0 ? (
            <View style={styles.goldenHoursList}>
              {insights.goldenHours.map((item, index) => (
                <View key={index} style={styles.goldenHourItem}>
                  <View style={styles.rank}>
                    <Txt typography="t3" style={styles.rankNumber}>
                      {index + 1}
                    </Txt>
                  </View>
                  <View style={styles.goldenHourContent}>
                    <Txt typography="t5" style={styles.goldenHourTime}>
                      {item.hour}:00 - {item.hour + 1}:00
                    </Txt>
                    <Txt typography="t7" style={styles.goldenHourCount}>
                      에너지 좋음 {item.count}회
                    </Txt>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Txt typography="t6" style={styles.emptyStateText}>
                아직 충분한 데이터가 없어요.
                {'\n'}
                포모도로를 완료하고 컨디션을 기록해보세요!
              </Txt>
            </View>
          )}
        </View>

        {/* 히트맵 */}
        <EnergyHeatmap data={insights.heatmapData} />

        {/* 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Txt typography="t7" style={styles.statLabel}>
              총 기록 수
            </Txt>
            <Txt typography="t2" style={styles.statValue}>
              {insights.totalRecords}
            </Txt>
          </View>
          <View style={styles.statCard}>
            <Txt typography="t7" style={styles.statLabel}>
              기록한 날
            </Txt>
            <Txt typography="t2" style={styles.statValue}>
              {insights.daysRecorded}일
            </Txt>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 24,
  },
  pageTitle: {
    marginBottom: 24,
    color: '#191F28',
  },
  progressBox: {
    backgroundColor: '#F4F5F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E8EB',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3182F6',
    borderRadius: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
    color: '#191F28',
  },
  goldenHoursList: {
    gap: 12,
  },
  goldenHourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
  },
  rank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goldenHourContent: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
  },
  statsSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    alignItems: 'center',
  },
  progressText: {
    color: '#4E5968',
  },
  progressDays: {
    color: '#6B7684',
  },
  rankNumber: {
    color: '#3182F6',
  },
  goldenHourTime: {
    color: '#191F28',
  },
  goldenHourCount: {
    color: '#6B7684',
  },
  emptyStateText: {
    color: '#6B7684',
  },
  statLabel: {
    color: '#6B7684',
  },
  statValue: {
    color: '#191F28',
  },
});
