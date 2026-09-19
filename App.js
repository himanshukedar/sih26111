import React from 'react';
import { StyleSheet, View, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { NavigationTabBar } from './src/components/NavigationTabBar';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanTestScreen } from './src/screens/ScanTestScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { QRTraceabilityScreen } from './src/screens/QRTraceabilityScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { CooperativeDashboardScreen } from './src/screens/CooperativeDashboardScreen';

// Strict DOM override for Web to guarantee Portrait Phone Frame
if (Platform.OS === 'web') {
  try {
    const style = document.createElement('style');
    style.innerHTML = `
      body, html {
        background-color: #000000 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        height: 100vh !important;
        margin: 0 !important;
      }
      #root {
        width: 390px !important;
        height: 844px !important;
        max-height: 95vh !important;
        border-radius: 40px !important;
        border: 12px solid #1E293B !important;
        overflow: hidden !important;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
        position: relative !important;
        flex: unset !important;
      }
    `;
    document.head.appendChild(style);
  } catch (e) {
    // Ignore DOM errors if running in SSR
  }
}

const MainNavigator: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'scan':
        return <ScanTestScreen />;
      case 'result':
        return <ResultScreen />;
      case 'qr':
        return <QRTraceabilityScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'coop':
        return <CooperativeDashboardScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#0F172A" />
      <Header />
      <View style={styles.screenContainer}>
        {renderActiveScreen()}
      </View>
      <NavigationTabBar />
    </SafeAreaView>
  );
};

export default function App() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <View style={styles.mobileContainer}>
          <AppProvider>
            <MainNavigator />
          </AppProvider>
        </View>
      </View>
    );
  }

  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0F1D'
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#0A0F1D'
  }
});
