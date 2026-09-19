export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export type SafetyStatus = 'SAFE' | 'CAUTION' | 'DANGER';

export interface ProbeData {
  pH: number;               // normal 3.8 - 4.2
  moisture: number;         // normal 60% - 68%
  temperature: number;      // normal 20°C - 30°C
  probeScore: number;       // 0 - 100
  tinyMlLatencyMs: number;  // < 12ms
  espBattery: number;       // percentage
  bleConnected: boolean;
  bleSignalRssi: number;
}

export interface VisionData {
  moldPercentage: number;         // normal < 5%
  ureaAdulterationEst: number;    // % added urea, normal 0.0%
  colorScore: number;             // 0 - 100
  textureQuality: string;         // 'Optimal', 'Aerobic Decay', 'Clostridial Slime'
  visionScore: number;            // 0 - 100
  mobileNetLatencyMs: number;     // < 380ms
  sampleImage: string;            // image key or URI
  lightingCondition: 'Good' | 'Fair' | 'Low/Glare';
}

export interface FusionResult {
  mssiScore: number;              // 0 - 100
  safetyStatus: SafetyStatus;
  statusTitle: string;
  statusSubtitle: string;
  safetyOverridesTriggered: string[];
  crudeProteinEst: number;        // e.g. 8.5%
  dryMatterEst: number;           // e.g. 34%
  timestamp: string;
}

export interface VernacularAdvisory {
  language: Language;
  shortWarning: string;
  detailedAction: string;
  audioSpeechText: string;
  supplementRecommendation?: string;
}

export interface TestRecord {
  id: string;
  timestamp: string;
  feedType: string;
  sampleName: string;
  probe: ProbeData;
  vision: VisionData;
  fusion: FusionResult;
  advisories: Record<Language, VernacularAdvisory>;
  qrCodeSignature?: string;
  isSyncedToCloud: boolean;
  farmerName: string;
  location: string;
}

export interface SilagePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  sampleImage: string;
  probe: {
    pH: number;
    moisture: number;
    temperature: number;
  };
  vision: {
    moldPercentage: number;
    ureaAdulterationEst: number;
    colorScore: number;
    textureQuality: string;
  };
}
