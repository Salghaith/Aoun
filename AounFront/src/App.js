import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import {AuthProvider} from './context/AuthContext';
import {ThemeProvider} from './context/ThemeContext';
import {SubjectProvider} from './context/SubjectContext';
import {ScheduleProvider} from './context/ScheduleContext';
import {NotificationProvider} from './context/NotificationContext';

const App = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ThemeProvider>
          <NotificationProvider>
            <SubjectProvider>
              <ScheduleProvider>
                <AppNavigator />
              </ScheduleProvider>
            </SubjectProvider>
          </NotificationProvider>
        </ThemeProvider>
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
