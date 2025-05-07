import axios from 'axios';
import {Platform} from 'react-native';
import {saveTask} from './taskService';
import {scheduleNotification} from './notificationService';

export const importCalendarTasks = async (userId, username, password) => {
  console.log('🔥 syncing calendar tasks...', {userId, username, password});

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

    console.log('✅ Calendar tasks synced');
  } catch (err) {
    console.error('❌ Failed to import calendar events:', err);
  }
};

const baseURL =
  Platform.OS == 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
export const fetchBlackboardCalendarEvents = async (username, password) => {
  const response = await axios.post(`${baseURL}/api/calendar-events`, {
    username,
    password,
  });

  return response.data.events;
};
