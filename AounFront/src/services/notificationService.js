import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

// 🔹 Configure Push Notifications (Only Once)
const configureNotifications = () => {
  PushNotification.configure({
    onRegister: function (token) {
      console.log('✅ FCM Token:', token);
    },
    onNotification: function (notification) {
      console.log('🚀 Notification Received:', notification);
    },
    requestPermissions: Platform.OS === 'ios', // Prevents issue on Android
  });

  PushNotification.createChannel(
    {
      channelId: 'task-reminders',
      channelName: 'Task Reminders',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`✅ Notification channel created: ${created}`),
  );
};

// 🔹 Schedule Local Notification
const scheduleNotification = task => {
  const dueDate = new Date(task.date + ' ' + task.startTime);

  PushNotification.localNotificationSchedule({
    channelId: 'task-reminders',
    title: 'Task Reminder',
    message: `Your task "${task.title}" is due now!`,
    date: dueDate,
    allowWhileIdle: true,
  });

  console.log('✅ Local notification scheduled for:', dueDate);
};

export {configureNotifications, scheduleNotification};
