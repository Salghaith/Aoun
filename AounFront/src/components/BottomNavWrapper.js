import React from 'react';
import {useNavigationState} from '@react-navigation/native';
import BottomNav from './BottomNav';

export default function BottomNavWrapper() {
  try {
    const state = useNavigationState(state => state);
    const routeName = state?.routes[state.index]?.name || '';

    const hideOnScreens = ['EditProfile', 'CreateTask', 'AddSubjectManually'];

    if (hideOnScreens.includes(routeName)) return null;

    return <BottomNav activeTab={routeName} />;
  } catch (e) {
    return null; // Prevent crashes before navigation is ready
  }
}
