import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgetPass from '../screens/ForgetPass';
import ProfileScreen from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import CreateTask from '../screens/CreateTask'; 
import Tasks from '../screens/Tasks';
import GuestChatScreen from '../screens/GuestChatScreen';
import UesrChatScreen from '../screens/UesrChatScreen'; // ✅ Added UserChatScreen
import GenerateSchedule from '../screens/GenerateSchedule'; // ✅ Added GenerateSchedule
import AddSubjectManually from '../screens/AddSubjectManually';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ForgetPass" component={ForgetPass} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="Tasks" component={Tasks} />  
        
        {/* ✅ Chat Screens */}
        <Stack.Screen name="GuestChatScreen" component={GuestChatScreen}/>  
        <Stack.Screen name="UserChat" component={UesrChatScreen}/>  

        <Stack.Screen name='GenerateSchedule' component={GenerateSchedule}/> 
        <Stack.Screen name='AddSubjectManually' component={AddSubjectManually}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
