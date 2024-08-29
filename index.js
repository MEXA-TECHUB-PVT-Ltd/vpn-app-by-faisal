// /**
//  * @format
//  */
// import 'react-native-gesture-handler';
// import {AppRegistry, Platform} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
// import PushNotification from 'react-native-push-notification';
// import TrackPlayer, {Capability} from 'react-native-track-player';

// import {navigationRef} from './RootNavigation';

// PushNotification.configure({
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function (token) {
//     console.log('TOKEN:', token);
//   },
//   // (required) Called when a remote is received or opened, or local notification is opened
//   onNotification: function (notification) {
//     let data = notification?.data;
//     console.log('data ::::: ', data);
//     if (notification?.userInteraction) {
//       navigationRef?.current?.navigate('NotificationStackScreens', {
//         data,
//       });
//     }
//   },
//   requestPermissions: Platform.OS === 'ios',
// });

// AppRegistry.registerComponent(appName, () => App);



/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
