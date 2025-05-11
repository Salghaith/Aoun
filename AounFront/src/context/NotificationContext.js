import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationContext = createContext();

const NOTIFICATION_PREFERENCE_KEY = '@notification_preference';

export const NotificationProvider = ({children}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    // Load saved preference when the app starts
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const savedPreference = await AsyncStorage.getItem(
        NOTIFICATION_PREFERENCE_KEY,
      );
      if (savedPreference !== null) {
        setNotificationsEnabled(JSON.parse(savedPreference));
      }
    } catch (error) {
      console.error('Error loading notification preference:', error);
    }
  };

  const toggleNotifications = async value => {
    try {
      setNotificationsEnabled(value);
      await AsyncStorage.setItem(
        NOTIFICATION_PREFERENCE_KEY,
        JSON.stringify(value),
      );
    } catch (error) {
      console.error('Error saving notification preference:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notificationsEnabled,
        toggleNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider',
    );
  }
  return context;
};
