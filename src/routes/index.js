/** @format */

import App from './Appflow';
import AuthApp from './Authflow';
import {EventRegister} from 'react-native-event-listeners';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import themeContext from '../assets/config/themeContext';
import theme from '../assets/config/theme';
import {Provider} from 'react-redux';
import {Store} from '../redux/store';

import React, {useState, useEffect} from 'react';
import {Linking, AppState, Text, useColorScheme} from 'react-native';

import {EditProfile} from '../screens';

import deepLinking from '../../deepLinking';
import DeepLinking from 'react-native-deep-linking';
import {navigationRef} from '../../RootNavigation';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import {setIsDarkMode} from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppStack = createStackNavigator();
const AppNavigation = () => {
  // useEffect(()=>{
  //   let eventListener = EventRegister.addEventListener("changeTheme",(data)=>
  //   {
  //   setMode(data)
  // console.log(data)});
  //   return()=>{
  //     EventRegister.removeAllListeners(eventListener)
  //   }
  // })

  const [initialised, setInitialised] = useState(false);

  const handleDynamicLink = link => {
    console.log('link  : ', link?.url);
    let url = link?.url;
    let path = '';
    let parameters = '';
    if (url) {
      const route = url?.replace(/.*?:\/\//g, '');
      console.log('route get from dynamic link is : ', route);
      let url_split = url?.split('?');
      path = url_split[0];
      parameters = url_split[1];
    }
    console.log('path  : ', path);
    console.log('paramaters : ', parameters);
    // Handle dynamic link inside your own application
    if (path === 'https://fortydayschallenge.page.link/MyChallenges') {
      // ...navigate to your offers screen
      // alert('matched...s');

      console.log('parameters.uniq_id : ');
      navigationRef?.current?.navigate('ChallengeName', {
        uniq_id: parameters,
      }); // My_Challenges
    } else {
      console.log('not matched.....');
    }
  };

  //Foreground State
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  //if application is in background or fully quit mode
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        console.log(
          'background state execute : .....................................................',
        );
        handleDynamicLink(link);
      });
  }, []);

  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange);
  //   if (Linking.getInitialURL() !== null) {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   }
  // }, []);
  const handleAppStateChange = async event => {
    const initial = await Linking.getInitialURL();

    if (initial !== null && !initialised) {
      setInitialised(true);
      // app was opened by a Universal Link
      // custom setup dependant on URL...
    }
  };

  // useEffect(() => {
  //   // Get the deep link used to open the app
  //   const getUrl = async () => {
  //     const universalLink = await Linking.getInitialURL();

  //     console.log('universalLink ::::  ', universalLink);
  //     //handle universal link
  //   };

  //   getUrl();
  // });

  // useEffect(() => {
  //   console.log('useeffect :::....');
  //   DeepLinking.addScheme('demo://');
  //   Linking.openURL('demo://app');
  //   Linking.addEventListener('url', handleUrl);

  //   DeepLinking.addRoute('/app', response => {
  //     // example://test
  //     console.log('response deep linking :::   ', response);
  //   });

  //   Linking.getInitialURL()
  //     .then(url => {
  //       if (url) {
  //         console.log('url', url);
  //         Linking.openURL(url);
  //       }
  //     })
  //     .catch(err => console.error('An error occurred', err));

  //   let handleUrl = ({url}) => {
  //     Linking.canOpenURL(url).then(supported => {
  //       console.log('supported', supported);
  //       if (supported) {
  //         DeepLinking.evaluateUrl(url);
  //       }
  //     });
  //   };
  //   return () => Linking.removeEventListener('url', handleUrl);
  // }, [AppState]);

  const config = {
    screens: {
      EditProfile: {
        path: 'EditProfile',
      },
    },
  };

  // const dispatch = useDispatch();
  let isDarkMode = useColorScheme() == 'dark';
  // const [prevState, setPrevState] = useState('');
  // useEffect(() => {
  //   handleThemeChange();
  //   // console.log('AppState : ', AppState.currentState);
  //   // AppState.addEventListener('change', handleThemeChange);
  // }, [isDarkMode]);

  // useEffect(() => {
  //   const appStateListener = AppState.addEventListener(
  //     'change',
  //     nextAppState => {
  //       console.log('Next AppState is: ', nextAppState);
  //       handleAppStateChange1(nextAppState);
  //     },
  //   );
  //   return () => {
  //     appStateListener?.remove();
  //   };
  // }, []);
  // const handleAppStateChange1 = async nextAppState => {
  //   await AsyncStorage.setItem('prevState', nextAppState);
  // };

  const handleThemeChange = async () => {
    let isFirst = await AsyncStorage.getItem('isFirst');
    let prevState = await AsyncStorage.getItem('prevState');

    if (!isFirst) {
      Store.dispatch(setIsDarkMode(isDarkMode));
      await AsyncStorage.setItem('isDarkMode', isDarkMode?.toString());
      await AsyncStorage.setItem('isFirst', 'true');
    } else {
      // if (AppState.currentState == 'active') {
      //   dispatch(setIsDarkMode(isDarkMode));
      //   await AsyncStorage.setItem('isDarkMode', isDarkMode?.toString());
      // }
      // -------------------------------
      if (
        prevState?.toString()?.match(/inactive|background/) &&
        AppState.currentState === 'active'
      ) {
        console.log('App opened from the background');
      } else {
        console.log('prevstate : ', prevState);

        Store.dispatch(setIsDarkMode(isDarkMode));
        await AsyncStorage.setItem('isDarkMode', isDarkMode?.toString());
      }
      // --------------------------------
    }

    await AsyncStorage.setItem('prevState', AppState.currentState);
  };

  const Test = () => {
    return <Text>TEst</Text>;
  };
  return (
    <Provider store={Store}>
      <NavigationContainer
        ref={navigationRef}
        // linking={deepLinking}
        linking={{
          prefixes: ['demo://app'],
          // prefixes: ['http://disciplineguru.co'],
          config,
        }}>
        <AppStack.Navigator screenOptions={{headerShown: false}}>
          {/* <AppStack.Screen name={'Test'} component={Test} /> */}

          <AppStack.Screen name={'AuthApp'} component={AuthApp} />
          <AppStack.Screen name={'App'} component={App} />
          <AppStack.Screen name={'EditProfile'} component={EditProfile} />
        </AppStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigation;
