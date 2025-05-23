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
import UserChatScreen from '../screens/UesrChatScreen';
import GenerateSchedule from '../screens/GenerateSchedule';
import AddSubjectManually from '../screens/AddSubjectManually';
import ScheduleFilter from '../screens/ScheduleFilter';
import HomeScreen from '../screens/HomeScreen';
import MatchingSchedules from '../screens/MatchingSchedules';
import SchedulePreviewScreen from '../screens/SchedulePreviewScreen';
import MyScheduleScreen from '../screens/MyScheduleScreen';

const Stack = createStackNavigator();
//
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
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="CreateTask"
          component={CreateTask}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen name="Tasks" component={Tasks} />
        <Stack.Screen name="UserChat" component={UserChatScreen} />
        <Stack.Screen name="GenerateSchedule" component={GenerateSchedule} />
        <Stack.Screen
          name="AddSubjectManually"
          component={AddSubjectManually}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="ScheduleFilter"
          component={ScheduleFilter}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="MatchingSchedules"
          component={MatchingSchedules}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="SchedulePreviewScreen"
          component={SchedulePreviewScreen}
          options={{
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="MyScheduleScreen"
          component={MyScheduleScreen}
          options={{
            gestureEnabled: true,
          }}
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
