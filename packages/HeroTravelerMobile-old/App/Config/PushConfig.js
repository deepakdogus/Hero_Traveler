import PushNotification from 'react-native-push-notification'
import { Actions as NavActions } from 'react-native-router-flux'

let token = null

// https://github.com/zo0r/react-native-push-notification
PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: (deviceToken) => {
    if (__DEV__) console.log('TOKEN:', deviceToken)
    token = deviceToken
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: (notification) => {
    if (__DEV__) console.log('NOTIFICATION:', notification)

    // It would be better to also check for !notification.foreground 
    // but the way React Native handles resuming the application makes
    // weird combinations happen there.
    if (notification.userInteraction) {
      // Reset the notification counts.
      PushNotification.setApplicationIconBadgeNumber(0);
      // Reset the notification counts.
      NavActions.activity();
    }
  },

  // ANDROID ONLY: (optional) GCM Sender ID.
  senderID: 'YOUR GCM SENDER ID',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  // Leave this off unless you have good reason.
  popInitialNotification: true,

  /**
    * IOS ONLY: (optional) default: true
    * - Specified if permissions will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    * This example app shows how to best call requestPermissions() later.
    */
  requestPermissions: true
})

export function getToken(){
  return token
}
