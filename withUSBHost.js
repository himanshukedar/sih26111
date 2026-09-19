const { withAndroidManifest } = require('@expo/config-plugins');

const withUSBHost = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;

    // Ensure uses-feature exists
    if (!androidManifest['uses-feature']) {
      androidManifest['uses-feature'] = [];
    }

    // Add USB host feature if not already present
    const hasUSBHost = androidManifest['uses-feature'].some(
      (feature) => feature.$['android:name'] === 'android.hardware.usb.host'
    );

    if (!hasUSBHost) {
      androidManifest['uses-feature'].push({
        $: {
          'android:name': 'android.hardware.usb.host',
          'android:required': 'false', // Keep false so the app can still launch if hardware isn't connected
        },
      });
    }

    return config;
  });
};

module.exports = withUSBHost;
