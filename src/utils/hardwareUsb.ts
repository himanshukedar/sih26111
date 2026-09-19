import { Platform } from 'react-native';

// Try to import the native module. This will fail on web/iOS, so we wrap it in a try-catch or conditionally import it.
let UsbSerialManager: any = null;
let UsbSerial: any = null;

if (Platform.OS === 'android') {
  try {
    const SerialModule = require('react-native-usb-serialport-for-android');
    UsbSerialManager = SerialModule.UsbSerialManager;
    UsbSerial = SerialModule.UsbSerial;
  } catch (e) {
    console.warn("USB Serial Module not available. Ensure you are running a custom development client.");
  }
}

export type HardwareDataPayload = {
  ph?: number;
  moisture?: number;
  temperature?: number;
};

export class HardwareUSBService {
  private static device: any = null;
  private static isConnected: boolean = false;
  private static onDataCallback: ((data: HardwareDataPayload) => void) | null = null;
  private static simulatedInterval: NodeJS.Timeout | null = null;

  static async connect(baudRate: number = 9600): Promise<boolean> {
    if (Platform.OS !== 'android' || !UsbSerialManager) {
      console.log('USB Serial is only supported on Android with native module. Using simulator mode.');
      return this.startSimulation();
    }

    try {
      const devices = await UsbSerialManager.list();
      if (!devices || devices.length === 0) {
        throw new Error('No USB devices found.');
      }

      // Automatically connect to the first available device (likely the probe)
      const deviceInfo = devices[0];
      const hasPermission = await UsbSerialManager.tryRequestPermission(deviceInfo.deviceId);
      
      if (!hasPermission) {
        throw new Error('USB permission denied.');
      }

      this.device = await UsbSerialManager.open(deviceInfo.deviceId, {
        baudRate: baudRate,
        parity: UsbSerial.PARITY_NONE,
        dataBits: UsbSerial.DATA_BITS_8,
        stopBits: UsbSerial.STOP_BITS_1,
      });

      this.isConnected = true;
      console.log('Connected to USB device:', deviceInfo);

      this.device.on('data', (hexData: string) => {
        // Data usually comes in as hex string, decode it
        const decodedString = this.hexToString(hexData);
        this.processIncomingData(decodedString);
      });

      return true;
    } catch (error) {
      console.error('Hardware connection failed:', error);
      return false;
    }
  }

  static async disconnect(): Promise<void> {
    if (this.simulatedInterval) {
      clearInterval(this.simulatedInterval);
      this.simulatedInterval = null;
    }
    
    if (this.device && this.isConnected) {
      try {
        await this.device.close();
      } catch (e) {
        console.error('Error closing device', e);
      }
      this.device = null;
      this.isConnected = false;
    }
  }

  static onData(callback: (data: HardwareDataPayload) => void) {
    this.onDataCallback = callback;
  }

  private static processIncomingData(dataStr: string) {
    try {
      // Assuming the hardware sends JSON: {"ph": 4.0, "moisture": 65, "temperature": 28}
      const data = JSON.parse(dataStr.trim()) as HardwareDataPayload;
      if (this.onDataCallback) {
        this.onDataCallback(data);
      }
    } catch (e) {
      // If it's not JSON, it might be comma separated or just chunked incorrectly
      console.warn('Received unparseable data from hardware:', dataStr);
    }
  }

  private static hexToString(hex: string) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  // --- Fallback Simulation for Web/iOS ---
  private static startSimulation(): boolean {
    console.log('Starting hardware simulator (Web/iOS fallback)');
    this.isConnected = true;
    
    // Simulate data arriving every 2 seconds
    this.simulatedInterval = setInterval(() => {
      if (this.onDataCallback) {
        // Generate random realistic readings
        this.onDataCallback({
          ph: parseFloat((3.8 + Math.random() * 0.5).toFixed(2)),
          moisture: Math.floor(60 + Math.random() * 10),
          temperature: Math.floor(20 + Math.random() * 15),
        });
      }
    }, 2000);
    
    return true;
  }
}
