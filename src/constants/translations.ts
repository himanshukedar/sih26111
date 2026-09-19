import { Language } from '../types';

export interface Translations {
  appName: string;
  tagline: string;
  sihCode: string;
  teamName: string;
  home: string;
  newTest: string;
  qrScan: string;
  history: string;
  dashboard: string;
  probeStatus: string;
  connected: string;
  disconnected: string;
  battery: string;
  signal: string;
  startQuickTest: string;
  startTestSubtitle: string;
  recentTests: string;
  noRecentTests: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step3Title: string;
  step3Subtitle: string;
  analyzingText: string;
  qualityScore: string;
  statusSafe: string;
  statusCaution: string;
  statusDanger: string;
  summary: string;
  details: string;
  phAcidity: string;
  moistureContent: string;
  silageTemp: string;
  moldDetected: string;
  ureaAdulteration: string;
  crudeProtein: string;
  dryMatter: string;
  voiceAdvisory: string;
  playVoice: string;
  stopVoice: string;
  listening: string;
  saveOffline: string;
  generateQR: string;
  syncCloud: string;
  newTestBtn: string;
  safetyOverrideWarning: string;
  presetSelectorTitle: string;
  customProbeTuning: string;
  cameraReticleText: string;
  lightingGood: string;
  lightingCheck: string;
  captureSurfacePhoto: string;
  tamperProofQR: string;
  scanSilageBale: string;
  verifiedAuthentic: string;
  unverifiedWarning: string;
  offlineModeActive: string;
  syncedSuccess: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    appName: "SilageGuard AI",
    tagline: "Multimodal Edge AI for Rapid Feed & Silage Diagnostics",
    sihCode: "SIH26111",
    teamName: "The Bro-grammers",
    home: "Home",
    newTest: "Start Test",
    qrScan: "QR Verify",
    history: "Records",
    dashboard: "Co-op Hub",
    probeStatus: "ESP32-S3 Probe",
    connected: "BLE Connected",
    disconnected: "Simulated Probe",
    battery: "Battery",
    signal: "BLE 5.0 Active",
    startQuickTest: "Run 60s Farm-Gate Test",
    startTestSubtitle: "Instant probe chemistry + MobileNetV3 camera vision fusion",
    recentTests: "Recent Farm-Gate Tests",
    noRecentTests: "No tests yet. Run your first rapid test!",
    step1Title: "Step 1: Probe Chemistry",
    step1Subtitle: "Insert spear sensors into silage core (pH, Moisture, Temp)",
    step2Title: "Step 2: Surface Camera Vision",
    step2Subtitle: "Align surface photo within guided reticle for mold & urea check",
    step3Title: "Step 3: Multimodal Edge Fusion",
    step3Subtitle: "Running 10-Tree TinyML (<12ms) + MobileNetV3 (<380ms)",
    analyzingText: "Fusing sensor spectra and neural feature maps...",
    qualityScore: "Quality Score",
    statusSafe: "SAFE TO FEED (Grade A)",
    statusCaution: "CAUTION - Early Spoilage",
    statusDanger: "UNSAFE TO FEED - HAZARD",
    summary: "Summary",
    details: "Details",
    phAcidity: "Silage pH",
    moistureContent: "Moisture Content",
    silageTemp: "Silage Temperature",
    moldDetected: "Mold & Spoilage",
    ureaAdulteration: "Added Urea (Est.)",
    crudeProtein: "Crude Protein (CP)",
    dryMatter: "Dry Matter (DM)",
    voiceAdvisory: "Vernacular Voice Advisory",
    playVoice: "Listen Audio Advice",
    stopVoice: "Stop Audio",
    listening: "Playing audio advisory...",
    saveOffline: "Save Offline",
    generateQR: "Generate Batch QR",
    syncCloud: "Sync to Cloud",
    newTestBtn: "New Test",
    safetyOverrideWarning: "CRITICAL SAFETY LOCKOUT: Added Urea >= 0.5% or Mold >= 15% detected!",
    presetSelectorTitle: "Select Feed / Silage Sample Condition:",
    customProbeTuning: "Adjust Probe Sensors (Simulator Mode)",
    cameraReticleText: "Hold steady 15-20cm over feed sample",
    lightingGood: "Lighting: Optimal (Normalized)",
    lightingCheck: "Lighting: Check barn glare",
    captureSurfacePhoto: "Capture & Analyze Surface",
    tamperProofQR: "Ed25519 Cryptographic Bale Traceability",
    scanSilageBale: "Scan Silage Bale QR Stamp",
    verifiedAuthentic: "Verified Authentic Baled Silage",
    unverifiedWarning: "Counterfeit or Unverified Feed Detected!",
    offlineModeActive: "100% Offline Edge Mode Enabled",
    syncedSuccess: "Records Synced to Dairy Cooperative Cloud"
  },
  hi: {
    appName: "साइलेजगार्ड AI",
    tagline: "पशु आहार एवं साइलेज की गुणवत्ता जांचने का स्मार्ट AI सिस्टम",
    sihCode: "SIH26111",
    teamName: "The Bro-grammers",
    home: "होम",
    newTest: "जांच शुरू करें",
    qrScan: "QR जांच",
    history: "इतिहास",
    dashboard: "डेयरी डैशबोर्ड",
    probeStatus: "ESP32-S3 प्रोब",
    connected: "ब्लूटूथ कनेक्टेड",
    disconnected: "सिम्युलेटेड प्रोब",
    battery: "बैटरी",
    signal: "BLE 5.0 सक्रिय",
    startQuickTest: "60 सेकंड में चारा जांचें",
    startTestSubtitle: "सेंसर और कैमरा AI द्वारा तुरंत जांच व आवाज़ में सलाह",
    recentTests: "हालिया चारा जांच रिपोर्ट",
    noRecentTests: "अभी कोई रिपोर्ट नहीं है। पहली जांच करें!",
    step1Title: "चरण 1: सेंसर प्रोब जांच",
    step1Subtitle: "प्रोब को साइलेज के अंदर डालें (pH, नमी, तापमान)",
    step2Title: "चरण 2: कैमरा फोटो विश्लेषण",
    step2Subtitle: "फफूंद और यूरिया की पहचान हेतु चारे की फोटो लें",
    step3Title: "चरण 3: AI विश्लेषण प्रगति पर",
    step3Subtitle: "TinyML (<12ms) और MobileNetV3 (<380ms) गणना कर रहे हैं",
    analyzingText: "सेंसर डेटा और इमेज का विश्लेषण हो रहा है...",
    qualityScore: "गुणवत्ता स्कोर",
    statusSafe: "खिलाने के लिए सुरक्षित (उत्तम)",
    statusCaution: "सावधानी - हल्का बिगाड़",
    statusDanger: "खिलाना मना है - खतरनाक",
    summary: "संक्षिप्त विवरण",
    details: "विस्तृत आंकड़े",
    phAcidity: "साइलेज pH (अम्लता)",
    moistureContent: "नमी प्रतिशत",
    silageTemp: "चारा तापमान",
    moldDetected: "फफूंद (मोल्ड)",
    ureaAdulteration: "मिलावटी यूरिया (अनुमानित)",
    crudeProtein: "प्रोटीन (CP)",
    dryMatter: "शुष्क पदार्थ (DM)",
    voiceAdvisory: "अपनी भाषा में सलाह सुनें",
    playVoice: "सलाह सुनें (ऑडियो)",
    stopVoice: "ऑडियो रोकें",
    listening: "सलाह सुनाई जा रही है...",
    saveOffline: "ऑफलाइन सेव करें",
    generateQR: "बैच QR कोड बनाएं",
    syncCloud: "क्लाउड पर भेजें",
    newTestBtn: "नई जांच",
    safetyOverrideWarning: "सुरक्षा चेतावनी: यूरिया >= 0.5% या फफूंद >= 15% पाई गई है!",
    presetSelectorTitle: "चारे का नमूना प्रकार चुनें:",
    customProbeTuning: "सेंसर मान बदलें (सिम्युलेटर मोड)",
    cameraReticleText: "कैमरे को चारे से 15-20 सेमी ऊपर रखें",
    lightingGood: "रोशनी: उत्तम (संतुलित)",
    lightingCheck: "रोशनी: अधिक छाया या चमक",
    captureSurfacePhoto: "फोटो खींचें और जांचें",
    tamperProofQR: "Ed25519 डिजिटल प्रमाणित साइलेज QR",
    scanSilageBale: "साइलेज गांठ QR स्कैन करें",
    verifiedAuthentic: "प्रमाणित असली साइलेज गांठ",
    unverifiedWarning: "अमान्य या मिलावटी चारा चेतावनी!",
    offlineModeActive: "100% बिना इंटरनेट (ऑफलाइन) सक्रिय",
    syncedSuccess: "रिकॉर्ड सफलतापूर्वक डेयरी क्लाउड पर अपलोड हुआ"
  },
  mr: {
    appName: "सायलेजगार्ड AI",
    tagline: "जनावरांच्या चाऱ्याची व सायलेजची गुणवत्ता तपासणी AI प्रणाली",
    sihCode: "SIH26111",
    teamName: "The Bro-grammers",
    home: "मुख्यपृष्ठ",
    newTest: "चाचणी सुरू करा",
    qrScan: "QR पडताळणी",
    history: "नोंदी",
    dashboard: "डेअरी डॅशबोर्ड",
    probeStatus: "ESP32-S3 प्रोब",
    connected: "ब्लूटूथ कनेक्टेड",
    disconnected: "सिम्युलेटेड प्रोब",
    battery: "बॅटरी",
    signal: "BLE 5.0 कार्यरत",
    startQuickTest: "६० सेकंदात चारा तपासा",
    startTestSubtitle: "सेंसर आणि कॅमेरा AI द्वारे झटपट तपासणी व मराठीत सल्ला",
    recentTests: "अलीकडील चारा तपासण्या",
    noRecentTests: "अद्याप कोणतीही चाचणी नाही. पहिली चाचणी करा!",
    step1Title: "पायरी १: सेन्सर प्रोब तपासणी",
    step1Subtitle: "सायलेजमध्ये प्रोब घाला (सामू/pH, ओलावा, तापमान)",
    step2Title: "पायरी २: कॅमेरा फोटो तपासणी",
    step2Subtitle: "बुरशी आणि युरिया तपासण्यासाठी चाऱ्याचा फोटो घ्या",
    step3Title: "पायरी ३: मल्टिमॉडेल AI प्रक्रिया",
    step3Subtitle: "TinyML (<12ms) आणि MobileNetV3 विश्लेषण करत आहे",
    analyzingText: "सेन्सर आणि फोटोचे अचूक विश्लेषण चालू आहे...",
    qualityScore: "गुणवत्ता गुण",
    statusSafe: "जनावरांना खाऊ घालण्यास सुरक्षित",
    statusCaution: "सावधान - खराब होण्याची शक्यता",
    statusDanger: "जनावरांना देऊ नका - घातक",
    summary: "थोडक्यात",
    details: "तपशील",
    phAcidity: "सायलेज pH (सामू)",
    moistureContent: "ओलाव्याचे प्रमाण",
    silageTemp: "सायलेज तापमान",
    moldDetected: "बुरशीचे प्रमाण",
    ureaAdulteration: "मिसळलेला युरिया",
    crudeProtein: "प्रथिने (प्रोटीन)",
    dryMatter: "ड्राय मॅटर (DM)",
    voiceAdvisory: "स्थानिक आवाजात सल्ला",
    playVoice: "सल्ला ऐका (ऑडिओ)",
    stopVoice: "ऑडिओ थांबवा",
    listening: "सल्ला वाचन चालू आहे...",
    saveOffline: "ऑफलाइन साठवा",
    generateQR: "बॅच QR कोड तयार करा",
    syncCloud: "क्लाउडवर पाठवा",
    newTestBtn: "नवी चाचणी",
    safetyOverrideWarning: "धोकादायक लॉकआउट: युरिया >= ०.५% किंवा बुरशी >= १५% आढळली!",
    presetSelectorTitle: "चाऱ्याचा नमुना प्रकार निवडा:",
    customProbeTuning: "सेन्सर मूल्य बदला (सिम्युलेटर)",
    cameraReticleText: "कॅमेरा चाऱ्यापासून १५-२० सेमी अंतरावर धरा",
    lightingGood: "प्रकाश: उत्तम",
    lightingCheck: "प्रकाश: गोठ्यात प्रकाश कमी आहे",
    captureSurfacePhoto: "फोटो काढा आणि तपासा",
    tamperProofQR: "Ed25519 सुरक्षित सायलेज गाठ QR",
    scanSilageBale: "सायलेज गाठ QR कोड स्कॅन करा",
    verifiedAuthentic: "अधिकृत आणि सुरक्षित सायलेज",
    unverifiedWarning: "बनावट किंवा असुरक्षित चाऱ्याचा धोका!",
    offlineModeActive: "१००% ऑफलाइन प्रणाली कार्यरत",
    syncedSuccess: "नोंदी यशस्वीरीत्या क्लाउडवर पाठवल्या"
  },
  ta: {
    appName: "சைலேஜ்கார்ட் AI",
    tagline: "கால்நடை தீவனம் மற்றும் சைலேஜ் தர சோதனை அமைப்பு",
    sihCode: "SIH26111",
    teamName: "The Bro-grammers",
    home: "முகப்பு",
    newTest: "சோதனை செய்க",
    qrScan: "QR சரிபார்ப்பு",
    history: "பதிவுகள்",
    dashboard: "கூட்டுறவு தளம்",
    probeStatus: "ESP32-S3 புரோப்",
    connected: "புளூடூத் இணைக்கப்பட்டது",
    disconnected: "மாதிரி புரோப்",
    battery: "மின்கலன்",
    signal: "BLE 5.0 தயார்",
    startQuickTest: "60 நொடியில் தீவன சோதனை",
    startTestSubtitle: "சென்சார் & கேமரா AI மூலம் உடனடி முடிவுகள்",
    recentTests: "சமீபத்திய சோதனைகள்",
    noRecentTests: "பதிவுகள் இல்லை. முதல் சோதனையை தொடங்கவும்!",
    step1Title: "படி 1: புரோப் சென்சார்",
    step1Subtitle: "தீவனத்தில் புரோப் நுழைக்கவும் (pH, ஈரப்பதம், வெப்பநிலை)",
    step2Title: "படி 2: கேமரா ஆய்வு",
    step2Subtitle: "பூஞ்சை மற்றும் யூரியாவை கண்டறிய படம் எடுக்கவும்",
    step3Title: "படி 3: AI பகுப்பாய்வு",
    step3Subtitle: "TinyML மற்றும் MobileNetV3 ஒருங்கிணைப்பு...",
    analyzingText: "சென்சார் மற்றும் படங்களை ஒப்பிடுகிறது...",
    qualityScore: "தர மதிப்பீடு",
    statusSafe: "பாதுகாப்பானது (தரம் A)",
    statusCaution: "எச்சரிக்கை - ஆரம்ப நிலை கெடுதல்",
    statusDanger: "தீவனம் அளிக்க வேண்டாம் - ஆபத்தானது",
    summary: "சுருக்கம்",
    details: "விவரங்கள்",
    phAcidity: "pH அளவு",
    moistureContent: "ஈரப்பதம்",
    silageTemp: "வெப்பநிலை",
    moldDetected: "பூஞ்சை தொற்று",
    ureaAdulteration: "யூரியா கலப்படம்",
    crudeProtein: "புரதம் (CP)",
    dryMatter: "உலர்ந்த பொருள் (DM)",
    voiceAdvisory: "குரல் வழி ஆலோசனை",
    playVoice: "ஆடியோ கேட்கவும்",
    stopVoice: "நிறுத்தவும்",
    listening: "குரல் ஒலிக்கிறது...",
    saveOffline: "ஆஃப்லைனில் சேமிக்கவும்",
    generateQR: "QR குறியீடு உருவாக்கவும்",
    syncCloud: "கிளவுட் பதிவேற்றம்",
    newTestBtn: "புதிய சோதனை",
    safetyOverrideWarning: "பாதுகாப்பு எச்சரிக்கை: யூரியா >= 0.5% அல்லது பூஞ்சை >= 15%!",
    presetSelectorTitle: "தீவன மாதிரியை தேர்ந்தெடுக்கவும்:",
    customProbeTuning: "சென்சார் அளவு மாற்றவும்",
    cameraReticleText: "கேமராவை தீவனத்தின் மேல் நிலைநிறுத்தவும்",
    lightingGood: "ஒளி: உகந்தது",
    lightingCheck: "ஒளி: சரிபார்க்கவும்",
    captureSurfacePhoto: "படம் எடுத்து ஆய்வு செய்க",
    tamperProofQR: "Ed25519 பாதுகாப்பான QR சரிபார்ப்பு",
    scanSilageBale: "சைலேஜ் மூட்டை QR ஸ்கேன்",
    verifiedAuthentic: "அங்கீகரிக்கப்பட்ட உண்மையான தீவனம்",
    unverifiedWarning: "கலப்பட அல்லது போலி தீவன எச்சரிக்கை!",
    offlineModeActive: "இணையம் இன்றி செயல்படும் வசதி",
    syncedSuccess: "தரவுகள் வெற்றிகரமாக பதிவேற்றப்பட்டன"
  },
  te: {
    appName: "సైలేజ్‌గార్డ్ AI",
    tagline: "పశువుల మేత మరియు సైలేజ్ నాణ్యత పరీక్ష AI వ్యవస్థ",
    sihCode: "SIH26111",
    teamName: "The Bro-grammers",
    home: "హోమ్",
    newTest: "పరీక్ష ప్రారంభించండి",
    qrScan: "QR ధృవీకరణ",
    history: "రికార్డులు",
    dashboard: "సహకార డ్యాష్‌బోర్డ్",
    probeStatus: "ESP32-S3 ప్రోబ్",
    connected: "బ్లూటూత్ కనెక్ట్ అయింది",
    disconnected: "సిమ్యులేటెడ్ ప్రోబ్",
    battery: "బ్యాటరీ",
    signal: "BLE 5.0 యాక్టివ్",
    startQuickTest: "60 సెకన్లలో మేత పరీక్ష",
    startTestSubtitle: "సెన్సార్ మరియు కెమెరా AI ద్వారా తక్షణ ఫలితాలు & సలహాలు",
    recentTests: "ఇటీవలి పరీక్షలు",
    noRecentTests: "రికార్డులు లేవు. మొదటి పరీక్షను ప్రారంభించండి!",
    step1Title: "దశ 1: ప్రోబ్ కెమిస్ట్రీ",
    step1Subtitle: "మేతలో ప్రోబ్ చొప్పించండి (pH, తేమ, ఉష్ణోగ్రత)",
    step2Title: "దశ 2: కెమెరా ఉపరితల స్కానింగ్",
    step2Subtitle: "బూజు మరియు యూరియా గుర్తించడానికి ఫోటో తీయండి",
    step3Title: "దశ 3: AI ముగింపు",
    step3Subtitle: "TinyML (<12ms) మరియు MobileNetV3 రన్ అవుతున్నాయి...",
    analyzingText: "డేటాను విశ్లేషిస్తోంది...",
    qualityScore: "నాణ్యత స్కోరు",
    statusSafe: "మేత సురక్షితం (గ్రేడ్ A)",
    statusCaution: "జాగ్రత్త - ప్రారంభ పాడవడం",
    statusDanger: "మేత వేయవద్దు - ప్రమాదకరం",
    summary: "సారాంశం",
    details: "వివరాలు",
    phAcidity: "సైలేజ్ pH",
    moistureContent: "తేమ శాతం",
    silageTemp: "ఉష్ణోగ్రత",
    moldDetected: "బూజు శాతం",
    ureaAdulteration: "కలిపిన యూరియా",
    crudeProtein: "ప్రొటీన్ (CP)",
    dryMatter: "పొడి పదార్థం (DM)",
    voiceAdvisory: "స్థానిక వాయిస్ సలహా",
    playVoice: "ఆడియో వినండి",
    stopVoice: "ఆడియో ఆపండి",
    listening: "సలహా వినబడుతోంది...",
    saveOffline: "ఆఫ్‌లైన్‌లో భద్రపరచండి",
    generateQR: "బ్యాచ్ QR కోడ్",
    syncCloud: "క్లౌడ్‌కు పంపండి",
    newTestBtn: "కొత్త పరీక్ష",
    safetyOverrideWarning: "భద్రతా హెచ్చరిక: యూరియా >= 0.5% లేదా బూజు >= 15% గుర్తించబడింది!",
    presetSelectorTitle: "మేత నమూనాను ఎంచుకోండి:",
    customProbeTuning: "సెన్సార్ విలువలను సర్దుబాటు చేయండి",
    cameraReticleText: "కెమెరాను మేతపై 15-20 సెం.మీ దూరంలో ఉంచండి",
    lightingGood: "వెలుతురు: సరైనది",
    lightingCheck: "వెలుతురు: తనిఖీ చేయండి",
    captureSurfacePhoto: "ఫోటో తీసి విశ్లేషించండి",
    tamperProofQR: "Ed25519 సైలేజ్ ధృవీకరణ",
    scanSilageBale: "సైలేజ్ బేల్ QR స్కాన్ చేయండి",
    verifiedAuthentic: "ధృవీకరించబడిన సురక్షిత సైలేజ్",
    unverifiedWarning: "కల్తీ లేదా ప్రమాదకరమైన మేత హెచ్చరిక!",
    offlineModeActive: "100% ఆఫ్‌లైన్ విధానం",
    syncedSuccess: "విజయవంతంగా క్లౌడ్‌కి చేరింది"
  }
};

export const LANGUAGE_NAMES: Record<Language, { label: string; native: string }> = {
  en: { label: "English", native: "English" },
  hi: { label: "Hindi", native: "हिन्दी" },
  mr: { label: "Marathi", native: "मराठी" },
  ta: { label: "Tamil", native: "தமிழ்" },
  te: { label: "Telugu", native: "తెలుగు" }
};
