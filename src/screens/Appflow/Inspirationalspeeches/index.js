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
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';

import {api} from '../../../constants/api';

import Loader from '../../../components/Loader/Loader';
import Snackbar from 'react-native-snackbar';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';

import TrackPlayer, {
  State,
  usePlaybackState,
  Capability,
  useTrackPlayerEvents,
} from 'react-native-track-player';

import {setIsplaying, setMusic} from '../../../redux/actions';
import {bannerAdID} from '../../../utils/adsKey';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';

// import { Item } from 'react-native-paper/lib/typescript/components/List/List';
// import { Item } from 'react-native-paper/lib/typescript/components/List/List';

const Inspirationalspeeches = props => {
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
    //
    musicList,
  } = useSelector(state => state.userReducer);

  const dispatch = useDispatch();
  const playbackState = usePlaybackState();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [firstList, setFirstList] = useState([]);

  // const getMusic = async () => {
  //   try {
  //     const response = await fetch(
  //       'http://206.189.192.112:3000/api/music/getAllMusics',
  //     );
  //     const json = await response.json();
  //     setData(json.result);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     getMusic();
  //   }, 6000);

  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    setLoading(true);
    getMotivational_Music();
  }, []);

  //this function will called when music is changed
  useTrackPlayerEvents(['playback-track-changed'], event => {
    if (event.type === 'playback-track-changed') {
      // A new track has started playing
      const {track} = event;
      console.log('New track:', track);
      if (
        playbackState == State.Playing ||
        playbackState == State.Paused ||
        playbackState == State.Stopped
      )
        handlePlaybackStateChange();
    }
  });

  // useEffect(() => {
  //   if (
  //     playbackState == State.Playing ||
  //     playbackState == State.Paused ||
  //     playbackState == State.Stopped
  //   )
  //     handlePlaybackStateChange();
  // }, [playbackState]);

  const handlePlaybackStateChange = async () => {
    let trackIndex = await TrackPlayer.getCurrentTrack();
    let trackObject = await TrackPlayer.getTrack(trackIndex);

    console.log(
      'trackObject  ::::_________________  ',
      trackObject?.id,
      trackObject?.title,
    );

    if (trackObject != null) updatePlayStatus(trackObject?.id, trackIndex);
  };

  const getMotivational_Music = () => {
    var requestOptions = {
      method: 'GET',
      // body: JSON.stringify(data),
      redirect: 'follow',
    };
    fetch(api.get_all_motivational_music, requestOptions)
      .then(response => response.json())
      .then(async result => {
        let trackList = [];
        let list = [];
        if (result[0]?.error == false) {
          let responseList = result[0]?.data ? result[0]?.data : [];
          for (const element of responseList) {
            let obj = {
              id: element?.id,
              title: element?.name,
              url: element?.link ? BASE_URL_IMAGE + '/' + element?.link : '',
              created_at: element?.created_at,
              artwork: appImages.addemoji,
              artist: '',
              isPlaying: false,
            };

            list.push(obj);
          }
          dispatch(setMusic(list));
          handlePlaybackStateChange();

          if (list?.length > 5) {
            let filter = list?.filter((item, index) => index < 6);
            setFirstList(filter);
            let filter1 = list?.filter((item, index) => index >= 6);
            setData(filter1);
          } else {
            setFirstList(list);
          }
        } else {
          Snackbar.show({
            text: 'No Record Found',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const updatePlayStatus = (id, currentIndex) => {
    const newData = musicList?.map((element, index) => {
      // console.log('element  ::  ', element);
      // if (index == currentIndex) {
      if (element?.id == id) {
        return {
          ...element,
          isPlaying: true,
        };
      } else {
        return {
          ...element,
          isPlaying: false,
        };
      }
    });

    // setData(newData);
    dispatch(setMusic(newData));
  };

  const updatePauseStatus = (id, currentIndex) => {
    const newData = musicList?.map((element, index) => {
      // if (index == currentIndex) {
      if (element?.id == id) {
        return {
          ...element,
          isPlaying: false,
        };
      } else {
        return {
          ...element,
          isPlaying: false,
        };
      }
    });

    // setData(newData);
    dispatch(setMusic(newData));
  };

  const handlePause = async (item, index) => {
    await TrackPlayer.pause().then(() => {
      updatePauseStatus(item?.id, index);
    });
  };

  const handlePlay = async (item, currentIndex, playbackState) => {
    if ((await TrackPlayer.getState()) == 0) {
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
    }

    console.log({currentIndex});
    // await TrackPlayer.reset();

    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    console.log(`${duration - position} seconds left.`);
    if (duration - position == 0) {
      console.log('....................................');
      await TrackPlayer.reset();
      await TrackPlayer.add(musicList);
      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.play().then(() => {
        dispatch(setIsplaying(true));
        console.log('line 260');
        updatePlayStatus(item?.id, currentIndex);
      });
    } else if (playbackState == State.None) {
      await TrackPlayer.add(musicList);
      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.play().then(() => {
        dispatch(setIsplaying(true));
        console.log('line 267');
        updatePlayStatus(item?.id, currentIndex);
      });
    } else {
      await TrackPlayer.skip(currentIndex);
      await TrackPlayer.play().then(() => {
        dispatch(setIsplaying(true));
        console.log('line 273');
        updatePlayStatus(item?.id, currentIndex);
      });
    }
  };

  const handlePullRefresh = async () => {
    setRefreshing(true);
    getMotivational_Music();
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          marginLeft: responsiveWidth(5.5),
          marginTop: responsiveHeight(2),
          width: responsiveWidth(43),
        }}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('AudioPlayer', {
              index: index,
              // id: item.id,
              // musicName: item.title,
              // music: item?.url,
              // music: 'http://206.189.192.112:3000/' + item.music,
            })
          }
          activeOpacity={0.9}>
          <FastImage
            resizeMode="contain"
            source={appImages.musicpic}
            style={styles.imgstyle}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            // alignItems: 'center',
            marginVertical: responsiveHeight(1.5),
          }}>
          {item?.isPlaying && playbackState == State.Playing ? (
            <TouchableOpacity
              onPress={() => {
                handlePause(item, index);
              }}>
              <FastImage
                resizeMode="contain"
                source={appImages.musicpause}
                style={styles.imgstyle2}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                handlePlay(item, index, playbackState);
              }}>
              <FastImage
                resizeMode="contain"
                source={appImages.musicplay}
                style={styles.imgstyle2}
              />
            </TouchableOpacity>
          )}
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: 15,
                color: '#fff',
                fontFamily: fontFamily.Sans_Regular,
                flex: 1,
              }}>
              {/* {item.musicName} */}
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#fff',
                fontFamily: fontFamily.Sans_Regular,
              }}>
              {/* 2:00 */}
              {/* {item?.duration} */}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Inspirational Speeches'} />
        {loading && <Loader />}
        {!loading && (
          <View style={styles.scrollviewcontainer}>
            <Text style={styles.songtxt}>Songs</Text>
            <FlatList
              data={firstList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    handlePullRefresh();
                  }}
                  colors={['#E4175A']}
                />
              }
              renderItem={renderItem}
              numColumns={2}
              ListFooterComponent={() => (
                <View>
                  <View
                    style={{
                      alignSelf: 'center',
                      marginTop: 20,
                    }}>
                    <BannerAd
                      unitId={TestIds.BANNER}
                      size={BannerAdSize.BANNER}
                      requestOptions={{
                        requestNonPersonalizedAdsOnly: true,
                      }}
                    />
                  </View>
                  <FlatList
                    data={data}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                          handlePullRefresh();
                        }}
                        colors={['#E4175A']}
                      />
                    }
                    renderItem={renderItem}
                    numColumns={2}
                  />
                </View>
              )}
            />
          </View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Inspirationalspeeches;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {flex: 1},
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
  imgstyle: {
    width: responsiveWidth(42),
    height: responsiveWidth(32),
    // backgroundColor: 'red',
  },
  imgstyle2: {
    width: responsiveWidth(9),
    height: responsiveWidth(9),
    // backgroundColor: 'red',
  },
  songtxt: {
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(3),
    color: '#fff',
    marginTop: responsiveHeight(2.5),
    marginLeft: responsiveWidth(5),
  },
});
