import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS, LANGUAGE_NAMES } from '../constants/translations';
import { speakVernacularAdvisory, stopSpeech } from '../utils/audioSpeech';
import { Language, TestRecord } from '../types';

export const ResultScreen: React.FC = () => {
  const {
    language,
    currentTest,
    setActiveTab,
    syncOfflineQueue,
    isSyncing
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeVoiceLang, setActiveVoiceLang] = useState<Language>(language);
  const [offlineSaved, setOfflineSaved] = useState(false);

  useEffect(() => {
    setActiveVoiceLang(language);
  }, [language]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const t = TRANSLATIONS[language];

  if (!currentTest) {
    return (
      <View style={styles.noTestContainer}>
        <Text style={styles.noTestIcon}>⚠️</Text>
        <Text style={styles.noTestTitle}>No Test Selected</Text>
        <Text style={styles.noTestSub}>Please start a 60-second test from the home tab.</Text>
        <TouchableOpacity
          style={styles.noTestBtn}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={styles.noTestBtnText}>Run Test Now ➔</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { probe, vision, fusion, advisories } = currentTest;
  const isDanger = fusion.safetyStatus === 'DANGER';
  const isCaution = fusion.safetyStatus === 'CAUTION';

  const statusColor = isDanger ? '#EF4444' : isCaution ? '#F59E0B' : '#22C55E';
  const statusBg = isDanger ? '#450A0A' : isCaution ? '#451A03' : '#052E16';
  const statusBorder = isDanger ? '#DC2626' : isCaution ? '#D97706' : '#16A34A';

  const currentAdvisory = advisories[activeVoiceLang] || advisories.en;

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      speakVernacularAdvisory(
        currentAdvisory.audioSpeechText,
        activeVoiceLang,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleSaveOffline = () => {
    setOfflineSaved(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Banner Status (Slide 4) */}
      <View style={[styles.statusBanner, { backgroundColor: statusBg, borderColor: statusBorder }]}>
        <View style={styles.statusIconRow}>
          <Text style={styles.statusIcon}>{isDanger ? '⚠️' : isCaution ? '⚡' : '✅'}</Text>
          <View style={styles.statusTitleCol}>
            <Text style={[styles.statusHeaderTitle, { color: statusColor }]}>
              {fusion.statusTitle}
            </Text>
            <Text style={styles.statusHeaderSub}>{fusion.statusSubtitle}</Text>
          </View>
        </View>
      </View>

      {/* Quality Score & Score Gauge (Slide 4) */}
      <View style={styles.scoreRowCard}>
        <View style={styles.scoreLeftCol}>
          <Text style={styles.scoreHeading}>{t.qualityScore}</Text>
          <View style={styles.scoreValueWrapper}>
            <Text style={[styles.scoreBigValue, { color: statusColor }]}>
              {fusion.mssiScore}
            </Text>
            <Text style={styles.scoreOutOf}>/ 100</Text>
          </View>
          <Text style={styles.scoreModelText}>
            Dual-Tier: TinyML (&lt;12ms) + MobileNetV3
          </Text>
        </View>

        {/* Circular Dial Visual */}
        <View style={[styles.scoreDialCircle, { borderColor: statusColor, shadowColor: statusColor }]}>
          <Text style={[styles.scoreDialGrade, { color: statusColor }]}>
            {isDanger ? 'FAIL' : isCaution ? 'GRADE B' : 'GRADE A'}
          </Text>
          <Text style={styles.scoreDialSub}>MSSI INDEX</Text>
        </View>
      </View>

      {/* Safety Overrides Alert (If triggered) */}
      {fusion.safetyOverridesTriggered.length > 0 && (
        <View style={styles.overrideAlertBox}>
          <Text style={styles.overrideAlertTitle}>🚨 SAFETY OVERRIDE LOCKOUT INVARIANTS:</Text>
          {fusion.safetyOverridesTriggered.map((reason, idx) => (
            <Text key={idx} style={styles.overrideItem}>• {reason}</Text>
          ))}
        </View>
      )}

      {/* Summary & Details Metrics Table (Matches Slide 4) */}
      <View style={styles.metricsCard}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.tableHeading}>{t.summary}</Text>
          <Text style={styles.tableHeadingSub}>{t.details}</Text>
        </View>

        {/* Silage pH */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>🧪 {t.phAcidity}</Text>
            <Text style={styles.tableParamBench}>Standard: 3.8 - 4.2 (Kung et al.)</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={[styles.tableValue, probe.pH > 4.4 && styles.textHigh]}>
              {probe.pH.toFixed(1)} {probe.pH > 4.4 ? '(High)' : '(Optimal)'}
            </Text>
          </View>
        </View>

        {/* Moisture Content */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>💧 {t.moistureContent}</Text>
            <Text style={styles.tableParamBench}>Standard: 60% - 68%</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={[styles.tableValue, probe.moisture > 68 && styles.textHigh]}>
              {probe.moisture.toFixed(0)}% {probe.moisture > 68 ? '(High)' : '(Normal)'}
            </Text>
          </View>
        </View>

        {/* Silage Temp */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>🌡️ {t.silageTemp}</Text>
            <Text style={styles.tableParamBench}>Silage core internal temp</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={[styles.tableValue, probe.temperature > 28 && styles.textHigh]}>
              {probe.temperature.toFixed(1)}°C
            </Text>
          </View>
        </View>

        {/* Mold Detected */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>🍄 {t.moldDetected}</Text>
            <Text style={styles.tableParamBench}>Visual surface mycotoxin risk</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={[styles.tableValue, vision.moldPercentage >= 15 && styles.textCritical]}>
              {vision.moldPercentage.toFixed(0)}% {vision.moldPercentage >= 15 ? '(Critical)' : '(Low)'}
            </Text>
          </View>
        </View>

        {/* Added Urea */}
        <View style={styles.tableRow}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>⚗️ {t.ureaAdulteration}</Text>
            <Text style={styles.tableParamBench}>Permissible: &lt; 0.5% added</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={[styles.tableValue, vision.ureaAdulterationEst >= 0.5 && styles.textCritical]}>
              {vision.ureaAdulterationEst.toFixed(2)}% {vision.ureaAdulterationEst >= 0.5 ? '(Poisonous)' : '(Safe)'}
            </Text>
          </View>
        </View>

        {/* Crude Protein & Dry Matter */}
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <View style={styles.tableColLabel}>
            <Text style={styles.tableParamName}>🌾 Crude Protein & Dry Matter</Text>
            <Text style={styles.tableParamBench}>ICAR Nutritional Baseline</Text>
          </View>
          <View style={styles.tableColVal}>
            <Text style={styles.tableValue}>
              CP: {fusion.crudeProteinEst}% • DM: {fusion.dryMatterEst}%
            </Text>
          </View>
        </View>
      </View>

      {/* Vernacular Voice Advisory Card (Matches Slide 4) */}
      <View style={styles.voiceAdvisoryCard}>
        <View style={styles.voiceTopRow}>
          <View style={styles.voiceTitleGroup}>
            <Text style={styles.voiceHeaderTitle}>🔊 {t.voiceAdvisory}</Text>
            <Text style={styles.voiceLangLabel}>
              Speaking in: {LANGUAGE_NAMES[activeVoiceLang].native}
            </Text>
          </View>

          {/* Play/Stop Audio Button */}
          <TouchableOpacity
            style={[styles.playAudioBtn, isPlayingAudio && styles.playingAudioBtn]}
            onPress={handleToggleVoice}
            activeOpacity={0.8}
          >
            <Text style={styles.playAudioBtnIcon}>
              {isPlayingAudio ? '⏹️' : '▶️'}
            </Text>
            <Text style={styles.playAudioBtnText}>
              {isPlayingAudio ? t.stopVoice : t.playVoice}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Language Tabs for Voice */}
        <View style={styles.voiceLangTabs}>
          {(['mr', 'hi', 'en', 'ta', 'te'] as Language[]).map((langKey) => (
            <TouchableOpacity
              key={langKey}
              style={[
                styles.voiceLangPill,
                activeVoiceLang === langKey && styles.voiceLangPillActive
              ]}
              onPress={() => {
                stopSpeech();
                setIsPlayingAudio(false);
                setActiveVoiceLang(langKey);
              }}
            >
              <Text style={[
                styles.voiceLangPillText,
                activeVoiceLang === langKey && styles.voiceLangPillTextActive
              ]}>
                {LANGUAGE_NAMES[langKey].native}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Advisory Speech Box (Exact Marathi Slide 4 quote) */}
        <View style={styles.speechQuoteBox}>
          <Text style={styles.speechQuoteText}>
            "{currentAdvisory.shortWarning}"
          </Text>
          <Text style={styles.speechDetailText}>
            {currentAdvisory.detailedAction}
          </Text>
          {currentAdvisory.supplementRecommendation && (
            <View style={styles.supplementBox}>
              <Text style={styles.supplementTitle}>💊 Recommended Intervention:</Text>
              <Text style={styles.supplementText}>{currentAdvisory.supplementRecommendation}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Farmer Actions Grid (Slide 4) */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionBtn, offlineSaved && styles.actionBtnDone]}
          onPress={handleSaveOffline}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnIcon}>💾</Text>
          <Text style={styles.actionBtnText}>
            {offlineSaved ? 'Saved Offline ✓' : t.saveOffline}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setActiveTab('qr')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnIcon}>🔏</Text>
          <Text style={styles.actionBtnText}>{t.generateQR}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.actionBtnCloud]}
          onPress={syncOfflineQueue}
          disabled={isSyncing}
          activeOpacity={0.8}
        >
          <Text style={styles.actionBtnIcon}>☁️</Text>
          <Text style={styles.actionBtnText}>
            {isSyncing ? 'Syncing...' : t.syncCloud}
          </Text>
        </TouchableOpacity>
      </View>

      {/* New Test Button */}
      <TouchableOpacity
        style={styles.newTestPrimaryBtn}
        onPress={() => setActiveTab('scan')}
        activeOpacity={0.85}
      >
        <Text style={styles.newTestBtnText}>+ {t.newTestBtn}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D'
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  noTestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  noTestIcon: {
    fontSize: 50,
    marginBottom: 16
  },
  noTestTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8
  },
  noTestSub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20
  },
  noTestBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12
  },
  noTestBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15
  },
  statusBanner: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    marginBottom: 16
  },
  statusIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  statusIcon: {
    fontSize: 32
  },
  statusTitleCol: {
    flex: 1
  },
  statusHeaderTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4
  },
  statusHeaderSub: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16
  },
  scoreRowCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  scoreLeftCol: {
    flex: 1
  },
  scoreHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4
  },
  scoreValueWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  scoreBigValue: {
    fontSize: 44,
    fontWeight: '900'
  },
  scoreOutOf: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B'
  },
  scoreModelText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4
  },
  scoreDialCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  scoreDialGrade: {
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center'
  },
  scoreDialSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2
  },
  overrideAlertBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  overrideAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#F87171',
    marginBottom: 4
  },
  overrideItem: {
    fontSize: 12,
    color: '#FECACA',
    lineHeight: 18
  },
  metricsCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    marginBottom: 6
  },
  tableHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  tableHeadingSub: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8'
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#0F172A'
  },
  tableColLabel: {
    flex: 1
  },
  tableParamName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  tableParamBench: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2
  },
  tableColVal: {
    alignItems: 'flex-end'
  },
  tableValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#E2E8F0'
  },
  textHigh: {
    color: '#F59E0B'
  },
  textCritical: {
    color: '#EF4444'
  },
  voiceAdvisoryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  voiceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  voiceTitleGroup: {
    flex: 1
  },
  voiceHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  voiceLangLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  playAudioBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6
  },
  playingAudioBtn: {
    backgroundColor: '#DC2626'
  },
  playAudioBtnIcon: {
    fontSize: 14
  },
  playAudioBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  voiceLangTabs: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
    flexWrap: 'wrap'
  },
  voiceLangPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#334155'
  },
  voiceLangPillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)'
  },
  voiceLangPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8'
  },
  voiceLangPillTextActive: {
    color: '#38BDF8'
  },
  speechQuoteBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  speechQuoteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 22,
    marginBottom: 8
  },
  speechDetailText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 10
  },
  supplementBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)'
  },
  supplementTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4ADE80',
    marginBottom: 2
  },
  supplementText: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 16
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#131D31',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  actionBtnDone: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E'
  },
  actionBtnCloud: {
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  actionBtnIcon: {
    fontSize: 15
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0'
  },
  newTestPrimaryBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  newTestBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#38BDF8'
  }
});
