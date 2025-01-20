import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  appId: 'com.lib.dev',
  appName: 'lib-movil',
  webDir: 'dist/lib-movil/browser',
  bundledWebRuntime: false,
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
