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

// const baseURL =  //For local testing
//   Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const baseURL = 'https://salghaith.online'; //For production
export const fetchBlackboardCalendarEvents = async (username, password) => {
  const response = await axios.post(`${baseURL}/api/calendar-events`, {
    username,
    password,
  });

  return response.data.events;
};

export const fetchSchedule = async (username, password) => {
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

export const importSchedule = async (
  userId,
  username,
  password,
  addSubject,
) => {
  try {
    const existingSchedule = await AsyncStorage.getItem('savedSchedule');
    if (existingSchedule) {
      throw new Error(
        'Please delete your existing schedule before importing a new one.',
      );
    }

    const schedule = await fetchSchedule(username, password);

    // Transform and save each subject
    for (const subject of schedule) {
      console.log('Subject:', subject);
      const {sectionNum, subjectCode, subjectName, lectures} = subject;
      if (!Array.isArray(lectures) || !lectures[0]?.startTime) continue;

      // Create the subject data structure
      const subjectData = {
        name: subjectName.trim(),
        code: subjectCode.trim() || null,
        final: null, // No final details in the imported schedule
        sections: {
          [sectionNum]: {
            lectures: lectures.map(lecture => ({
              day: lecture.day,
              startTime: lecture.startTime,
              endTime: lecture.endTime,
            })),
          },
        },
        createdAt: new Date().toISOString(),
        userId: userId,
      };

      // Save the subject using addSubject
      await addSubject(subjectData);
    }

    // Save the complete schedule in AsyncStorage
    await AsyncStorage.setItem(
      'savedSchedule',
      JSON.stringify({
        schedule,
        createdAt: new Date().toISOString(),
        userId: userId,
      }),
    );

    // Save the complete schedule in Firestore
    await firestore().collection('schedules').add({
      schedule,
      createdAt: new Date().toISOString(),
      userId: userId,
    });

    return schedule;
  } catch (error) {
    console.error('❌ Failed to import schedule:', error);
    throw error;
  }
};
