import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider, AuthProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppNavigation />
      </DataProvider>
    </AuthProvider>
  );
}
