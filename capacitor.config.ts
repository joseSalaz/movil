import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {

  appId: 'com.lib.dev',
  appName: 'Libreria Saber app',
  webDir: 'dist/lib-movil/browser',
  
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
