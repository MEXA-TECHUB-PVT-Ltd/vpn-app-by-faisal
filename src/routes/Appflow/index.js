import {
  GoodMorning,
  ChallengeName,
  ChallengeList,
  Profile,
  AddChallenge,
  UpdateChallenge,
  Notifications,
  Inspirationalspeeches,
  AudioPlayer,
  HiddenChallenges,
  EditProfile,
  Tasks,
  My_Challenges,
  DailyJournal,
  CommunityChallenges,
  LikedChallenges,
  Motivational_Qoutes,
  ActiveChallenges,
  Books,
  CommunityChallengeView,
  EditAvatar,
  Wallpapers,
  Backup,
  BackupAndRestore,
  FirstGoodMorning,
  To_do_list,
  Article,
  ArticleDetail,
  Book_Name_here,
  Calander,
  WriteNotes,
  UpdateJournal,
  Challenge_Date,
} from '../../screens';
import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {appImages} from '../../assets/utilities';
import {
  StyleSheet,
  View,
  Text,
  Image,
  useColorScheme,
  AppState,
} from 'react-native';
import Customtabbar from '../Customtabbar';
import FastImage from 'react-native-fast-image';
import {fontFamily} from '../../constants/fonts';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Introduction from '../../NewScreens/Introduction';
import Start from '../../NewScreens/Start';
import CustomDrawer from '../CustomDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setIsDarkMode} from '../../redux/actions';
import CompletedChallenges from '../../screens/Appflow/CompletedChallenges.js';
global.url = 'http://206.189.192.112:3000/';
const styles = StyleSheet.create({
  mainbottom: {
    height: responsiveHeight(9),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  imgstyle1: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
  },
  imgstyle2: {
    width: responsiveWidth(5.5),
    height: responsiveWidth(5.5),
    // backgroundColor: 'red',
  },
  pinkcontainer: {
    backgroundColor: '#CA6FE4',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    // width: responsiveWidth(30),
    borderRadius: responsiveWidth(100),
  },
  pinkcontainer2: {
    backgroundColor: '#CA6FE4',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingVertical: responsiveHeight(0.1),
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    // width: responsiveWidth(30),
    borderRadius: responsiveWidth(100),
  },
  txt: {
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Poppins_Regular,
    marginBottom: responsiveHeight(-0.6),
  },
});
const AppStack = createStackNavigator();
const TabStack = createBottomTabNavigator();
const MusicTabStack = createStackNavigator();
const NotificationTabStack = createStackNavigator();
const ProfileTabStack = createStackNavigator();
const AddTabStack = createStackNavigator();
const MyDrawerStack = createDrawerNavigator();
const Stack = createStackNavigator();

const MusicTab = () => {
  return (
    <MusicTabStack.Navigator screenOptions={{headerShown: false}}>
      <MusicTabStack.Screen name={'Inspirationalspeeches'} component={Inspirationalspeeches} />
    </MusicTabStack.Navigator>
  );
};
const NotificationTab = () => {
  return (
    <NotificationTabStack.Navigator screenOptions={{headerShown: false}}>
      <NotificationTabStack.Screen
        name={'Notifications'}
        component={Notifications}
      />
    </NotificationTabStack.Navigator>
  );
};
const ProfileTab = () => {
  return (
    <ProfileTabStack.Navigator screenOptions={{headerShown: false}}>
      <ProfileTabStack.Screen name={'Profile'} component={Profile} />
    </ProfileTabStack.Navigator>
  );
};
const AddTab = () => {
  return (
    <AddTabStack.Navigator screenOptions={{headerShown: false}}>
      <AddTabStack.Screen name={'AddChallenge'} component={AddChallenge} />
    </AddTabStack.Navigator>
  );
};

const Tab = props => {
  return (
    <TabStack.Navigator
      tabBar={props => <Customtabbar {...props} />}
      initialRouteName={'GoodMorning'}
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <TabStack.Screen name={'GoodMorning'} component={GoodMorning} />
      <TabStack.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              {focused ? (
                <View style={styles.pinkcontainer2}>
                  <View
                    style={{
                      alignItems: 'center',
                      marginRight: responsiveWidth(3),
                    }}>
                    <Text style={styles.txt}>Relaxing</Text>
                    <Text
                      style={[styles.txt, {marginTop: responsiveHeight(-1)}]}>
                      Music
                    </Text>
                  </View>
                  <FastImage
                    source={appImages.pinkchallengetab}
                    style={styles.imgstyle2}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <FastImage
                  source={appImages.relaxingtab}
                  style={styles.imgstyle1}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
        name="MusicStackScreens"
        component={MusicTab}
      />
      <TabStack.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {focused ? (
                <View style={styles.pinkcontainer}>
                  <Text style={[styles.txt, {marginRight: responsiveWidth(2)}]}>
                    Notification
                  </Text>
                  <FastImage
                    source={appImages.pinknotificationstab}
                    style={styles.imgstyle2}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <FastImage
                  source={appImages.notificationstab}
                  style={styles.imgstyle1}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
        name="NotificationStackScreens"
        component={NotificationTab}
      />
      <TabStack.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {focused ? (
                <View style={styles.pinkcontainer2}>
                  <View
                    style={{
                      alignItems: 'center',
                      marginRight: responsiveWidth(3),
                    }}>
                    <Text style={styles.txt}>Add</Text>
                    <Text
                      style={[styles.txt, {marginTop: responsiveHeight(-1)}]}>
                      Challenge
                    </Text>
                  </View>

                  <FastImage
                    source={appImages.pinkchallengetab}
                    style={styles.imgstyle2}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <FastImage
                  source={appImages.challengetab}
                  style={styles.imgstyle1}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
        name="AddStackScreens"
        component={AddTab}
      />
      <TabStack.Screen
        options={{
          tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              {focused ? (
                <View style={styles.pinkcontainer}>
                  <Text style={[styles.txt, {marginRight: responsiveWidth(3)}]}>
                    Profile
                  </Text>
                  <FastImage
                    source={appImages.pinkprofiletab}
                    style={styles.imgstyle2}
                    resizeMode={'contain'}
                  />
                </View>
              ) : (
                <FastImage
                  source={appImages.profiletab}
                  style={styles.imgstyle1}
                  resizeMode={'contain'}
                />
              )}
            </View>
          ),
        }}
        name="ProfileStackScreens"
        component={ProfileTab}
      />
    </TabStack.Navigator>
  );
};

const MyDrawer = () => {
  return (
    <MyDrawerStack.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        keyboardDismissMode: 'on-drag',
        headerShown: false,
        overlayColor: 'rgba(0,0,0,0.5)',
        drawerType: 'slide',
        drawerStyle: {width: responsiveWidth(92)},
      }}>
      <MyDrawerStack.Screen name="MyApp" component={App} />
    </MyDrawerStack.Navigator>
  );
};

function Stacke() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        headerTintColor: 'white',
        headerStyle: {backgroundColor: '#7E354D'},
        headerTitleAlign: 'center',
        // headerShown: false
      }}>
      <Stack.Screen
        // name="GoodMorning"
        name="Tab"
        component={Tab}
        options={{
          // headerTitleStyle: {fontWeight: 'bold',},
          headerShown: false,
        }}
      />

      {/* ************************************************ */}
    </Stack.Navigator>
  );
}

const App = () => {
  const dispatch = useDispatch();
  let isDarkMode = useColorScheme() == 'dark';
  // const [prevState, setPrevState] = useState('');
  useEffect(() => {
    handleThemeChange();
    console.log('AppState : ', AppState.currentState);
    // AppState.addEventListener('change', handleAppStateChange);
  }, [isDarkMode]);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        console.log('Next AppState is: ', nextAppState);
        handleAppStateChange1(nextAppState);
      },
    );
    return () => {
      appStateListener?.remove();
    };
  }, []);
  const handleAppStateChange1 = async nextAppState => {
    await AsyncStorage.setItem('prevState', nextAppState);
  };

  const handleAppStateChange = async nextAppState => {
    try {
      let prevState = await AsyncStorage.getItem('prevState');
      console.log('prevState  :--> ', typeof prevState);
      let str = '';

      if (
        prevState?.toString()?.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App opened from the background');
      } else {
        console.log('prevstate : ', prevState);
      }
      await AsyncStorage.setItem('prevState', nextAppState);

      // setPrevState(nextAppState);
      console.log('nextAppState .....: ', nextAppState);
    } catch (error) {
      console.log('Error  : ', error);
    }
  };

  const handleThemeChange = async () => {
    let isFirst = await AsyncStorage.getItem('isFirst');
    let prevState = await AsyncStorage.getItem('prevState');

    if (!isFirst) {
      dispatch(setIsDarkMode(isDarkMode));
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

        dispatch(setIsDarkMode(isDarkMode));
        await AsyncStorage.setItem('isDarkMode', isDarkMode?.toString());
      }
      // --------------------------------
    }

    await AsyncStorage.setItem('prevState', AppState.currentState);
  };
  return (
    <AppStack.Navigator
      initialRouteName={'MyTab'}
      screenOptions={{
        headerShown: false,
      }}>
      <AppStack.Screen name="MyTab" component={Stacke} />
      {/* <MyDrawerStack.Screen name="MyDrawer" component={MyDrawer} /> */}
      <AppStack.Screen name={'ChallengeName'} component={ChallengeName} />
      <AppStack.Screen name={'ChallengeList'} component={ChallengeList} />
      <AppStack.Screen name={'AudioPlayer'} component={AudioPlayer} />
      <AppStack.Screen name={'EditAvatar'} component={EditAvatar} />

      <AppStack.Screen name={'HiddenChallenges'} component={HiddenChallenges} />
      <AppStack.Screen name={'Book_Name_here'} component={Book_Name_here} />
      <AppStack.Screen name={'EditProfile'} component={EditProfile} />
      <AppStack.Screen name={'Tasks'} component={Tasks} />
      <AppStack.Screen name={'My_Challenges'} component={My_Challenges} />
      <AppStack.Screen name={'DailyJournal'} component={DailyJournal} />
      <AppStack.Screen
        name={'CommunityChallenges'}
        component={CommunityChallenges}
      />
      <AppStack.Screen name={'AddChallenge1'} component={AddChallenge} />
      <AppStack.Screen name={'UpdateChallenge'} component={UpdateChallenge} />
      <AppStack.Screen name={'LikedChallenges'} component={LikedChallenges} />
      <AppStack.Screen
        name={'CompletedChallenges'}
        component={CompletedChallenges}
      />
      <AppStack.Screen
        name={'Motivational_Qoutes'}
        component={Motivational_Qoutes}
      />
      <AppStack.Screen name={'ActiveChallenges'} component={ActiveChallenges} />
      <AppStack.Screen name={'Books'} component={Books} />
      <AppStack.Screen name={'FirstGoodMorning'} component={FirstGoodMorning} />
      <AppStack.Screen name={'To_do_list'} component={To_do_list} />
      <AppStack.Screen name={'Article'} component={Article} />
      <AppStack.Screen name={'ArticleDetail'} component={ArticleDetail} />
      <AppStack.Screen
        name={'CommunityChallengeView'}
        component={CommunityChallengeView}
      />
      <AppStack.Screen name={'Wallpapers'} component={Wallpapers} />
      <AppStack.Screen name={'Backup'} component={Backup} />
      <AppStack.Screen name={'BackupAndRestore'} component={BackupAndRestore} />
      <AppStack.Screen name={'Inspirationalspeeches'} component={Inspirationalspeeches} />
      <AppStack.Screen name={'Calander'} component={Calander} />
      <AppStack.Screen name={'WriteNotes'} component={WriteNotes} />
      <AppStack.Screen name={'UpdateJournal'} component={UpdateJournal} />
      <AppStack.Screen name={'Challenge_Date'} component={Challenge_Date} />
    </AppStack.Navigator>
  );
};

export default MyDrawer;
