import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';

export const CooperativeDashboardScreen: React.FC = () => {
  const { language } = useApp();
  const t = TRANSLATIONS[language];

  const [truckVerificationActive, setTruckVerificationActive] = useState(false);
  const [truckGateStatus, setTruckGateStatus] = useState<string | null>(null);

  const simulateTruckGateScan = (isApproved: boolean) => {
    setTruckVerificationActive(true);
    setTruckGateStatus('Scanning bulk fodder consignment at truck-gate (<60s)...');

    setTimeout(() => {
      setTruckVerificationActive(false);
      if (isApproved) {
        setTruckGateStatus('✅ TRUCK-GATE APPROVED: Moisture 64.2%, pH 3.95, Urea 0.0%. Safe to unload into bulk silo.');
      } else {
        setTruckGateStatus('🚨 TRUCK-GATE REJECTED: Urea 0.82% & Mold Spores Detected! Consignment quarantined.');
      }
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Banner */}
      <View style={styles.headerCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.badgeText}>DAIRY COOPERATIVE & BMC PORTAL</Text>
        </View>
        <Text style={styles.headerTitle}>District Dairy Federation Hub</Text>
        <Text style={styles.headerSub}>
          Real-time feed quality surveillance, BMC truck-gate verification, and clostridial outbreak heatmaps.
        </Text>
      </View>

      {/* Slide 6 KPI Impact Cards */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiVal}>&lt; 60s</Text>
          <Text style={styles.kpiLabel}>Farm-Gate Diagnostics</Text>
          <Text style={styles.kpiSub}>Replaces 4-10 day lab delays</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiVal}>₹0</Text>
          <Text style={styles.kpiLabel}>Consumable Cost</Text>
          <Text style={styles.kpiSub}>Replaces ₹1,500 wet tests</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: '#4ADE80' }]}>+1.0 - 2.2 L</Text>
          <Text style={styles.kpiLabel}>Milk Yield / Cow / Day</Text>
          <Text style={styles.kpiSub}>Via optimal forage dry matter</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={[styles.kpiVal, { color: '#38BDF8' }]}>25% - 35%</Text>
          <Text style={styles.kpiLabel}>Spoilage Reduction</Text>
          <Text style={styles.kpiSub}>Early clostridial rotting alert</Text>
        </View>
      </View>

      {/* BMC Truck-Gate Verification Module (Slide 6) */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionTop}>
          <View>
            <Text style={styles.sectionTitle}>🚛 BMC Truck-Gate Consignment Scan</Text>
            <Text style={styles.sectionSub}>Sub-60s verification before dumping bulk concentrate into dairy coolers</Text>
          </View>
        </View>

        <View style={styles.truckActionsRow}>
          <TouchableOpacity
            style={styles.truckBtnPass}
            onPress={() => simulateTruckGateScan(true)}
            disabled={truckVerificationActive}
            activeOpacity={0.8}
          >
            <Text style={styles.truckBtnText}>Test Genuine Truck Lot</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.truckBtnFail}
            onPress={() => simulateTruckGateScan(false)}
            disabled={truckVerificationActive}
            activeOpacity={0.8}
          >
            <Text style={styles.truckBtnText}>Test Adulterated Lot</Text>
          </TouchableOpacity>
        </View>

        {truckGateStatus && (
          <View style={[styles.truckResultBox, truckGateStatus.includes('APPROVED') ? styles.truckResultPass : styles.truckResultFail]}>
            <Text style={styles.truckResultText}>{truckGateStatus}</Text>
          </View>
        )}
      </View>

      {/* District Spoilage & Vendor Watchlist (Slide 6) */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🗺️ District Spoilage & Feed Safety Surveillance</Text>
        <Text style={styles.sectionSub}>Veterinary field officer aggregated telemetry</Text>

        <View style={styles.districtList}>
          <View style={styles.districtRow}>
            <View>
              <Text style={styles.districtName}>Kolhapur District (Bunker Zones)</Text>
              <Text style={styles.districtMeta}>142 active probes • 98.4% safe silage</Text>
            </View>
            <View style={[styles.districtStatus, styles.districtSafe]}>
              <Text style={styles.districtStatusText}>OPTIMAL</Text>
            </View>
          </View>

          <View style={styles.districtRow}>
            <View>
              <Text style={styles.districtName}>Pune Rural (Sugar Belt Silage)</Text>
              <Text style={styles.districtMeta}>88 active probes • 12 clostridial warnings</Text>
            </View>
            <View style={[styles.districtStatus, styles.districtCaution]}>
              <Text style={styles.districtStatusText}>CAUTION</Text>
            </View>
          </View>

          <View style={styles.districtRow}>
            <View>
              <Text style={styles.districtName}>Ahmednagar (Commercial Fodder Mandi)</Text>
              <Text style={styles.districtMeta}>2 counterfeit urea spikes flagged & locked</Text>
            </View>
            <View style={[styles.districtStatus, styles.districtDanger]}>
              <Text style={styles.districtStatusText}>UREA ALERT</Text>
            </View>
          </View>
        </View>
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
  headerCard: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937'
  },
  badgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 4
  },
  headerSub: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 16
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#131D31',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  kpiVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F1F5F9',
    marginBottom: 2
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 2
  },
  kpiSub: {
    fontSize: 10,
    color: '#64748B'
  },
  sectionCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  sectionTop: {
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2
  },
  sectionSub: {
    fontSize: 11,
    color: '#94A3B8'
  },
  truckActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  truckBtnPass: {
    flex: 1,
    backgroundColor: '#16A34A',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center'
  },
  truckBtnFail: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center'
  },
  truckBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  truckResultBox: {
    borderRadius: 10,
    padding: 12,
    borderWidth: 1
  },
  truckResultPass: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    borderColor: '#22C55E'
  },
  truckResultFail: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#EF4444'
  },
  truckResultText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 16
  },
  districtList: {
    marginTop: 10,
    gap: 8
  },
  districtRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  districtName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9'
  },
  districtMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2
  },
  districtStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  districtSafe: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)'
  },
  districtCaution: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)'
  },
  districtDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)'
  },
  districtStatusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC'
  }
});
