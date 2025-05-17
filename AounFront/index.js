/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {configureNotifications, requestNotificationPermission} from './src/services/notificationService';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

// Must be outside of any component LifeCycle (such as componentDidMount).
PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  //   popInitialNotification: true,

  requestPermissions: Platform.OS === 'ios',
});
configureNotifications();
requestNotificationPermission();
AppRegistry.registerComponent(appName, () => App);
