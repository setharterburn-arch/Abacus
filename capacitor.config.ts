import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.abacuslearn.app',
    appName: 'Abacus Learn',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#fef3c7",
            showSpinner: false
        }
    }
};

export default config;
