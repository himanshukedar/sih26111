import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../constants/translations';
import { SILAGE_PRESETS } from '../constants/presets';
import { evaluateMultimodalFusion } from '../utils/mssiCalculator';
import { SilagePreset, TestRecord } from '../types';
import { HardwareUSBService, HardwareDataPayload } from '../utils/hardwareUsb';

export const ScanTestScreen: React.FC = () => {
  const {
    language,
    setActiveTab,
    setCurrentTest,
    saveTestRecord,
    isBleConnected,
    batteryLevel,
    farmerName,
    farmLocation
  } = useApp();

  const t = TRANSLATIONS[language];

  // Selected sample preset or custom values
  const [selectedPreset, setSelectedPreset] = useState<SilagePreset>(SILAGE_PRESETS[1]); // Default to Slide 4 sample!
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Probe values
  const [pH, setPH] = useState<number>(SILAGE_PRESETS[1].probe.pH);
  const [moisture, setMoisture] = useState<number>(SILAGE_PRESETS[1].probe.moisture);
  const [temperature, setTemperature] = useState<number>(SILAGE_PRESETS[1].probe.temperature);

  // Vision values
  const [moldPercentage, setMoldPercentage] = useState<number>(SILAGE_PRESETS[1].vision.moldPercentage);
  const [ureaAdulteration, setUreaAdulteration] = useState<number>(SILAGE_PRESETS[1].vision.ureaAdulterationEst);
  const [colorScore, setColorScore] = useState<number>(SILAGE_PRESETS[1].vision.colorScore);

  // Analyzing state
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisPhase, setAnalysisPhase] = useState<string>('');
  
  // USB Hardware State
  const [isHardwareActive, setIsHardwareActive] = useState<boolean>(false);

  useEffect(() => {
    // Attempt to connect to USB Hardware when on Step 1
    if (currentStep === 1) {
      HardwareUSBService.connect(9600).then(connected => {
        setIsHardwareActive(connected);
      });

      HardwareUSBService.onData((data: HardwareDataPayload) => {
        if (data.ph !== undefined) setPH(data.ph);
        if (data.moisture !== undefined) setMoisture(data.moisture);
        if (data.temperature !== undefined) setTemperature(data.temperature);
      });
    }

    return () => {
      HardwareUSBService.disconnect();
    };
  }, [currentStep]);

  const handleSelectPreset = (preset: SilagePreset) => {
    setSelectedPreset(preset);
    setPH(preset.probe.pH);
    setMoisture(preset.probe.moisture);
    setTemperature(preset.probe.temperature);
    setMoldPercentage(preset.vision.moldPercentage);
    setUreaAdulteration(preset.vision.ureaAdulterationEst);
    setColorScore(preset.vision.colorScore);
  };

  // Run Fusion Pipeline
  const runFusionAnalysis = () => {
    setCurrentStep(3);
    setAnalysisProgress(15);
    setAnalysisPhase('Processing probe chemistry with TinyML (<12ms)...');

    setTimeout(() => {
      setAnalysisProgress(50);
      setAnalysisPhase('Extracting surface defects via MobileNetV3 (<380ms)...');
    }, 400);

    setTimeout(() => {
      setAnalysisProgress(80);
      setAnalysisPhase('Calculating MSSI = 0.55 × S_probe + 0.45 × S_vision...');
    }, 850);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisPhase('Checking safety lockout invariants...');

      // Evaluate
      const result = evaluateMultimodalFusion(
        { pH, moisture, temperature },
        { moldPercentage, ureaAdulterationEst: ureaAdulteration, colorScore }
      );

      const newRecord: TestRecord = {
        id: `TEST-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        feedType: selectedPreset.category,
        sampleName: selectedPreset.name,
        probe: result.probeData as any,
        vision: result.visionData as any,
        fusion: result.fusion,
        advisories: result.advisories,
        isSyncedToCloud: false,
        farmerName,
        location: farmLocation
      };

      saveTestRecord(newRecord);
      setCurrentTest(newRecord);
      setActiveTab('result');
    }, 1300);
  };

  const getLedRingColor = () => {
    if (ureaAdulteration >= 0.5 || moldPercentage >= 15 || pH >= 5.5) return '#EF4444'; // Red
    if (moldPercentage >= 5 || pH > 4.4 || moisture > 70) return '#F59E0B'; // Amber
    return '#22C55E'; // Green
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Breadcrumb Steps */}
      <View style={styles.stepsContainer}>
        <View style={[styles.stepTab, currentStep === 1 && styles.stepTabActive]}>
          <Text style={[styles.stepNum, currentStep === 1 && styles.stepNumActive]}>1</Text>
          <Text style={[styles.stepLabel, currentStep === 1 && styles.stepLabelActive]}>Probe Chemistry</Text>
        </View>
        <View style={styles.stepDivider} />
        <View style={[styles.stepTab, currentStep === 2 && styles.stepTabActive]}>
          <Text style={[styles.stepNum, currentStep === 2 && styles.stepNumActive]}>2</Text>
          <Text style={[styles.stepLabel, currentStep === 2 && styles.stepLabelActive]}>Camera Vision</Text>
        </View>
        <View style={styles.stepDivider} />
        <View style={[styles.stepTab, currentStep === 3 && styles.stepTabActive]}>
          <Text style={[styles.stepNum, currentStep === 3 && styles.stepNumActive]}>3</Text>
          <Text style={[styles.stepLabel, currentStep === 3 && styles.stepLabelActive]}>MSSI Fusion</Text>
        </View>
      </View>

      {/* Preset Selector */}
      {currentStep !== 3 && (
        <View style={styles.presetSection}>
          <Text style={styles.presetSectionTitle}>{t.presetSelectorTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
            {SILAGE_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                style={[
                  styles.presetPill,
                  selectedPreset.id === preset.id && styles.presetPillSelected
                ]}
                onPress={() => handleSelectPreset(preset)}
              >
                <Text style={[
                  styles.presetPillText,
                  selectedPreset.id === preset.id && styles.presetPillTextSelected
                ]}>
                  {preset.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* STEP 1: PROBE CHEMISTRY */}
      {currentStep === 1 && (
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View>
              <Text style={styles.stepCardTitle}>{t.step1Title}</Text>
              <Text style={styles.stepCardSub}>{t.step1Subtitle}</Text>
            </View>
            <View style={styles.tinyMlChip}>
              <Text style={styles.tinyMlText}>⚡ TinyML &lt;12ms</Text>
            </View>
          </View>

          {/* Virtual OLED Display & LED Halo (From Slide 2 & 4) */}
          <View style={styles.hardwareSimulationBox}>
            {/* 3-Color Halo Ring */}
            <View style={[styles.ledHaloRing, { borderColor: getLedRingColor() }]}>
              <View style={[styles.ledHaloCenter, { backgroundColor: getLedRingColor() }]} />
            </View>

            {/* ESP32 OLED Display */}
            <View style={styles.oledDisplay}>
              <View style={styles.oledTopRow}>
                <Text style={styles.oledBrand}>ESP32-S3 PROBE</Text>
                <Text style={styles.oledStatus}>
                  {isHardwareActive ? 'USB OTG • LIVE' : (isBleConnected ? `BLE 5.0 • BAT ${batteryLevel}%` : 'VIRTUAL PROBE')}
                </Text>
              </View>
              <View style={styles.oledDivider} />
              <Text style={styles.oledText}>
                TYPE: <Text style={styles.oledHighlight}>{selectedPreset.category}</Text>
              </Text>
              <Text style={styles.oledText}>
                pH  : <Text style={styles.oledHighlight}>{pH.toFixed(1)}</Text> {pH > 4.4 ? '[HIGH]' : '[OPTIMAL]'}
              </Text>
              <Text style={styles.oledText}>
                MST : <Text style={styles.oledHighlight}>{moisture.toFixed(0)}%</Text> {moisture > 68 ? '[HIGH]' : '[NORMAL]'}
              </Text>
              <Text style={styles.oledText}>
                CORE: <Text style={styles.oledHighlight}>{temperature.toFixed(1)}°C</Text> / 24.0°C Amb
              </Text>
              <Text style={styles.oledStatusFooter}>
                STATUS: {ureaAdulteration >= 0.5 || moldPercentage >= 15 ? 'UNSAFE LOCKOUT' : 'SCAN OK'}
              </Text>
            </View>
          </View>

          {/* Interactive Sensor Adjusters */}
          <View style={styles.adjusterBox}>
            <Text style={styles.adjusterTitle}>Probe Sensor Real-time Telemetry {isHardwareActive ? '(Auto-syncing via USB)' : ''}:</Text>

            {/* pH Adjuster */}
            <View style={styles.sensorRow}>
              <View style={styles.sensorLabelCol}>
                <Text style={styles.sensorName}>Silage pH (Acidity):</Text>
                <Text style={styles.sensorBenchmark}>Normal: 3.8 - 4.2</Text>
              </View>
              <View style={styles.sensorControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setPH(prev => Math.max(3.0, Number((prev - 0.2).toFixed(1))))}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.sensorDisplayVal, pH > 4.4 && { color: '#EF4444' }]}>
                  {pH.toFixed(1)}
                </Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setPH(prev => Math.min(8.0, Number((prev + 0.2).toFixed(1))))}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Moisture Adjuster */}
            <View style={styles.sensorRow}>
              <View style={styles.sensorLabelCol}>
                <Text style={styles.sensorName}>Moisture Content:</Text>
                <Text style={styles.sensorBenchmark}>Normal: 60% - 68%</Text>
              </View>
              <View style={styles.sensorControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setMoisture(prev => Math.max(45, prev - 2))}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.sensorDisplayVal, moisture > 70 && { color: '#F59E0B' }]}>
                  {moisture.toFixed(0)}%
                </Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setMoisture(prev => Math.min(85, prev + 2))}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Temperature Adjuster */}
            <View style={styles.sensorRow}>
              <View style={styles.sensorLabelCol}>
                <Text style={styles.sensorName}>Silage Core Temp:</Text>
                <Text style={styles.sensorBenchmark}>Normal: &lt; 28°C</Text>
              </View>
              <View style={styles.sensorControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setTemperature(prev => Math.max(18, Number((prev - 1).toFixed(1))))}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.sensorDisplayVal, temperature > 28 && { color: '#EF4444' }]}>
                  {temperature.toFixed(1)}°C
                </Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setTemperature(prev => Math.min(45, Number((prev + 1).toFixed(1))))}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.stepNextBtn}
            onPress={() => setCurrentStep(2)}
            activeOpacity={0.85}
          >
            <Text style={styles.stepNextText}>Proceed to Camera Vision ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STEP 2: CAMERA SURFACE SCAN */}
      {currentStep === 2 && (
        <View style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View>
              <Text style={styles.stepCardTitle}>{t.step2Title}</Text>
              <Text style={styles.stepCardSub}>{t.step2Subtitle}</Text>
            </View>
            <View style={styles.tinyMlChip}>
              <Text style={styles.tinyMlText}>🧠 MobileNetV3 &lt;380ms</Text>
            </View>
          </View>

          {/* Camera Viewfinder with Reticle (Slide 4 & 5) */}
          <View style={styles.viewfinderContainer}>
            <View style={styles.cameraBackground}>
              {/* Simulated Feed Texture & Defect Overlays */}
              <View style={styles.sampleTextureBox}>
                <Text style={styles.textureIcon}>🌾</Text>
                <Text style={styles.sampleTextureLabel}>{selectedPreset.name}</Text>

                {/* Overlays matching Slide 4: Mold 0.82, Spoilage 0.67 */}
                {moldPercentage >= 15 && (
                  <>
                    <View style={styles.defectBoxMold}>
                      <Text style={styles.defectLabel}>Mold {(moldPercentage / 100).toFixed(2)}</Text>
                    </View>
                    <View style={styles.defectBoxSpoilage}>
                      <Text style={styles.defectLabel}>Spoilage 0.67</Text>
                    </View>
                  </>
                )}

                {ureaAdulteration >= 0.5 && (
                  <View style={styles.defectBoxUrea}>
                    <Text style={styles.defectLabel}>Urea Speckles {ureaAdulteration.toFixed(2)}%</Text>
                  </View>
                )}
              </View>

              {/* Viewfinder Target Reticle */}
              <View style={styles.reticleCornerTL} />
              <View style={styles.reticleCornerTR} />
              <View style={styles.reticleCornerBL} />
              <View style={styles.reticleCornerBR} />
              <View style={styles.reticleCenter} />

              <View style={styles.reticleInstruction}>
                <Text style={styles.reticleText}>{t.cameraReticleText}</Text>
              </View>
            </View>

            {/* Exposure & Lighting Indicator (Slide 5) */}
            <View style={styles.exposureBar}>
              <Text style={styles.exposureText}>💡 {t.lightingGood}</Text>
              <Text style={styles.exposureSub}>Auto-exposure checked • Contrast 98%</Text>
            </View>
          </View>

          {/* Defect Tuning */}
          <View style={styles.adjusterBox}>
            <Text style={styles.adjusterTitle}>Vision Inference Detections:</Text>

            {/* Mold Percentage */}
            <View style={styles.sensorRow}>
              <View style={styles.sensorLabelCol}>
                <Text style={styles.sensorName}>Surface Mold Detected:</Text>
                <Text style={styles.sensorBenchmark}>Hazard threshold: &ge; 15%</Text>
              </View>
              <View style={styles.sensorControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setMoldPercentage(prev => Math.max(0, prev - 5))}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.sensorDisplayVal, moldPercentage >= 15 && { color: '#EF4444' }]}>
                  {moldPercentage.toFixed(0)}%
                </Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setMoldPercentage(prev => Math.min(95, prev + 5))}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Urea Adulteration */}
            <View style={styles.sensorRow}>
              <View style={styles.sensorLabelCol}>
                <Text style={styles.sensorName}>Added Urea Adulteration:</Text>
                <Text style={styles.sensorBenchmark}>Lockout threshold: &ge; 0.5%</Text>
              </View>
              <View style={styles.sensorControls}>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setUreaAdulteration(prev => Math.max(0, Number((prev - 0.1).toFixed(2))))}
                >
                  <Text style={styles.adjustBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={[styles.sensorDisplayVal, ureaAdulteration >= 0.5 && { color: '#EF4444' }]}>
                  {ureaAdulteration.toFixed(2)}%
                </Text>
                <TouchableOpacity
                  style={styles.adjustBtn}
                  onPress={() => setUreaAdulteration(prev => Math.min(2.0, Number((prev + 0.1).toFixed(2))))}
                >
                  <Text style={styles.adjustBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.stepBtnRow}>
            <TouchableOpacity
              style={styles.stepBackBtn}
              onPress={() => setCurrentStep(1)}
            >
              <Text style={styles.stepBackText}>◀ Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.stepFusionBtn}
              onPress={runFusionAnalysis}
              activeOpacity={0.85}
            >
              <Text style={styles.stepFusionText}>⚡ Run Multimodal Fusion</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: ANALYZING PROGRESS */}
      {currentStep === 3 && (
        <View style={styles.analyzingCard}>
          <ActivityIndicator size="large" color="#22C55E" style={{ marginBottom: 20 }} />
          <Text style={styles.analyzingTitle}>{t.analyzingText}</Text>
          <Text style={styles.analyzingPhaseText}>{analysisPhase}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${analysisProgress}%` }]} />
          </View>

          {/* Formula Display (Slide 4) */}
          <View style={styles.formulaCard}>
            <Text style={styles.formulaHeader}>Multimodal Decision Engine:</Text>
            <Text style={styles.formulaEquation}>
              Σ  MSSI = 0.55 × S_probe + 0.45 × S_vision
            </Text>
            <View style={styles.formulaOverrideNote}>
              <Text style={styles.formulaOverrideText}>
                Safety Lockout Invariant: Urea &ge; 0.5% or Mold &ge; 15% &rarr; Immediate Alert!
              </Text>
            </View>
          </View>
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
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#131D31',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  stepTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8
  },
  stepTabActive: {
    backgroundColor: '#1E293B'
  },
  stepNum: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#334155',
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20
  },
  stepNumActive: {
    backgroundColor: '#16A34A',
    color: '#FFFFFF'
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B'
  },
  stepLabelActive: {
    color: '#F8FAFC',
    fontWeight: '700'
  },
  stepDivider: {
    width: 14,
    height: 1,
    backgroundColor: '#334155'
  },
  presetSection: {
    marginBottom: 16
  },
  presetSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8
  },
  presetScroll: {
    flexDirection: 'row'
  },
  presetPill: {
    backgroundColor: '#131D31',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  presetPillSelected: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E'
  },
  presetPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8'
  },
  presetPillTextSelected: {
    color: '#4ADE80',
    fontWeight: '700'
  },
  stepCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  stepCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  stepCardSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2
  },
  tinyMlChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  tinyMlText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38BDF8'
  },
  hardwareSimulationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0F1D',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    gap: 14
  },
  ledHaloRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A'
  },
  ledHaloCenter: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  oledDisplay: {
    flex: 1,
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155'
  },
  oledTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  oledBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5
  },
  oledStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4ADE80'
  },
  oledDivider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginBottom: 6
  },
  oledText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#E2E8F0',
    lineHeight: 16
  },
  oledHighlight: {
    fontWeight: '800',
    color: '#FBBF24'
  },
  oledStatusFooter: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#38BDF8',
    marginTop: 4
  },
  adjusterBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  adjusterTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 10
  },
  sensorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B'
  },
  sensorLabelCol: {
    flex: 1
  },
  sensorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F1F5F9'
  },
  sensorBenchmark: {
    fontSize: 10,
    color: '#64748B'
  },
  sensorControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  adjustBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155'
  },
  adjustBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC'
  },
  sensorDisplayVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#38BDF8',
    minWidth: 46,
    textAlign: 'center'
  },
  stepNextBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  stepNextText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  viewfinderContainer: {
    marginBottom: 16
  },
  cameraBackground: {
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#334155',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sampleTextureBox: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  textureIcon: {
    fontSize: 64,
    opacity: 0.8
  },
  sampleTextureLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginTop: 8
  },
  defectBoxMold: {
    position: 'absolute',
    top: -20,
    left: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  defectBoxSpoilage: {
    position: 'absolute',
    bottom: -15,
    right: 30,
    backgroundColor: 'rgba(245, 158, 11, 0.3)',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  defectBoxUrea: {
    position: 'absolute',
    top: 25,
    right: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderColor: '#A855F7',
    borderWidth: 1.5,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  defectLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  reticleCornerTL: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#22C55E'
  },
  reticleCornerTR: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#22C55E'
  },
  reticleCornerBL: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#22C55E'
  },
  reticleCornerBR: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#22C55E'
  },
  reticleCenter: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'rgba(34, 197, 94, 0.6)'
  },
  reticleInstruction: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  reticleText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F8FAFC'
  },
  exposureBar: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  exposureText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4ADE80'
  },
  exposureSub: {
    fontSize: 10,
    color: '#64748B'
  },
  stepBtnRow: {
    flexDirection: 'row',
    gap: 10
  },
  stepBackBtn: {
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepBackText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8'
  },
  stepFusionBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8
  },
  stepFusionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  analyzingCard: {
    backgroundColor: '#131D31',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  analyzingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
    textAlign: 'center'
  },
  analyzingPhaseText: {
    fontSize: 13,
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center'
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E'
  },
  formulaCard: {
    backgroundColor: '#0A0F1D',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1E293B'
  },
  formulaHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6
  },
  formulaEquation: {
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '800',
    color: '#4ADE80',
    marginBottom: 8
  },
  formulaOverrideNote: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  formulaOverrideText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F87171'
  }
});
