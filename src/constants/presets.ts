import { SilagePreset } from '../types';

export const SILAGE_PRESETS: SilagePreset[] = [
  {
    id: 'corn_optimal',
    name: 'Optimal Corn Silage (Grade A)',
    category: 'Whole-Plant Maize',
    description: 'Fresh lactic acid fermentation, sweet aroma, ideal pH and dry matter. Optimal for milk yields.',
    sampleImage: 'corn_silage_clean',
    probe: {
      pH: 3.9,
      moisture: 63.5,
      temperature: 23.2
    },
    vision: {
      moldPercentage: 1.2,
      ureaAdulterationEst: 0.0,
      colorScore: 94,
      textureQuality: 'Optimal Lactic'
    }
  },
  {
    id: 'high_mold_spoilage',
    name: 'Aerobic Mold Spoilage (Slide 4 Sample)',
    category: 'Exposed Bunk Silage',
    description: 'High fungal growth, aerobic warming, white/grey mycotoxin mold clusters. Exact match to SIH Slide 4.',
    sampleImage: 'corn_silage_mold',
    probe: {
      pH: 6.8,
      moisture: 72.0,
      temperature: 26.5
    },
    vision: {
      moldPercentage: 78.0,
      ureaAdulterationEst: 0.2,
      colorScore: 32,
      textureQuality: 'Fungal Rotten'
    }
  },
  {
    id: 'urea_poisoning_hazard',
    name: 'Urea-Adulterated Cattle Feed',
    category: 'Commercial Compound Feed',
    description: 'Toxic non-protein nitrogen (NPN) spikes. Detected crystalline urea speckles exceeding safety limit.',
    sampleImage: 'urea_contaminated_feed',
    probe: {
      pH: 5.2,
      moisture: 58.4,
      temperature: 24.1
    },
    vision: {
      moldPercentage: 3.5,
      ureaAdulterationEst: 0.85, // >= 0.5% safety lockout invariant!
      colorScore: 68,
      textureQuality: 'Granular Adulterated'
    }
  },
  {
    id: 'clostridial_rotting',
    name: 'Clostridial Wet Rot Silage',
    category: 'Wet Pit Silage',
    description: 'Butyric fermentation caused by excess water and low lactic acidity. Pungent rancid odor.',
    sampleImage: 'clostridial_spoilage',
    probe: {
      pH: 5.4,
      moisture: 76.5,
      temperature: 31.0
    },
    vision: {
      moldPercentage: 18.5, // >= 15% lockout!
      ureaAdulterationEst: 0.04,
      colorScore: 40,
      textureQuality: 'Slimy Decay'
    }
  },
  {
    id: 'early_aerobic_caution',
    name: 'Bunker Edge (Early Ferment Imbalance)',
    category: 'Open Bunker Surface',
    description: 'Mild surface warming, moisture near upper threshold. Actionable management can prevent deep spoilage.',
    sampleImage: 'bunker_caution',
    probe: {
      pH: 4.6,
      moisture: 69.2,
      temperature: 28.4
    },
    vision: {
      moldPercentage: 7.8,
      ureaAdulterationEst: 0.08,
      colorScore: 72,
      textureQuality: 'Mild Heating'
    }
  }
];
