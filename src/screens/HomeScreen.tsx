import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';
import { TestRecord } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    language,
    setActiveTab,
    setCurrentTest,
    testHistory,
    isBleConnected,
    batteryLevel,
    farmerName,
    farmLocation
  } = useApp();

  const t = TRANSLATIONS[language];

  const handleOpenTest = (record: TestRecord) => {
    setCurrentTest(record);
    setActiveTab('result');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Farmer Greeting Banner */}
      <View style={styles.farmerCard}>
        <View style={styles.farmerAvatar}>
          <Text style={styles.farmerAvatarIcon}>👨‍🌾</Text>
        </View>
        <View style={styles.farmerInfo}>
          <Text style={styles.farmerName}>{farmerName}</Text>
          <Text style={styles.farmerLocation}>📍 {farmLocation}</Text>
        </View>
        <View style={styles.offlinePill}>
          <Text style={styles.offlinePillText}>📶 100% Offline Edge</Text>
        </View>
      </View>

      {/* Main Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopBadge}>
          <Text style={styles.heroBadgeText}>⚡ REPLACES ₹1,500 WET LAB DELAYS</Text>
        </View>
        <Text style={styles.heroTitle}>{t.startQuickTest}</Text>
        <Text style={styles.heroSubtitle}>{t.startTestSubtitle}</Text>

        <TouchableOpacity
          style={styles.heroMainButton}
          onPress={() => setActiveTab('scan')}
          activeOpacity={0.85}
        >
          <Text style={styles.heroBtnIcon}>🧪</Text>
          <Text style={styles.heroBtnText}>{t.newTest}</Text>
          <Text style={styles.heroBtnArrow}>➔</Text>
        </TouchableOpacity>

        {/* Latency Footnote */}
        <View style={styles.heroSpecsRow}>
          <View style={styles.specBadge}>
            <Text style={styles.specLabel}>TinyML (ESP32):</Text>
            <Text style={styles.specVal}> &lt;12ms</Text>
          </View>
          <View style={styles.specBadge}>
            <Text style={styles.specLabel}>MobileNetV3:</Text>
            <Text style={styles.specVal}> &lt;380ms</Text>
          </View>
          <View style={styles.specBadge}>
            <Text style={styles.specLabel}>Cost:</Text>
            <Text style={styles.specVal}> ₹0 / Scan</Text>
          </View>
        </View>
      </View>

      {/* Hardware Status Strip */}
      <View style={styles.probeHardwareCard}>
        <View style={styles.probeLeft}>
          <View style={[styles.probeIndicator, isBleConnected ? styles.probeActive : styles.probeInactive]} />
          <View>
            <Text style={styles.probeTitle}>ESP32-S3 Handheld Spear Probe</Text>
            <Text style={styles.probeMeta}>
              {isBleConnected
                ? `BLE 5.0 Paired • Battery ${batteryLevel}% • 3-Sensor Array (pH, Mst, Temp)`
                : 'Probe Simulator Active • Ready for Virtual Testing'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.probeActionBtn}
          onPress={() => setActiveTab('scan')}
        >
          <Text style={styles.probeActionText}>Configure</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Action Grid */}
      <View style={styles.gridContainer}>
        {/* Silage Bale QR */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => setActiveTab('qr')}
          activeOpacity={0.8}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
            <Text style={styles.gridIcon}>📦</Text>
          </View>
          <Text style={styles.gridCardTitle}>{t.scanSilageBale}</Text>
          <Text style={styles.gridCardSub}>Ed25519 cryptographic authenticity check</Text>
        </TouchableOpacity>

        {/* Cooperative Hub */}
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => setActiveTab('coop')}
          activeOpacity={0.8}
        >
          <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(234, 179, 8, 0.15)' }]}>
            <Text style={styles.gridIcon}>🏢</Text>
          </View>
          <Text style={styles.gridCardTitle}>{t.dashboard}</Text>
          <Text style={styles.gridCardSub}>BMC truck-gate verification & district alerts</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Tests Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.recentTests}</Text>
        <TouchableOpacity onPress={() => setActiveTab('history')}>
          <Text style={styles.sectionLink}>View All ({testHistory.length})</Text>
        </TouchableOpacity>
      </View>

      {testHistory.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>{t.noRecentTests}</Text>
        </View>
      ) : (
        <View style={styles.testList}>
          {testHistory.slice(0, 3).map((record) => {
            const isDanger = record.fusion.safetyStatus === 'DANGER';
            const isCaution = record.fusion.safetyStatus === 'CAUTION';
            const statusColor = isDanger ? '#EF4444' : isCaution ? '#F59E0B' : '#22C55E';

            return (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.testCard,
                  { borderLeftColor: statusColor, borderLeftWidth: 4 }
                ]}
                onPress={() => handleOpenTest(record)}
                activeOpacity={0.85}
              >
                <View style={styles.testCardTop}>
                  <View>
                    <Text style={styles.testSampleName}>{record.sampleName}</Text>
                    <Text style={styles.testTimestamp}>🕒 {record.timestamp}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: isDanger ? '#7F1D1D' : isCaution ? '#78350F' : '#14532D' }]}>
                    <Text style={[styles.scoreVal, { color: statusColor }]}>
                      {record.fusion.mssiScore}
                    </Text>
                    <Text style={styles.scoreMax}>/100</Text>
                  </View>
                </View>

                {/* Metrics Row */}
                <View style={styles.testMetricsRow}>
                  <View style={styles.testMetricCol}>
                    <Text style={styles.testMetricLabel}>pH</Text>
                    <Text style={styles.testMetricVal}>{record.probe.pH.toFixed(1)}</Text>
                  </View>
                  <View style={styles.testMetricCol}>
                    <Text style={styles.testMetricLabel}>Moisture</Text>
                    <Text style={styles.testMetricVal}>{record.probe.moisture.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.testMetricCol}>
                    <Text style={styles.testMetricLabel}>Mold</Text>
                    <Text style={[styles.testMetricVal, isDanger && { color: '#EF4444' }]}>
                      {record.vision.moldPercentage.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.testMetricCol}>
                    <Text style={styles.testMetricLabel}>Status</Text>
                    <Text style={[styles.testStatusPill, { color: statusColor }]}>
                      {isDanger ? 'UNSAFE' : isCaution ? 'CAUTION' : 'SAFE'}
                    </Text>
                  </View>
                </View>

                {/* Short Advisory Preview */}
                <View style={styles.advisoryPreview}>
                  <Text style={styles.advisoryPreviewText} numberOfLines={1}>
                    📢 {record.advisories[language]?.shortWarning || record.advisories.en.shortWarning}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
  farmerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  farmerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  farmerAvatarIcon: {
    fontSize: 22
  },
  farmerInfo: {
    flex: 1
  },
  farmerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  farmerLocation: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  },
  offlinePill: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  offlinePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4ADE80'
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12
  },
  heroTopBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.5
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 6,
    lineHeight: 28
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 18,
    lineHeight: 18
  },
  heroMainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10
  },
  heroBtnIcon: {
    fontSize: 20,
    marginRight: 8
  },
  heroBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  heroBtnArrow: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 8
  },
  heroSpecsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1F2937',
    flexWrap: 'wrap',
    gap: 6
  },
  specBadge: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  specLabel: {
    fontSize: 11,
    color: '#6B7280'
  },
  specVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399'
  },
  probeHardwareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  probeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10
  },
  probeIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  probeActive: {
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowRadius: 6,
    shadowOpacity: 0.8
  },
  probeInactive: {
    backgroundColor: '#F59E0B'
  },
  probeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  probeMeta: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  probeActionBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155'
  },
  probeActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0'
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  gridIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  gridIcon: {
    fontSize: 18
  },
  gridCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4
  },
  gridCardSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 14
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8'
  },
  emptyCard: {
    backgroundColor: '#131D31',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8'
  },
  testList: {
    gap: 10
  },
  testCard: {
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  testCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  testSampleName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  testTimestamp: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  scoreVal: {
    fontSize: 16,
    fontWeight: '800'
  },
  scoreMax: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 2
  },
  testMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8
  },
  testMetricCol: {
    alignItems: 'center'
  },
  testMetricLabel: {
    fontSize: 10,
    color: '#64748B'
  },
  testMetricVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
    marginTop: 1
  },
  testStatusPill: {
    fontSize: 11,
    fontWeight: '800',
    marginTop: 1
  },
  advisoryPreview: {
    paddingTop: 4
  },
  advisoryPreviewText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontStyle: 'italic'
  }
});
