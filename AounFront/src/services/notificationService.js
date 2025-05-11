import PushNotification from 'react-native-push-notification';
import {PermissionsAndroid, Platform} from 'react-native';

// 🔹 Configure Push Notifications (Only Once)
const configureNotifications = () => {
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
    id: task.id,
  });

  console.log('✅ Local notification scheduled for:', dueDate);
};
const cancelNotification = taskId => {
  PushNotification.cancelLocalNotifications({id: taskId});
  console.log(`❌ Notification with ID ${taskId} canceled.`);
};

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Notification permission denied!');
    } else {
      console.log('Notification permission granted!');
    }
  }
}

export {
  configureNotifications,
  scheduleNotification,
  requestNotificationPermission,
  cancelNotification,
};
