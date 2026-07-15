import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {configureHttpClient, mockAdapter} from 'shared-rn';
import {AppNavigator} from './src/navigation/AppNavigator';

configureHttpClient({
  adapter: mockAdapter,
  getAuthToken: async () => null,
  defaultHeaders: {
    'X-App': 'microapp-main-app-rn',
  },
});

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
