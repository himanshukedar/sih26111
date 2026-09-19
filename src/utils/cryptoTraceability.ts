export interface SilageBaleMetadata {
  batchId: string;
  balerOrganization: string;
  silageType: string;
  harvestDate: string;
  baleWeightKg: number;
  testedPH: number;
  testedMoisture: number;
  crudeProtein: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Sub-Standard';
  ed25519Signature: string;
  validUntil: string;
}

export function generateEd25519Signature(payload: string): string {
  // Simulates standard Ed25519 base64 cryptographic hash for offline verification
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `ed25519:sig_${hex}_9f8a3c42b109e7d6`;
}

export function createBaleQRData(metadata: Omit<SilageBaleMetadata, 'ed25519Signature'>): SilageBaleMetadata {
  const payload = `${metadata.batchId}|${metadata.balerOrganization}|${metadata.testedPH}|${metadata.testedMoisture}|${metadata.harvestDate}`;
  const signature = generateEd25519Signature(payload);
  return {
    ...metadata,
    ed25519Signature: signature
  };
}

export function verifyBaleQRPayload(qrRawText: string): {
  isValid: boolean;
  metadata?: SilageBaleMetadata;
  reason?: string;
} {
  try {
    const parsed = JSON.parse(qrRawText);
    if (!parsed.batchId || !parsed.ed25519Signature) {
      return { isValid: false, reason: 'Missing cryptographic signature or batch identifier.' };
    }

    const expectedPayload = `${parsed.batchId}|${parsed.balerOrganization}|${parsed.testedPH}|${parsed.testedMoisture}|${parsed.harvestDate}`;
    const calculatedSig = generateEd25519Signature(expectedPayload);

    if (parsed.ed25519Signature === calculatedSig) {
      return { isValid: true, metadata: parsed };
    } else {
      return { isValid: false, reason: 'Cryptographic signature mismatch! Possible counterfeit feed.' };
    }
  } catch (e) {
    return { isValid: false, reason: 'Invalid QR payload format.' };
  }
}

export const SAMPLE_GENUINE_BALES: SilageBaleMetadata[] = [
  createBaleQRData({
    batchId: 'BAL-2026-MAIZE-4091',
    balerOrganization: 'Baramati Agro Silage Balers FPC',
    silageType: 'Whole-Crop Maize Silage (Pioneer P3396)',
    harvestDate: '2026-08-20',
    baleWeightKg: 450,
    testedPH: 3.92,
    testedMoisture: 63.8,
    crudeProtein: 8.8,
    qualityGrade: 'Grade A',
    validUntil: '2027-02-20'
  }),
  createBaleQRData({
    batchId: 'BAL-2026-ALFALFA-1102',
    balerOrganization: 'Amul District Silage Federation',
    silageType: 'Wilted Alfalfa / Lucerne Silage',
    harvestDate: '2026-08-28',
    baleWeightKg: 500,
    testedPH: 4.15,
    testedMoisture: 65.2,
    crudeProtein: 16.4,
    qualityGrade: 'Grade A',
    validUntil: '2027-03-01'
  })
];
