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
import {TouchableRipple} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';

import Loader from '../../../components/Loader/Loader';
import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CommunityChallengeView = props => {
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);

  // const {challangeid,challengeName,image,addedBy,challengeDescription,daysDesc,likes } = props?.route.params;
  // let challangeid,
  //   challengeName,
  //   image,
  //   addedBy,
  //   challengeDescription,
  //   daysDesc,
  //   likes = 'test';
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [daysList, setDaysList] = useState([]);
  //challenge detail
  const [challengeName, setChallengeName] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [challengeImage, setChallengeImage] = useState('');
  const [challengeAddedBy, setChallengeAddedBy] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');

  const [challengeDetail, setChallengeDetail] = useState([]);

  useEffect(() => {
    getChallengeDetail(props?.route?.params?.uniq_id);
    setLike(props?.route?.params?.liked);
    // setLikeCount(
    //   props?.route?.params?.likes_count ? props?.route?.params?.likes_count : 0,
    // );

    // if (props?.route?.params) {
    //   setChallengeId(props.route.params?.item?.challenge_detail?.id);
    //   setChallengeName(props.route.params?.item?.challenge_detail?.name);
    //   setChallengeImage(
    //     BASE_URL_IMAGE +
    //       '/' +
    //       props.route.params?.item?.challenge_detail?.image,
    //   );
    //   setChallengeAddedBy(props.route.params?.item?.challenge_detail?.addedby);
    //   setChallengeDescription(
    //     props.route.params?.item?.challenge_detail?.description,
    //   );
    //   if (props?.route?.params?.item?.challenge_days) {
    //     setDaysList(props?.route?.params?.item?.challenge_days);
    //   } else {
    //     setDaysList([]);
    //   }
    // }
  }, [props?.route?.params]);

  const getChallengeDetail = async uniq_id => {
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      uniq_id: uniq_id,
    };

    await fetch(api.get_single_challenge_detail, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          //also update local list
          let list = response[0]?.all_record ? response[0]?.all_record : [];
          setChallengeDetail(list);
          setLikeCount(list[0]?.likes_count ? list[0]?.likes_count : 0);
        } else {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong.Please try again',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const liked = async challangeid => {
    // console.log("comming-----"+_id)
    // var InsertAPIURL =
    //   global.url +
    //   'challenge/likeCommunityChallenge/?challengeId=' +
    //   challangeid;
    // var headers = {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    // };
    // await fetch(InsertAPIURL, {
    //   method: 'PUT',
    //   headers: headers,
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     alert('Challenge Liked!');
    //   })
    //   .catch(error => {
    //     alert('this is error' + error);
    //   });
  };

  //this function will decide which method call like/dislike based on like status
  const handleHeartPress = item => {
    console.log('item?.liked  :  ', item);

    if (like) {
      //handle dislike
      handleDisLike(item);
    } else {
      //handle like
      handleLike(item);
    }
  };

  const handleLike = async itemSelected => {
    // onChangeValue(itemSelected);
    // return;
    let user_id = await AsyncStorage.getItem('user_id');
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      user_id: user_id,
      challenge_uniq_id: itemSelected?.challenge_uniq_id,
    };
    await fetch(api.like_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          //also update local list
          console.log('updating like status :: ', itemSelected);
          setLike(true);
          setLikeCount(likeCount + 1);
        } else {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong.Please try again',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDisLike = async itemSelected => {
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      user_id: user_id,
      challenge_uniq_id: itemSelected?.challenge_uniq_id,
    };
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(api.dislike_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          //also update local list
          // onChangeValue(itemSelected);
          setLike(false);
          setLikeCount(likeCount - 1);
        } else {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong.Please try again',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          paddingHorizontal: responsiveWidth(4),
          justifyContent: 'space-between',
          paddingVertical: responsiveHeight(1),
          flexDirection: 'row',
          marginBottom: responsiveHeight(2),
        }}>
        <Text style={[styles.stxt, {textAlign: 'center', color: '#000000'}]}>
          Day{'\n'}
          {item?.day_no}
        </Text>
        <Text
          style={[
            styles.stxt,
            {textAlign: 'center', alignSelf: 'center', color: '#9A9A9A'},
          ]}>
          {item.description}
        </Text>
      </View>
    );
  };
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <View {...props} style={styles.main}>
          <View style={styles.header}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableRipple
                onPress={() => {
                  props.navigation.goBack();
                }}
                rippleColor="rgba(0, 0, 0, .1)"
                style={styles.drawerview}>
                <FastImage
                  source={appImages.backbutton}
                  resizeMode="contain"
                  style={styles.drawericonstyle}
                />
              </TouchableRipple>
            </View>
            {props?.route?.params?.type == 'view' ||
            props?.route?.params?.isStarted != true ? null : (
              <TouchableOpacity
                activeOpacity={0.65}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: responsiveWidth(3.5),
                }}
                onPress={() => {
                  // setLike(!like);
                  // liked(challengeId);
                  handleHeartPress(challengeDetail[0]);
                }}>
                <Image
                  source={like ? appImages.heartred : appImages.heartempty}
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              width: responsiveWidth(100),
              paddingBottom: responsiveHeight(2),
            }}>
            {challengeDetail[0]?.challenge_detail?.image ? (
              <Image
                source={{
                  uri: `${BASE_URL_IMAGE}/${challengeDetail[0]?.challenge_detail?.image}`,
                }}
                style={{
                  width: responsiveWidth(35),
                  height: responsiveWidth(35),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            ) : (
              <View
                style={{
                  width: responsiveWidth(35),
                  height: responsiveWidth(35),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}></View>
            )}
          </View>
        </View>
        {loading && <Loader color={'red'} />}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollviewcontainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={[styles.btxt, {marginVertical: responsiveHeight(1.5)}]}>
              {challengeDetail[0]?.challenge_detail?.name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={appImages.heartred}
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  resizeMode: 'contain',
                  marginRight: responsiveWidth(2.5),
                }}
              />

              <Text style={styles.btxt}>{likeCount}</Text>
            </View>
          </View>
          <Text style={[styles.stxt, {marginBottom: responsiveHeight(4)}]}>
            {/* {challengeDetail[0]?.challenge_detail?.addedby} */}
            {challengeDetail[0]?.user_data
              ? challengeDetail[0]?.user_data?.name
              : challengeDetail[0]?.challenge_detail?.addedby}
          </Text>
          <Text style={styles.stxt}>Challenge description:</Text>
          <Text
            style={[
              styles.stxt,
              {
                color: isdarkmode ? '#fff' : '#4D4D4D',
                marginVertical: responsiveHeight(2.5),
              },
            ]}>
            {challengeDetail[0]?.challenge_detail?.description}
          </Text>

          {challengeDetail?.length > 0 && (
            <FlatList
              // data={daysDesc}
              data={challengeDetail[0]?.challenge_days}
              renderItem={renderItem}
            />
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CommunityChallengeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(6),
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
  main: {
    width: responsiveWidth(100),
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(2.5),
    borderBottomLeftRadius: responsiveWidth(7),
    borderBottomRightRadius: responsiveWidth(7),
  },
  header: {
    width: responsiveWidth(92),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  drawericonstyle: {
    width: responsiveWidth(5.3),
    height: responsiveWidth(5.3),
  },
  drawerview: {
    // backgroundColor: 'red',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(10),
  },
  coinstyle: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
  },
  cointxt: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
  },
  headertxtstyle: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(3.2),
    marginLeft: responsiveWidth(2),
  },
  btxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.6),
  },
  stxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
  },
});
