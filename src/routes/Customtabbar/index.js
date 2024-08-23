import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {
  BottomTabBar,
  BottomTabBarButtonProps,
  BottomTabBarProps,
  BottomTabNavigationOptions,
  BottomTabView,
} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../assets/utilities';
import {fontFamily} from '../../constants/fonts';
import Entypo from 'react-native-vector-icons/Entypo';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {setCustomstopstate, setIsplaying} from '../../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import STYLES from '../../screens/STYLES';

const Customtabbar = ({state, descriptors, navigation, position}) => {
  const [isTrackPlayerClose, setIsTrackPlayerClose] = useState(false);
  const playbackState = usePlaybackState();
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();
  const [musicplay, setMusicPlay] = useState(false);
  const dispatch = useDispatch();
  const [activetab, setActivetab] = useState('Profile');
  const {
    customstopstate,
    first,
    second,
    double,
    solid,
    firstdark,
    seconddark,
    doubledark,
    soliddark,
    darkmodetext,
    isdarkmode,
    isplaying,
  } = useSelector(state => state.userReducer);

  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      checkScreen();
    }, []),
  );
  const songs = [
    {
      id: 1,
      title: 'Tera Hone Laga Hoon',
      url: require('../../assets/songs/Tera_Hone_Laga_Hoon.mp3'),
      duration: 300,
      artwork: appImages.addemoji,
    },
    {
      id: 2,
      title: 'Tere Liye',
      url: require('../../assets/songs/Tere_Liye.mp3'),
      duration: 400,
      artwork: appImages.musicplay,
    },

    {
      id: 3,
      title: 'Piya O Re Piya',
      url: require('../../assets/songs/Piya_O_Re_Piya.mp3'),
      duration: 350,
      artwork: appImages.allcolors,
    },
  ];

  const togglePlayback = async playbackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();

    if (currentTrack !== null) {
      if (playbackState == State.Paused || playbackState == 1) {
        await TrackPlayer.play();
      } else {
        await TrackPlayer.pause();
      }
    }
  };
  const checkScreen = () => {
    return (
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.getCurrentRoute().name;
        }}></NavigationContainer>
    );
  };

  return (
    <View
      style={
        {
          // flexDirection: 'row',
          // // backgroundColor: '#F4AF5F',
          // height: 50,
          // borderRadius: 50,
          // justifyContent: 'center',
          // alignItems: 'center',
        }
      }>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
          // accessibilityRole="button"
          // accessibilityStates={isFocused ? ['selected'] : []}
          // accessibilityLabel={options.tabBarAccessibilityLabel}
          // testID={options.tabBarTestID}
          // onPress={onPress}
          // onLongPress={onLongPress}
          // style={{flex: 1, alignItems: 'center'}}
          >
            {/* <Text style={{color: isFocused ? '#673ab7' : '#222'}}>{label}</Text> */}
          </TouchableOpacity>
        );
      })}
      <View style={styles.bottomtab}>
        {playbackState !== State.None ? (
          playbackState !== State.Stopped &&
          playbackState !== State.Buffering &&
          playbackState !== State.Connecting &&
          isplaying == true ? (
            <View
              style={[
                styles.musicbox,
                {borderColor: isdarkmode ? soliddark : solid},
              ]}>
              <FastImage
                source={appImages.musicpic}
                resizeMode={'contain'}
                style={{
                  width: responsiveWidth(23.5),
                  height: responsiveWidth(23.5),
                  marginLeft: responsiveWidth(-2),
                }}
              />
              <View
                style={{
                  width: responsiveWidth(1),
                  backgroundColor: isdarkmode ? soliddark : solid,
                  height: responsiveHeight(11),
                  marginLeft: responsiveWidth(-0.6),
                }}></View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  // backgroundColor: 'red',
                  width: responsiveWidth(36.1),
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: 15,
                  }}
                  onPress={() => togglePlayback(playbackState)}>
                  {playbackState == State.Playing ? (
                    <FastImage
                      source={appImages.pauseicon}
                      resizeMode={'contain'}
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveWidth(6),
                      }}
                    />
                  ) : (
                    <FastImage
                      source={appImages.tabplayicon}
                      resizeMode={'contain'}
                      style={{
                        width: responsiveWidth(6),
                        height: responsiveWidth(6),
                      }}
                    />
                  )}
                </TouchableOpacity>
                <View
                  style={{
                    height: responsiveHeight(7),
                    width: responsiveWidth(0.25),
                    backgroundColor: 'lightgray',
                    // marginLeft: responsiveWidth(6),
                    // marginRight: responsiveWidth(3),
                  }}></View>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    flex: 1,
                    paddingVertical: 15,
                  }}
                  activeOpacity={0.6}
                  onPress={async () => {
                    console.log(
                      'Trackplayer  : ',
                      await TrackPlayer.getState(),
                      State.Paused,
                    );
                    dispatch(setCustomstopstate(true)),
                      await TrackPlayer.pause().catch(err =>
                        console.log('Error whilte pausing : ', err),
                      );
                    await TrackPlayer.reset();
                    // await TrackPlayer.add(songs);
                    dispatch(setIsplaying(false));
                  }}>
                  <FastImage
                    source={appImages.destroyicon}
                    resizeMode={'contain'}
                    style={{
                      width: responsiveWidth(6),
                      height: responsiveWidth(6),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        ) : null}

        <View style={styles.mainbottom}>
          {/* <BottomTabView {...props}></BottomTabView> */}

          {/* Home */}

          <Pressable
            onPress={() => {
              setActivetab('Home'), navigation.navigate('GoodMorning');
            }}>
            {state.index === 0 ? (
              <View
                style={[
                  styles.pinkcontainer,
                  {
                    paddingVertical: 9,
                    backgroundColor: isdarkmode ? seconddark : second,
                  },
                ]}>
                <Entypo name="home" size={20} color={'#fff'} />
                <Text style={[styles.txt, {marginLeft: responsiveWidth(2)}]}>
                  Home
                </Text>
              </View>
            ) : (
              <Entypo name="home" size={25} color={'gray'} />
            )}
          </Pressable>
          {/* Music */}
          {/* <Pressable
            onPress={() => {
              console.log('music pressed...');
              setActivetab('Music'), navigation.navigate('MusicStackScreens');
            }}>
            {state.index === 1 ? (
              <View
                style={[
                  styles.pinkcontainer2,
                  {backgroundColor: isdarkmode ? seconddark : second},
                ]}>
                <View
                  style={{
                    alignItems: 'center',
                    marginRight: responsiveWidth(3),
                  }}>
                  <Text style={styles.txt}>Relaxing</Text>
                  <Text style={[styles.txt, {marginTop: responsiveHeight(-1)}]}>
                    Music
                  </Text>
                </View>

                <FastImage
                  source={appImages.pinkrelaxingtab}
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
          </Pressable> */}

          {/* add challenge  */}
          {/* <Pressable
            onPress={() => {
              setActivetab('Add');
              navigation.navigate('AddStackScreens');
            }}>
            {state.index === 2 ? (
              <View
                style={[
                  styles.pinkcontainer2,
                  {backgroundColor: isdarkmode ? seconddark : second},
                ]}>
                <View
                  style={{
                    alignItems: 'center',
                    marginRight: responsiveWidth(3),
                  }}>
                  <Text style={styles.txt}>Add</Text>
                  <Text style={[styles.txt, {marginTop: responsiveHeight(-1)}]}>
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
          </Pressable> */}

          {/*  notification */}
          <Pressable
            onPress={() => {
              console.log('notification pressed', state.index);
              setActivetab('Notification'),
                navigation.navigate('NotificationStackScreens');
            }}>
            {state.index === 2 ? (
              <View
                style={[
                  styles.pinkcontainer,
                  {backgroundColor: isdarkmode ? seconddark : second},
                ]}>
                <FastImage
                  source={appImages.pinknotificationstab}
                  style={styles.imgstyle2}
                  resizeMode={'contain'}
                />
                <Text style={[styles.txt, {marginLeft: responsiveWidth(2)}]}>
                  Notification
                </Text>
              </View>
            ) : (
              <FastImage
                source={appImages.notificationstab}
                style={{
                  ...styles.imgstyle1,
                  marginRight: state.index == 0 ? responsiveWidth(13) : 0,
                  marginLeft: state.index == 4 ? responsiveWidth(12) : 0,
                }}
                resizeMode={'contain'}
              />
            )}
          </Pressable>

          {/* profile */}
          <Pressable
            onPress={() => {
              setActivetab('Profile');
              navigation.navigate('ProfileStackScreens');
            }}>
            {state.index === 4 ? (
              <View
                style={[
                  styles.pinkcontainer,
                  {backgroundColor: isdarkmode ? seconddark : second},
                ]}>
                <FastImage
                  source={appImages.pinkprofiletab}
                  style={styles.imgstyle2}
                  resizeMode={'contain'}
                />
                <Text style={[styles.txt, {marginLeft: responsiveWidth(3)}]}>
                  Profile
                </Text>
              </View>
            ) : (
              <FastImage
                source={appImages.profiletab}
                style={styles.imgstyle1}
                resizeMode={'contain'}
              />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
//   return (

//   );
// };
export default Customtabbar;
const styles = StyleSheet.create({
  bottomtab: {
    // backgroundColor: 'transparent',
  },
  mainbottom: {
    height: responsiveHeight(7),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: responsiveWidth(7),
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
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    // width: responsiveWidth(30),
    borderRadius: responsiveWidth(100),
  },
  pinkcontainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-between',
    // paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    // width: responsiveWidth(30),
    borderRadius: responsiveWidth(100),
  },
  txt: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontFamily: fontFamily.Poppins_Regular,
    marginBottom: responsiveHeight(-0.6),
  },
  musicbox: {
    width: responsiveWidth(60),
    height: responsiveHeight(11),
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    position: 'absolute',
    zIndex: 1,
    marginTop: responsiveHeight(-11),
    borderTopLeftRadius: responsiveWidth(10),

    borderWidth: responsiveWidth(1),
    overflow: 'hidden',
    alignItems: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
  },
});
