import {NotificationProvider} from './src/context/NotificationContext';

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <SubjectProvider>
            <ScheduleProvider>
              <TaskProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </TaskProvider>
            </ScheduleProvider>
          </SubjectProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
