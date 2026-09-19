import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, LANGUAGE_NAMES } from '../constants/translations';
import { Language } from '../types';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    isBleConnected,
    toggleBleConnection,
    batteryLevel,
    offlineQueueCount,
    syncOfflineQueue,
    isSyncing
  } = useApp();

  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const t = TRANSLATIONS[language];

  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🌾</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>SilageGuard</Text>
              <Text style={styles.brandTitleAI}>AI</Text>
              <View style={styles.sihTag}>
                <Text style={styles.sihTagText}>SIH26111</Text>
              </View>
            </View>
            <Text style={styles.teamSubtext}>The Bro-grammers • Edge AI</Text>
          </View>
        </View>

        {/* Action Badges */}
        <View style={styles.actionBadges}>
          {/* BLE ESP32 Probe Status */}
          <TouchableOpacity
            style={[styles.statusChip, isBleConnected ? styles.bleConnected : styles.bleDisconnected]}
            onPress={toggleBleConnection}
            activeOpacity={0.8}
          >
            <View style={[styles.statusDot, isBleConnected ? styles.dotGreen : styles.dotAmber]} />
            <Text style={styles.statusChipText}>
              {isBleConnected ? `ESP32 ${batteryLevel}%` : 'Sim Probe'}
            </Text>
          </TouchableOpacity>

          {/* Offline Sync Badge */}
          {offlineQueueCount > 0 && (
            <TouchableOpacity
              style={styles.syncChip}
              onPress={syncOfflineQueue}
              disabled={isSyncing}
              activeOpacity={0.8}
            >
              <Text style={styles.syncChipText}>
                {isSyncing ? '⏳ Syncing...' : `☁️ ${offlineQueueCount} Offline`}
              </Text>
            </TouchableOpacity>
          )}

          {/* Language Switch Button */}
          <TouchableOpacity
            style={styles.langButton}
            onPress={() => setIsLangModalOpen(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.langButtonGlobe}>🌐</Text>
            <Text style={styles.langButtonText}>
              {LANGUAGE_NAMES[language].native}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Language Selector Modal */}
      <Modal
        visible={isLangModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLangModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsLangModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Language / भाषा चुनें</Text>
            <Text style={styles.modalSubtitle}>Audio advisories will play in chosen language</Text>

            <View style={styles.langList}>
              {(Object.keys(LANGUAGE_NAMES) as Language[]).map((langKey) => (
                <TouchableOpacity
                  key={langKey}
                  style={[
                    styles.langItem,
                    language === langKey && styles.langItemSelected
                  ]}
                  onPress={() => {
                    setLanguage(langKey);
                    setIsLangModalOpen(false);
                  }}
                >
                  <View>
                    <Text style={[styles.langItemNative, language === langKey && styles.textSelected]}>
                      {LANGUAGE_NAMES[langKey].native}
                    </Text>
                    <Text style={styles.langItemLabel}>{LANGUAGE_NAMES[langKey].label}</Text>
                  </View>
                  {language === langKey && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#166534',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#22C55E'
  },
  logoIcon: {
    fontSize: 20
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5
  },
  brandTitleAI: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E'
  },
  sihTag: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
    marginLeft: 4
  },
  sihTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8'
  },
  teamSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1
  },
  actionBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1
  },
  bleConnected: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: 'rgba(34, 197, 94, 0.3)'
  },
  bleDisconnected: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4
  },
  dotGreen: {
    backgroundColor: '#22C55E'
  },
  dotAmber: {
    backgroundColor: '#F59E0B'
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0'
  },
  syncChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20
  },
  syncChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8'
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
  langButtonGlobe: {
    fontSize: 13
  },
  langButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    maxWidth: 380,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 16
  },
  langList: {
    gap: 8
  },
  langItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  langItemSelected: {
    borderColor: '#22C55E',
    backgroundColor: 'rgba(34, 197, 94, 0.1)'
  },
  langItemNative: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  langItemLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  textSelected: {
    color: '#22C55E'
  },
  checkmark: {
    fontSize: 18,
    fontWeight: '800',
    color: '#22C55E'
  }
});
