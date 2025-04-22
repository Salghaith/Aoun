import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
