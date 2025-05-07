import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import SplashScreen from '../screens/SplashScreen';
import {getData, removeData} from '../utils/storageUtils';
import {auth} from '../config/firebaseConfig';
import i18n from '../i18n';
import {TaskProvider} from '../context/TaskContext';

export default function AppNavigator() {
  const {userData, updateUserData} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedLang = await getData('userLanguage');
      if (savedLang) await i18n.changeLanguage(savedLang);

      const storedUserData = await getData('userData');

      if (storedUserData && storedUserData.rememberMe) {
        const currentUser = auth.currentUser;

        if (currentUser) {
          try {
            storedUserData.userToken = await currentUser.getIdToken(true);
            await updateUserData(storedUserData);
          } catch (error) {
            console.log('❌ Error refreshing token:', error);
            await removeData('userData');
            await updateUserData(null);
          }
          setIsLoading(false);
        } else {
          const unsubscribe = auth.onAuthStateChanged(async user => {
            if (user) {
              try {
                storedUserData.userToken = await user.getIdToken(true);
                await updateUserData(storedUserData);
              } catch (error) {
                console.log('❌ Error refreshing token (listener):', error);
                await removeData('userData');
                await updateUserData(null);
              }
            } else {
              await removeData('userData');
              await updateUserData(null);
            }
            setIsLoading(false);
            unsubscribe();
          });
        }
      } else {
        await removeData('userData');
        await updateUserData(null);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return userData ? (
    <TaskProvider userId={userData.userId}>
      <AppStack />
    </TaskProvider>
  ) : (
    <AuthStack />
  );
}
