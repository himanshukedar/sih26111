import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TestRecord } from '../types';
import { evaluateMultimodalFusion } from '../utils/mssiCalculator';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentTest: TestRecord | null;
  setCurrentTest: (test: TestRecord | null) => void;
  testHistory: TestRecord[];
  saveTestRecord: (record: TestRecord) => void;
  offlineQueueCount: number;
  isSyncing: boolean;
  syncOfflineQueue: () => Promise<void>;
  isBleConnected: boolean;
  toggleBleConnection: () => void;
  batteryLevel: number;
  farmerName: string;
  setFarmerName: (name: string) => void;
  farmLocation: string;
  setFarmLocation: (loc: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default English
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentTest, setCurrentTest] = useState<TestRecord | null>(null);
  const [isBleConnected, setIsBleConnected] = useState<boolean>(true);
  const [batteryLevel, setBatteryLevel] = useState<number>(94);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [farmerName, setFarmerName] = useState<string>('Ramesh Patil');
  const [farmLocation, setFarmLocation] = useState<string>('Kolhapur, Maharashtra');

  // Seed sample past test records
  const [testHistory, setTestHistory] = useState<TestRecord[]>(() => {
    // Generate an initial record matching Slide 4:
    const initialSlide4 = evaluateMultimodalFusion(
      { pH: 6.8, moisture: 72.0, temperature: 26.5 },
      { moldPercentage: 78.0, ureaAdulterationEst: 0.2, colorScore: 32 }
    );

    const record1: TestRecord = {
      id: 'TEST-2026-0914-01',
      timestamp: '2026-09-14 16:30',
      feedType: 'Corn Silage (Bunk Surface)',
      sampleName: 'Bunker #2 Surface Sample',
      probe: initialSlide4.probeData as any,
      vision: initialSlide4.visionData as any,
      fusion: initialSlide4.fusion,
      advisories: initialSlide4.advisories,
      isSyncedToCloud: true,
      farmerName: 'Ramesh Patil',
      location: 'Kolhapur, Maharashtra'
    };

    const initialSafe = evaluateMultimodalFusion(
      { pH: 3.9, moisture: 64.0, temperature: 22.8 },
      { moldPercentage: 1.0, ureaAdulterationEst: 0.0, colorScore: 95 }
    );

    const record2: TestRecord = {
      id: 'TEST-2026-0915-02',
      timestamp: '2026-09-15 08:15',
      feedType: 'Pioneer Corn Silage (Core)',
      sampleName: 'Pit #1 Deep Core Specimen',
      probe: initialSafe.probeData as any,
      vision: initialSafe.visionData as any,
      fusion: initialSafe.fusion,
      advisories: initialSafe.advisories,
      isSyncedToCloud: false, // In offline queue
      farmerName: 'Ramesh Patil',
      location: 'Kolhapur, Maharashtra'
    };

    return [record2, record1];
  });

  const offlineQueueCount = testHistory.filter(t => !t.isSyncedToCloud).length;

  const saveTestRecord = (record: TestRecord) => {
    setTestHistory(prev => [record, ...prev]);
    setCurrentTest(record);
  };

  const syncOfflineQueue = async () => {
    setIsSyncing(true);
    // Simulate cloud round-trip to FastAPI backend
    await new Promise(resolve => setTimeout(resolve, 1400));
    setTestHistory(prev => prev.map(t => ({ ...t, isSyncedToCloud: true })));
    setIsSyncing(false);
  };

  const toggleBleConnection = () => {
    setIsBleConnected(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        currentTest,
        setCurrentTest,
        testHistory,
        saveTestRecord,
        offlineQueueCount,
        isSyncing,
        syncOfflineQueue,
        isBleConnected,
        toggleBleConnection,
        batteryLevel,
        farmerName,
        setFarmerName,
        farmLocation,
        setFarmLocation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
