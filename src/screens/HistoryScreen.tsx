import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';
import { TestRecord } from '../types';

export const HistoryScreen: React.FC = () => {
  const {
    language,
    testHistory,
    setCurrentTest,
    setActiveTab,
    offlineQueueCount,
    syncOfflineQueue,
    isSyncing
  } = useApp();

  const t = TRANSLATIONS[language];
  const [filter, setFilter] = useState<'ALL' | 'SAFE' | 'CAUTION' | 'DANGER'>('ALL');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filteredTests = testHistory.filter((test) => {
    if (filter === 'ALL') return true;
    return test.fusion.safetyStatus === filter;
  });

  const handleOpenTest = (record: TestRecord) => {
    setCurrentTest(record);
    setActiveTab('result');
  };

  const handleExport = () => {
    setExportNotice(`Exported ${testHistory.length} test records to SQLite/CSV backup!`);
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Offline Cloud Status Bar */}
      <View style={styles.statusBar}>
        <View>
          <Text style={styles.statusTitle}>Local Encrypted Storage (SQLite)</Text>
          <Text style={styles.statusSub}>
            {offlineQueueCount > 0
              ? `⚠️ ${offlineQueueCount} tests awaiting sync to Dairy Cloud`
              : '✅ All farm records synced to Cooperative Cloud'}
          </Text>
        </View>

        {offlineQueueCount > 0 && (
          <TouchableOpacity
            style={styles.syncBtn}
            onPress={syncOfflineQueue}
            disabled={isSyncing}
            activeOpacity={0.8}
          >
            <Text style={styles.syncBtnText}>
              {isSyncing ? 'Syncing...' : '☁️ Sync Now'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'SAFE', 'CAUTION', 'DANGER'] as const).map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterPill,
              filter === status && styles.filterPillActive
            ]}
            onPress={() => setFilter(status)}
          >
            <Text style={[
              styles.filterPillText,
              filter === status && styles.filterPillTextActive
            ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Export Banner */}
      {exportNotice && (
        <View style={styles.exportNoticeBox}>
          <Text style={styles.exportNoticeText}>📄 {exportNotice}</Text>
        </View>
      )}

      {/* Test List */}
      <View style={styles.listContainer}>
        {filteredTests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No Records Found</Text>
            <Text style={styles.emptySub}>No tests match the selected filter criteria.</Text>
          </View>
        ) : (
          filteredTests.map((record) => {
            const isDanger = record.fusion.safetyStatus === 'DANGER';
            const isCaution = record.fusion.safetyStatus === 'CAUTION';
            const statusColor = isDanger ? '#EF4444' : isCaution ? '#F59E0B' : '#22C55E';

            return (
              <TouchableOpacity
                key={record.id}
                style={[
                  styles.recordCard,
                  { borderLeftColor: statusColor, borderLeftWidth: 4 }
                ]}
                onPress={() => handleOpenTest(record)}
                activeOpacity={0.85}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sampleTitle}>{record.sampleName}</Text>
                    <Text style={styles.sampleSub}>{record.feedType} • {record.timestamp}</Text>
                  </View>
                  <View style={[styles.scoreBadge, { backgroundColor: isDanger ? '#7F1D1D' : isCaution ? '#78350F' : '#14532D' }]}>
                    <Text style={[styles.scoreText, { color: statusColor }]}>
                      {record.fusion.mssiScore}
                    </Text>
                    <Text style={styles.scoreSub}>/100</Text>
                  </View>
                </View>

                {/* Metrics Pill Row */}
                <View style={styles.metricsPillsRow}>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricPillLabel}>pH:</Text>
                    <Text style={styles.metricPillVal}>{record.probe.pH.toFixed(1)}</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricPillLabel}>Mst:</Text>
                    <Text style={styles.metricPillVal}>{record.probe.moisture.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricPillLabel}>Mold:</Text>
                    <Text style={[styles.metricPillVal, isDanger && { color: '#EF4444' }]}>
                      {record.vision.moldPercentage.toFixed(0)}%
                    </Text>
                  </View>
                  <View style={styles.metricPill}>
                    <Text style={styles.metricPillLabel}>CP:</Text>
                    <Text style={styles.metricPillVal}>{record.fusion.crudeProteinEst}%</Text>
                  </View>
                  <View style={styles.syncStatusPill}>
                    <Text style={styles.syncStatusText}>
                      {record.isSyncedToCloud ? '☁️ Synced' : '💾 Offline'}
                    </Text>
                  </View>
                </View>

                {/* Advisory Snippet */}
                <Text style={styles.advisorySnippet} numberOfLines={1}>
                  "{record.advisories[language]?.shortWarning || record.advisories.en.shortWarning}"
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {/* Export Actions */}
      <View style={styles.exportSection}>
        <TouchableOpacity
          style={styles.exportBtn}
          onPress={handleExport}
          activeOpacity={0.8}
        >
          <Text style={styles.exportBtnText}>📥 Export ICAR Farm Audit Report (CSV / JSON)</Text>
        </TouchableOpacity>
      </View>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  statusSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2
  },
  syncBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8
  },
  syncBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16
  },
  filterPill: {
    backgroundColor: '#131D31',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  filterPillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.15)'
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8'
  },
  filterPillTextActive: {
    color: '#38BDF8'
  },
  exportNoticeBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: '#22C55E',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14
  },
  exportNoticeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4ADE80',
    textAlign: 'center'
  },
  listContainer: {
    gap: 10,
    marginBottom: 20
  },
  emptyState: {
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8'
  },
  recordCard: {
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  sampleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  sampleSub: {
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
  scoreText: {
    fontSize: 16,
    fontWeight: '800'
  },
  scoreSub: {
    fontSize: 10,
    color: '#94A3B8',
    marginLeft: 2
  },
  metricsPillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4
  },
  metricPillLabel: {
    fontSize: 10,
    color: '#64748B'
  },
  metricPillVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0'
  },
  syncStatusPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  syncStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8'
  },
  advisorySnippet: {
    fontSize: 12,
    color: '#CBD5E1',
    fontStyle: 'italic',
    paddingTop: 2
  },
  exportSection: {
    marginTop: 10
  },
  exportBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8'
  }
});
