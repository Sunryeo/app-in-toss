import React from 'react';
import { StyleSheet, View, Pressable, Modal } from 'react-native';
import { Txt } from '@toss/tds-react-native';
import { EnergyLevel } from '../types';

interface EnergyCheckModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (energyLevel: EnergyLevel) => void;
  onSkip: () => void;
}

interface EnergyCheckModalPropsExtended extends EnergyCheckModalProps {
  completedCount?: number;
}

export function EnergyCheckModal({
  visible,
  onClose,
  onSelect,
  onSkip,
}: EnergyCheckModalProps) {
  const energyOptions: Array<{ emoji: string; label: string; level: EnergyLevel }> = [
    { emoji: '😊', label: '좋음', level: 'good' },
    { emoji: '😐', label: '보통', level: 'normal' },
    { emoji: '😔', label: '피곤함', level: 'tired' },
  ];

  const handleSelect = (level: EnergyLevel) => {
    onSelect(level);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
        <View style={styles.celebrationBadge}>
          <Txt typography="t1" style={styles.celebrationEmoji}>
            🎉
          </Txt>
        </View>

        <Txt typography="t2" style={styles.title}>
          포모도로 완료!
        </Txt>

        <Txt typography="t6" style={styles.subtitle}>
          훌륭해요! 한 걸음 더 나아갔어요
        </Txt>

        <Txt typography="t5" style={styles.question}>
          지금 컨디션은 어떠세요?
        </Txt>

        <View style={styles.buttonGroup}>
          {energyOptions.map(option => (
            <Pressable
              key={option.level}
              style={styles.energyButton}
              onPress={() => handleSelect(option.level)}
            >
              <Txt style={styles.emoji}>{option.emoji}</Txt>
              <Txt typography="t5" style={styles.label}>
                {option.label}
              </Txt>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={onSkip} style={styles.skipButton}>
          <Txt typography="t6" style={styles.skipText}>
            나중에 입력하기
          </Txt>
        </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  celebrationBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E7F0FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  celebrationEmoji: {
    fontSize: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
    color: '#191F28',
    fontWeight: '700',
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#3182F6',
    fontWeight: '600',
  },
  question: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#4E5968',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  energyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    minHeight: 88,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 4,
    lineHeight: 32,
  },
  label: {
    color: '#191F28',
  },
  skipButton: {
    marginTop: 8,
    padding: 12,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    color: '#6B7684',
  },
});
