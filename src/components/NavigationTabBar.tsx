import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';

export const NavigationTabBar: React.FC = () => {
  const { activeTab, setActiveTab, language } = useApp();
  const t = TRANSLATIONS[language];

  const tabs = [
    { id: 'home', label: t.home, icon: '🏠' },
    { id: 'scan', label: t.newTest, icon: '⚡' },
    { id: 'qr', label: t.qrScan, icon: '📷' },
    { id: 'history', label: t.history, icon: '📋' },
    { id: 'coop', label: t.dashboard, icon: '🏢' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isHighlight = tab.id === 'scan';

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              isHighlight && styles.highlightTabItem
            ]}
            onPress={() => setActiveTab(tab.id)}
            activeOpacity={0.7}
          >
            {isHighlight ? (
              <View style={styles.primaryScanCircle}>
                <Text style={styles.primaryScanIcon}>{tab.icon}</Text>
              </View>
            ) : (
              <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                {tab.icon}
              </Text>
            )}
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.tabLabelActive,
                isHighlight && styles.tabLabelHighlight
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 58
  },
  highlightTabItem: {
    top: -12
  },
  primaryScanCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#4ADE80'
  },
  primaryScanIcon: {
    fontSize: 22,
    color: '#FFFFFF'
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.65,
    marginBottom: 2
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.1 }]
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8'
  },
  tabLabelActive: {
    color: '#22C55E',
    fontWeight: '700'
  },
  tabLabelHighlight: {
    color: '#4ADE80',
    fontWeight: '700',
    marginTop: 2
  }
});
