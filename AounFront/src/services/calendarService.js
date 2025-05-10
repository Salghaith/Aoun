import axios from 'axios';
import {Platform} from 'react-native';
import {saveTask} from './taskService';
import {scheduleNotification} from './notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

export const importCalendarTasks = async (userId, username, password) => {
  try {
    const events = await fetchBlackboardCalendarEvents(username, password);

    for (const event of events) {
      const start = new Date(event.start);
      const end = new Date(event.end);

      const task = {
        id: `cal_${event.id}`,
        title: event.title,
        description: event.description || '',
        date: start.toISOString().split('T')[0],
        startTime: start.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        endTime: end.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
        priority: 'medium',
        completed: false,
      };

      await saveTask(task, userId);
      scheduleNotification(task);
    }
  } catch (err) {
    console.error('❌ Failed to import calendar events:', err);
  }
};

const baseURL =
  Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
export const fetchBlackboardCalendarEvents = async (username, password) => {
  //Need to encrypt the password before sending it to the server.
  const response = await axios.post(`${baseURL}/api/calendar-events`, {
    username,
    password,
  });

  return response.data.events;
};






export const fetchSchedule = async (username, password) => {
  //Need to encrypt the password before sending it to the server.
  try {
    const response = await axios.post(`${baseURL}/api/fetch-schedule`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(
      '❌ Failed to fetch schedule:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};
export const importSchedule = async (userId, username, password) => {
  try {
    // Fetch the schedule
    const schedule = await fetchSchedule(username, password);

    // Save the schedule to local storage
    await AsyncStorage.setItem('schedule', JSON.stringify(schedule));

    // Save the schedule to Firestore
    await firestore().collection('schedules').add({
      schedule,
      createdAt: new Date().toISOString(),
      userId: userId,
    });
  } catch (error) {
    console.error('❌ Failed to import schedule:', error);
    throw error;
  }
};
