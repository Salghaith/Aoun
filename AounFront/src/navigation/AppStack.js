import React from 'react';
import {View, StyleSheet} from 'react-native';
import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import BottomNavWrapper from '../components/BottomNavWrapper'; // Custom nav handler
import ProfileScreen from '../screens/Profile';
import EditProfile from '../screens/EditProfile';
import CreateTask from '../screens/CreateTask';
import Tasks from '../screens/Tasks';
import GuestChatScreen from '../screens/GuestChatScreen';
import UserChatScreen from '../screens/UesrChatScreen';
import GenerateSchedule from '../screens/GenerateSchedule';
import AddSubjectManually from '../screens/AddSubjectManually';

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          transitionSpec: {
            open: TransitionSpecs.FadeInFromBottomAndroidSpec,
            close: TransitionSpecs.FadeOutToBottomAndroidSpec,
          },
          cardStyleInterpolator:
            CardStyleInterpolators.forFadeFromBottomAndroid,
        }}>
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="GuestChatScreen" component={GuestChatScreen} />
        <Stack.Screen name="UserChat" component={UserChatScreen} />
        <Stack.Screen name="GenerateSchedule" component={GenerateSchedule} />
        <Stack.Screen
          name="AddSubjectManually"
          component={AddSubjectManually}
        />
      </Stack.Navigator>
      <BottomNavWrapper />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
