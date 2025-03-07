import React from 'react';

import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext'; // Import ThemeProvider
import {configureNotifications} from './services/notificationService';

configureNotifications();
const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
