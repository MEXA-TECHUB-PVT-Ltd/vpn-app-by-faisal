import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  TextInput,
  Image,
  AppState,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily} from '../../../constants/fonts';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import Carousel from 'react-native-snap-carousel';
import Slider from '@react-native-community/slider';
import {setCustomstopstate} from '../../../redux/actions';
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {useFocusEffect} from '@react-navigation/native';
import {duration} from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {setIsplaying, setMusic} from '../../../redux/actions';

// const setupPlayer = async () => {
//   await TrackPlayer.setupPlayer();
//   await TrackPlayer.add(songs);
// };

const AudioPlayer = props => {
  const {id, musicName, music} = props?.route.params;

  const myarray = [
    {
      id: id,
      musicName: musicName,
      url: music,
      artwork: appImages.addemoji,
    },
  ];

  const {
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
  } = useSelector(state => state.userReducer);
  const dispatch = useDispatch();
  // const [isplaying, setIsplaying] = useState(false);
  const refContainer = useRef();
  const refSong = useRef();
  const playbackState = usePlaybackState();
  const playbackTrackChanged = Event.PlaybackTrackChanged;

  const {isplaying, musicList} = useSelector(state => state.userReducer);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [currentTrack, setCurrentTrack] = useState('');

  const progress = useProgress();

  const songs = [
    {
      id: 1,
      title: 'Tera Hone Laga Hoon',
      url: require('../../../assets/songs/Tera_Hone_Laga_Hoon.mp3'),
      duration: 300,
      artwork: appImages.addemoji,
    },
    {
      id: 2,
      title: 'Tere Liye',
      url: require('../../../assets/songs/Tere_Liye.mp3'),
      duration: 400,
      artwork: appImages.musicplay,
    },

    {
      id: 3,
      title: 'Piya O Re Piya',
      url: require('../../../assets/songs/Piya_O_Re_Piya.mp3'),
      duration: 350,
      artwork: appImages.allcolors,
    },
  ];
  useEffect(() => {
    setCurrentIndex(props?.route?.params?.index);
    setUpTrackPlayer(props.route.params?.index);
  }, [props.route.params]);

  // useEffect(() => {
  //   handlePlaybackStateChange(playbackState);
  // }, [playbackState]);

  useTrackPlayerEvents(['playback-track-changed'], event => {
    if (event.type === 'playback-track-changed') {
      // A new track has started playing
      const {track} = event;
      console.log('New track:', track);
      handlePlaybackStateChange(playbackState);
    }
  });

  const handlePlaybackStateChange = async () => {
    dispatch(setIsplaying(true));
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);
    if (trackObject != null) {
      setCurrentTrack(trackObject);
    }
  };

  const setUpTrackPlayer = async currentIndex => {
    try {
      if ((await TrackPlayer.getState()) == 0) {
        await TrackPlayer.reset();
        await TrackPlayer.setupPlayer().catch(err =>
          console.log('error while setup', err),
        );

        TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
        await TrackPlayer.add(musicList);
        await TrackPlayer.pause();
        // await TrackPlayer.setRepeatMode(RepeatMode.Queue);
        await TrackPlayer.skip(currentIndex);
        await TrackPlayer.play();
        updatePlayStatus(currentIndex);
      } else {
        await TrackPlayer.reset();
        await TrackPlayer.add(musicList);
        await TrackPlayer.skip(currentIndex);
        await TrackPlayer.play();
        updatePlayStatus(currentIndex);
      }
    } catch (error) {
      console.log('error ::::', error);
    }
  };

  const updatePlayStatus = currentIndex => {
    const newData = musicList?.map((element, index) => {
      if (index == currentIndex) {
        return {
          ...element,
          isPlaying: !element?.isPlaying,
        };
      } else {
        return {
          ...element,
          isPlaying: false,
        };
      }
    });
    dispatch(setMusic(newData));
  };

  const handlePause = async () => {
    await TrackPlayer.pause();
  };

  const togglePlayback = async playbackState => {
    const state = await TrackPlayer.getState();
    // console.log(
    //   'state ::::  ',
    //   state,
    //   State.Buffering,
    //   State.Connecting,
    //   State.None,
    //   State.Paused,
    //   State.Playing,
    //   State.Ready,
    //   State.Stopped,
    // );
    // await TrackPlayer.play();
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();

    // if (duration - position) {
    //   await TrackPlayer.reset();
    //   setUpTrackPlayer();
    // }
    if (duration - position == 0) {
      await TrackPlayer.reset();
      await TrackPlayer.add(musicList);

      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.play();
      updatePlayStatus(currentIndex);
    } else if (playbackState == State.None) {
      await TrackPlayer.seekTo(1000);

      await TrackPlayer.add(musicList);

      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.play().finally(() => console.log('finally.....'));
      updatePlayStatus(currentIndex);
    }
    //  else if (playbackState === State.Playing) {
    //   await TrackPlayer.pause();
    // }
    else {
      // const position = await TrackPlayer.getPosition();
      // const duration = await TrackPlayer.getDuration();

      // if (position >= duration) {
      //   await TrackPlayer.reset();
      //   await TrackPlayer.add({
      //     id: id,
      //     musicName: musicName,
      //     url: music,
      //     artwork: appImages.addemoji,
      //   });
      // }
      await TrackPlayer.play();
      updatePlayStatus(currentIndex);
    }

    // if (currentTrack !== null) {
    // if (playbackState == State.Paused) {
    //   const position = await TrackPlayer.getPosition();
    //   const duration = await TrackPlayer.getDuration();

    //   if (position >= duration) {
    //     await TrackPlayer.reset();
    //   }
    //   await TrackPlayer.play();
    // } else {
    //   await TrackPlayer.pause();
    // }
    // }
  };

  const handleNext = async () => {
    let queue = await TrackPlayer.getQueue();
    console.log({currentIndex});
    if (currentIndex < musicList.length - 1) {
      // refSong.current.scrollToIndex({animated: true, index: currentIndex + 1});
      // Skip to the next track in the queue:
      // await TrackPlayer.skipToNext();
      await TrackPlayer.skip(currentIndex + 1);
      setCurrentIndex(currentIndex + 1);
      togglePlayback(playbackState);
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      // refSong.current.scrollToIndex({animated: true, index: currentIndex - 1});
      setCurrentIndex(currentIndex - 1);
      // Skip to the previous track in the queue:
      await TrackPlayer.skip(currentIndex - 1);
      // await TrackPlayer.skipToPrevious();
      togglePlayback(playbackState);
    }
  };

  // const skipTo = async trackId => {
  //   await TrackPlayer.skip(trackId);
  // };

  const [myvalue, setmyvalue] = useState();
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setUpTrackPlayer();
  //     // skipTo(1);
  //     setmyvalue([{scale: 1.4}]);
  //   }, []),
  // );

  const renderItem = ({item, index}) => {
    return (
      <Image
        source={item.artwork}
        resizeMode="contain"
        style={{
          zIndex: 1,
          width: responsiveWidth(80),
          height: responsiveWidth(65),
          // backgrosundColor: 'red',
          alignSelf: 'center',
          marginTop: responsiveHeight(5),
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.floatingbutton}></View> */}
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Relaxing Music'} />
        <View style={styles.scrollviewcontainer}>
          <Carousel
            scrollEnabled={false}
            data={musicList}
            renderItem={renderItem}
            sliderWidth={responsiveWidth(100)}
            itemWidth={responsiveWidth(100)}
            ref={refContainer}
            ListFooterComponent={() => {
              return <Text> </Text>;
            }}
          />
        </View>

        <View>
          <View
            style={{
              width: responsiveWidth(100),
              padding: responsiveWidth(5),
            }}>
            <Text
              style={{
                fontFamily: fontFamily.Sans_Regular,
                color: '#FFF',
                fontSize: responsiveFontSize(2.7),
              }}>
              {/* {item.title} */}
              {currentTrack?.title ? currentTrack?.title : ''}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flex: 1,
            width: responsiveWidth(100),
            alignSelf: 'center',
          }}>
          <Slider
            style={[
              styles.progressContainer,
              // { transform: myvalue }
            ]}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor={'#fff'}
            minimumTrackTintColor={'#fff'}
            maximumTrackTintColor={'#9A9A9A'}
            onSlidingComplete={async value => {
              await TrackPlayer.seekTo(value);
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              // alignSelf: 'center',
              justifyContent: 'space-between',
              width: responsiveWidth(82),
              alignSelf: 'center',
              marginTop: responsiveHeight(3),
            }}>
            <Text style={styles.time}>
              {new Date(progress.position * 1000).toISOString().substr(14, 5)}
            </Text>
            <Text style={styles.time}>
              {new Date((progress.duration - progress.position) * 1000)
                .toISOString()
                .substr(14, 5)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(70),
              alignSelf: 'center',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: responsiveHeight(3),
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                handlePrevious();
                // refContainer.current.snapToPrev();
                // TrackPlayer.skipToPrevious();
              }}>
              <FastImage
                source={appImages.backwardsong}
                resizeMode="contain"
                style={styles.twobuttons2}
              />
            </TouchableOpacity>

            {playbackState == State.Playing ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  handlePause();
                  // togglePlayback(playbackState);
                  dispatch(setCustomstopstate(true));
                }}>
                <FastImage
                  source={appImages.musicpause}
                  resizeMode="contain"
                  style={styles.twobuttons}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={async () => {
                  togglePlayback(playbackState);
                  dispatch(setCustomstopstate(false));
                }}>
                <FastImage
                  source={appImages.musicplay}
                  resizeMode="contain"
                  style={styles.twobuttons}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                // refContainer.current.snapToNext();
                // TrackPlayer.skipToNext();
                handleNext();
              }}>
              <FastImage
                source={appImages.forwardsong}
                resizeMode="contain"
                style={styles.twobuttons2}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AudioPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    width: responsiveWidth(64),
    alignSelf: 'center',
    transform: [{scale: responsiveWidth(0.35)}],
    height: 40,
  },
  scrollviewcontainer: {
    // flex: 1,
    width: responsiveWidth(100),
    // alignSelf: 'center',
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    // zIndex: 1,
  },
  innercontainer: {
    width: responsiveWidth(88),
    alignSelf: 'center',
    marginTop: responsiveHeight(3.5),
  },
  emptytxt: {
    color: '#CFCFCF',
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(2.5),
  },
  twobuttons: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
  },
  twobuttons2: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
  },
  time: {
    color: '#fff',
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(1.9),
  },
});

// import {
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Pressable,
//   TextInput,
//   Image,
//   AppState,
// } from 'react-native';
// import React, {useEffect, useState, useRef} from 'react';
// import MainHeader from '../../../components/MainHeader';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {fontFamily} from '../../../constants/fonts';
// import EmojiSelector, {Categories} from 'react-native-emoji-selector';
// import FastImage from 'react-native-fast-image';
// import {appImages} from '../../../assets/utilities';
// import Carousel from 'react-native-snap-carousel';
// import Slider from '@react-native-community/slider';
// import {setCustomstopstate} from '../../../redux/actions';
// import TrackPlayer, {
//   Capability,
//   Event,
//   RepeatMode,
//   State,
//   usePlaybackState,
//   useProgress,
//   useTrackPlayerEvents,
// } from 'react-native-track-player';
// import {useFocusEffect} from '@react-navigation/native';
// import {duration} from 'moment';
// import {useSelector, useDispatch} from 'react-redux';
// import {setIsplaying} from '../../../redux/actions';

// // const setupPlayer = async () => {
// //   await TrackPlayer.setupPlayer();
// //   await TrackPlayer.add(songs);
// // };

// const AudioPlayer = props => {
//   const {id, musicName, music} = props?.route.params;

//   const myarray = [
//     {
//       id: id,
//       musicName: musicName,
//       url: music,
//       artwork: appImages.addemoji,
//     },
//   ];

//   const {
//     first,
//     second,
//     double,
//     solid,
//     firstdark,
//     seconddark,
//     doubledark,
//     soliddark,
//     darkmodetext,
//     isdarkmode,
//   } = useSelector(state => state.userReducer);
//   const dispatch = useDispatch();
//   // const [isplaying, setIsplaying] = useState(false);
//   const refContainer = useRef();
//   const playbackState = usePlaybackState();
//   const {isplaying, musicList} = useSelector(state => state.userReducer);

//   const progress = useProgress();

//   const songs = [
//     {
//       id: 1,
//       title: 'Tera Hone Laga Hoon',
//       url: require('../../../assets/songs/Tera_Hone_Laga_Hoon.mp3'),
//       duration: 300,
//       artwork: appImages.addemoji,
//     },
//     {
//       id: 2,
//       title: 'Tere Liye',
//       url: require('../../../assets/songs/Tere_Liye.mp3'),
//       duration: 400,
//       artwork: appImages.musicplay,
//     },

//     {
//       id: 3,
//       title: 'Piya O Re Piya',
//       url: require('../../../assets/songs/Piya_O_Re_Piya.mp3'),
//       duration: 350,
//       artwork: appImages.allcolors,
//     },
//   ];
//   const setUpTrackPlayer = async () => {
//     // await TrackPlayer.reset();
//     if ((await TrackPlayer.getState()) == 0) {
//       // await TrackPlayer.add({
//       //   id: id,
//       //   musicName: musicName,
//       //   url: music,
//       //   artwork: appImages.addemoji,
//       // });

//       await TrackPlayer.add(musicList);
//       // await TrackPlayer.add(myarray);
//       TrackPlayer.updateOptions({});
//       const myvalue = await TrackPlayer.getCurrentTrack();
//     }
//   };

//   const togglePlayback = async playbackState => {
//     const currentTrack = await TrackPlayer.getCurrentTrack();

//     const state = await TrackPlayer.getState();

//     // await TrackPlayer.play();

//     if (state === State.Playing) {
//       await TrackPlayer.pause();
//     } else {
//       // const position = await TrackPlayer.getPosition();
//       // const duration = await TrackPlayer.getDuration();

//       // if (position >= duration) {
//       //   await TrackPlayer.reset();
//       //   await TrackPlayer.add({
//       //     id: id,
//       //     musicName: musicName,
//       //     url: music,
//       //     artwork: appImages.addemoji,
//       //   });
//       // }
//       await TrackPlayer.play();
//     }

//     // if (currentTrack !== null) {
//     // if (playbackState == State.Paused) {
//     //   const position = await TrackPlayer.getPosition();
//     //   const duration = await TrackPlayer.getDuration();

//     //   if (position >= duration) {
//     //     await TrackPlayer.reset();
//     //   }

//     //   await TrackPlayer.play();
//     // } else {

//     //   await TrackPlayer.pause();
//     // }
//     // }
//   };

//   const handleNext = async () => {};

//   const handlePrevious = async () => {};

//   // const skipTo = async trackId => {
//   //   await TrackPlayer.skip(trackId);
//   // };

//   const [myvalue, setmyvalue] = useState();
//   useFocusEffect(
//     React.useCallback(() => {
//       setUpTrackPlayer();
//       // skipTo(1);
//       setmyvalue([{scale: 1.4}]);
//     }, []),
//   );

//   const renderItem = ({item, index}) => {
//     return (
//       <Image
//         source={item.artwork}
//         resizeMode="contain"
//         style={{
//           zIndex: 1,
//           width: responsiveWidth(80),
//           height: responsiveWidth(65),
//           // backgrosundColor: 'red',
//           alignSelf: 'center',
//           marginTop: responsiveHeight(5),
//         }}
//       />
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* <View style={styles.floatingbutton}></View> */}
//       <LinearGradient
//         colors={isdarkmode ? doubledark : double}
//         style={styles.linearGradient}>
//         <MainHeader {...props} headertxt={'Relaxing Music'} />
//         <View style={styles.scrollviewcontainer}>
//           <Carousel
//             scrollEnabled={true}
//             data={musicList}
//             renderItem={renderItem}
//             sliderWidth={responsiveWidth(100)}
//             itemWidth={responsiveWidth(100)}
//             ref={refContainer}
//             ListFooterComponent={() => {
//               return <Text>HELLO</Text>;
//             }}
//           />
//         </View>

//         <FlatList
//           data={musicList}
//           horizontal
//           renderItem={({item}) => (
//             <View
//               style={{
//                 // marginTop:200,
//                 flex: 1,
//                 width: responsiveWidth(100),
//                 alignSelf: 'center',
//               }}>
//               <View
//                 style={{
//                   width: responsiveWidth(80),
//                   alignSelf: 'center',
//                   marginTop: responsiveHeight(3.5),
//                   marginBottom: responsiveHeight(4),
//                 }}>
//                 <Text
//                   style={{
//                     fontFamily: fontFamily.Sans_Regular,
//                     color: '#FFF',
//                     fontSize: responsiveFontSize(2.7),
//                   }}>
//                   {item.title}
//                 </Text>
//               </View>
//               <Slider
//                 style={[
//                   styles.progressContainer,
//                   // { transform: myvalue }
//                 ]}
//                 value={progress.position}
//                 minimumValue={0}
//                 maximumValue={progress.duration}
//                 thumbTintColor={'#fff'}
//                 minimumTrackTintColor={'#fff'}
//                 maximumTrackTintColor={'#9A9A9A'}
//                 onSlidingComplete={async value => {
//                   await TrackPlayer.seekTo(value);
//                 }}
//               />
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   // alignSelf: 'center',
//                   justifyContent: 'space-between',
//                   width: responsiveWidth(82),
//                   alignSelf: 'center',
//                   marginTop: responsiveHeight(3),
//                 }}>
//                 <Text style={styles.time}>
//                   {new Date(progress.position * 1000)
//                     .toISOString()
//                     .substr(14, 5)}
//                 </Text>
//                 <Text style={styles.time}>
//                   {new Date((progress.duration - progress.position) * 1000)
//                     .toISOString()
//                     .substr(14, 5)}
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   width: responsiveWidth(70),
//                   alignSelf: 'center',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                   marginTop: responsiveHeight(3),
//                 }}>
//                 <TouchableOpacity
//                   activeOpacity={0.7}
//                   onPress={() => {
//                     refContainer.current.snapToPrev();
//                     TrackPlayer.skipToPrevious();
//                   }}>
//                   <FastImage
//                     source={appImages.backwardsong}
//                     resizeMode="contain"
//                     style={styles.twobuttons2}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   activeOpacity={0.7}
//                   onPress={async () => {
//                     // dispatch(setIsplaying(!isplaying)),
//                     togglePlayback(playbackState);

//                     dispatch(setCustomstopstate(false));
//                   }}>
//                   {playbackState == State.Playing ? (
//                     <FastImage
//                       source={appImages.musicpause}
//                       resizeMode="contain"
//                       style={styles.twobuttons}
//                     />
//                   ) : (
//                     <FastImage
//                       source={appImages.musicplay}
//                       resizeMode="contain"
//                       style={styles.twobuttons}
//                     />
//                   )}
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   activeOpacity={0.7}
//                   onPress={() => {
//                     refContainer.current.snapToNext();
//                     TrackPlayer.skipToNext();
//                   }}>
//                   <FastImage
//                     source={appImages.forwardsong}
//                     resizeMode="contain"
//                     style={styles.twobuttons2}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         />
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// export default AudioPlayer;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   progressContainer: {
//     width: responsiveWidth(64),
//     alignSelf: 'center',
//     transform: [{scale: responsiveWidth(0.35)}],
//     height: 40,
//   },
//   scrollviewcontainer: {
//     // flex: 1,
//     width: responsiveWidth(100),
//     // alignSelf: 'center',
//   },
//   linearGradient: {
//     flex: 1,
//     // alignItems: 'center',
//     // paddingHorizontal: responsiveWidth(10),
//     // zIndex: 1,
//   },
//   innercontainer: {
//     width: responsiveWidth(88),
//     alignSelf: 'center',
//     marginTop: responsiveHeight(3.5),
//   },
//   emptytxt: {
//     color: '#CFCFCF',
//     fontFamily: fontFamily.Poppins_Regular,
//     fontSize: responsiveFontSize(2.5),
//   },
//   twobuttons: {
//     width: responsiveWidth(10),
//     height: responsiveWidth(10),
//   },
//   twobuttons2: {
//     width: responsiveWidth(7),
//     height: responsiveWidth(7),
//   },
//   time: {
//     color: '#fff',
//     fontFamily: fontFamily.Poppins_Regular,
//     fontSize: responsiveFontSize(1.9),
//   },
// });
