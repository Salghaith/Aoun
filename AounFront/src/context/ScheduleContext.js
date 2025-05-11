import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from './AuthContext';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({children}) => {
  const [schedule, setSchedule] = useState(null);
  const {userData} = useContext(AuthContext);

  const loadSchedule = async () => {
    try {
      // First try to load from local storage
      const savedSchedule = await AsyncStorage.getItem('savedSchedule');
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        setSchedule(parsedSchedule.schedule);
        console.log('✅ Schedule loaded from local storage');
        return;
      }

      // If not in local storage and user is logged in, fetch from Firestore
      if (userData?.userId) {
        const snapshot = await firestore()
          .collection('schedules')
          .where('userId', '==', userData.userId)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const firestoreSchedule = snapshot.docs[0].data();
          // Save to local storage
          await AsyncStorage.setItem(
            'savedSchedule',
            JSON.stringify(firestoreSchedule),
          );
          setSchedule(firestoreSchedule.schedule);
          console.log('✅ Schedule loaded from Firestore');
        } else {
          setSchedule(null);
          console.log('⚠️ No saved schedule found');
        }
      }
    } catch (error) {
      console.error('❌ Failed to load schedule:', error);
      setSchedule(null);
    }
  };

  const saveSchedule = async newSchedule => {
    try {
      const scheduleData = {
        schedule: newSchedule,
        createdAt: new Date().toISOString(),
        userId: userData.userId,
      };

      // Save to local storage
      await AsyncStorage.setItem('savedSchedule', JSON.stringify(scheduleData));

      // Save to Firestore
      await firestore().collection('schedules').add(scheduleData);

      setSchedule(newSchedule);
      console.log('✅ Schedule saved successfully');
    } catch (error) {
      console.error('❌ Failed to save schedule:', error);
      throw error;
    }
  };

  const deleteSchedule = async () => {
    try {
      // Remove from local storage
      await AsyncStorage.removeItem('savedSchedule');
      setSchedule(null);

      // Remove from Firestore
      if (userData?.userId) {
        const snapshot = await firestore()
          .collection('schedules')
          .where('userId', '==', userData.userId)
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const docId = snapshot.docs[0].id;
          await firestore().collection('schedules').doc(docId).delete();
          console.log('✅ Schedule deleted from Firestore');
        }
      }

      console.log('✅ Schedule deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete schedule:', error);
      throw error;
    }
  };

  // Load schedule when user data changes (login/logout)
  useEffect(() => {
    if (userData?.userId) {
      loadSchedule();
    } else {
      setSchedule(null);
    }
  }, [userData]);

  return (
    <ScheduleContext.Provider
      value={{
        schedule,
        saveSchedule,
        deleteSchedule,
        loadSchedule,
      }}>
      {children}
    </ScheduleContext.Provider>
  );
};
