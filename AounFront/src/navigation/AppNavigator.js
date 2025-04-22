import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

export default function AppNavigator() {
  const {userData} = useContext(AuthContext);

  return userData ? <AppStack /> : <AuthStack />;
}
