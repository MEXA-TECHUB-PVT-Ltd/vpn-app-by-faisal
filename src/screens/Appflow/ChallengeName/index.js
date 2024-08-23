import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily} from '../../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';

import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/moment';
import Loader from '../../../components/Loader/Loader';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const ChallengeName = props => {
  const route = useRoute();
  const navigation = useNavigation();

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
  const {
    // challengeName,
    // challengeDescription,
    img,
    daysDesc,
    hiddenStatus,
    _id,
    adderId,
  } = route.params;

  const [date, setDate] = useState('Select Date');

  const [loading, setLoading] = useState(false);

  //challenge detail
  const [challengeName, setChallengeName] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [challengeImage, setChallengeImage] = useState('');
  const [challengeAddedBy, setChallengeAddedBy] = useState('');
  const [challengeDescription, setChallengeDescription] = useState('');
  const [daysList, setDaysList] = useState([]);

  useEffect(() => {
    if (props?.route?.params) {
      getChallengeDetail(props?.route?.params?.uniq_id);
      // getStartedChallengeDetails(props?.route?.params?.uniq_id);
      // setChallengeId(props.route.params?.item?.challenge_detail?.id);
      // setChallengeName(props.route.params?.item?.challenge_detail?.name);
      // setChallengeImage(
      //   BASE_URL_IMAGE +
      //     '/' +
      //     props.route.params?.item?.challenge_detail?.image,
      // );
      // setChallengeAddedBy(props.route.params?.item?.challenge_detail?.addedby);
      // setChallengeDescription(
      //   props.route.params?.item?.challenge_detail?.description,
      // );

      // if (props?.route?.params?.item?.challenge_days) {
      //   setDaysList(props?.route?.params?.item?.challenge_days);
      // } else {
      //   setDaysList([]);
      // }
    }
  }, [props?.route?.params]);

  //get specific challenge detail
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
          let challenge_Details = list[0]?.challenge_detail;
          let challenges_Days = list[0]?.challenge_days
            ? list[0]?.challenge_days
            : [];
          setChallengeId(challenge_Details?.uniq_id);
          setChallengeName(challenge_Details?.name);
          setChallengeImage(BASE_URL_IMAGE + '/' + challenge_Details?.image);
          setChallengeAddedBy(challenge_Details?.addedBy);
          setChallengeDescription(challenge_Details.description);
          setDaysList(challenges_Days);

          getStartedChallengeDetails(challenge_Details);
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
      });
    // .finally(() => {
    //   setLoading(false);
    // });
  };

  //check this challenge is already started or not
  const getStartedChallengeDetails = async challenge_Details => {
    setLoading(true);
    console.log(
      'uniq id to get started challenge details : ',
      challenge_Details?.uniq_id,
    );
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      challenge_uniq_id: challenge_Details?.uniq_id,
    };

    await fetch(api.get_started_challenge_detail, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          navigation.replace('ChallengeList', {
            challenge_uniq_id:
              response[0]?.started_challenge_detail?.challenge_uniq_id,
            challengeName: challenge_Details.name,
            challengeDescription: challenge_Details.description,
            img: challenge_Details?.image,
            // daysDesc: daysDesc,
            daysDesc: response[0]?.started_challenge_days,
            hiddenStatus: response[0]?.started_challenge_detail?.hide_status,
            // _id: _id,
            adderId: challenge_Details.addedby,
            id: response[0]?.started_challenge_detail?.id,
          });
        } else {
          console.log('started challenge message : ', response[0]?.message);
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

  const handleStartChallenge = async () => {
    let user_id = await AsyncStorage.getItem('user_id');

    let challenge_uniq_id = props?.route?.params?.uniq_id;
    if (challenge_uniq_id) {
      setLoading(true);
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      await fetch(api.start_challenge, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          started_user_id: user_id,
          challenge_uniq_id: challenge_uniq_id,
          started_date: moment(new Date()).format('DD-MM-YYYY'),
        }),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response :::    ::  ', response);
          if (response[0]?.error == false) {
            //handle success

            navigation.replace('ChallengeList', {
              challenge_uniq_id: challenge_uniq_id,
              challengeName: challengeName,
              challengeDescription: challengeDescription,
              img: challengeImage,
              // daysDesc: daysDesc,
              daysDesc: daysList,
              hiddenStatus: hiddenStatus,
              _id: _id,
              adderId: adderId,
              id: response[0]?.data?.id,
            });

            // Snackbar.show({
            //   text: 'Something went wrong.',
            //   duration: Snackbar.LENGTH_LONG,
            //   backgroundColor: 'red',
            // });
          } else if (
            response[0]?.message ==
            `challenge ${challenge_uniq_id} already started for user ${user_id}`
          ) {
            Snackbar.show({
              text: response[0]?.message
                ? response[0]?.message
                : 'Something went wrong',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });

            // navigation.navigate('ChallengeList', {
            //   challenge_uniq_id: challenge_uniq_id,
            //   challengeName: challengeName,
            //   challengeDescription: challengeDescription,
            //   img: challengeImage,
            //   // daysDesc: daysDesc,
            //   daysDesc: daysList,
            //   hiddenStatus: hiddenStatus,
            //   _id: _id,
            //   adderId: adderId,
            // });
          } else {
            Snackbar.show({
              text: response[0]?.message
                ? response[0]?.message
                : 'Something went wrong',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
          }
        })
        .catch(error => {
          Snackbar.show({
            text: 'Something went wrong.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      Snackbar.show({
        text: 'Something went wrong.Please Try again later',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }

    // navigation.navigate('ChallengeList', {
    //   challengeName: challengeName,
    //   challengeDescription: challengeDescription,
    //   img: img,
    //   // daysDesc: daysDesc,
    //   daysDesc: daysList,
    //   hiddenStatus: hiddenStatus,
    //   _id: _id,
    //   adderId: adderId,
    // })
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        {loading && <Loader color={isdarkmode ? solid : '#fff'} />}

        <View style={styles.maintop}>
          <View style={styles.header}>
            <TouchableRipple
              onPress={() => props.navigation.goBack()}
              rippleColor="rgba(0, 0, 0, .1)"
              style={styles.drawerview}>
              <FastImage
                source={appImages.backbutton}
                resizeMode="contain"
                style={styles.drawericonstyle}
              />
            </TouchableRipple>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {/* <Text
                style={[
                  styles.cointxt,
                  {color: isdarkmode ? soliddark : solid},
                ]}>
                400{'  '}
              </Text>
              <FastImage
                source={appImages.coins}
                style={styles.coinstyle}
                resizeMode="contain"
              /> */}
            </View>
          </View>
          {challengeImage != '' && (
            <FastImage
              // source={{uri: global.url + img}}
              source={{uri: challengeImage}}
              style={styles.runnerimg}
              resizeMode="contain"
            />
          )}
        </View>
        {!loading && (
          <View style={styles.mainbottom}>
            <Text style={styles.challengetxt}>{challengeName}</Text>
            <Text style={styles.loremtxt}>{challengeDescription}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.replace('Challenge_Date', {
                  item: props?.route?.params?.uniq_id,
                  challenge_uniq_id: props?.route?.params?.uniq_id,
                  challengeName: challengeName,
                  _id: _id,
                  adderId: adderId,
                })
              }
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.buttontxt,
                  {color: isdarkmode ? seconddark : second},
                ]}>
                Select Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleStartChallenge()}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.buttontxt,
                  {color: isdarkmode ? seconddark : second},
                ]}>
                Start now
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <BannerAd
            unitId={bannerAdID}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ChallengeName;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    zIndex: 1,
  },
  header: {
    width: responsiveWidth(92),
    alignSelf: 'center',
    marginTop: responsiveHeight(2.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  maintop: {
    backgroundColor: '#fff',
    paddingBottom: responsiveHeight(4.5),
    borderBottomRightRadius: responsiveWidth(7),
    borderBottomLeftRadius: responsiveWidth(7),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
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
  runnerimg: {
    width: responsiveWidth(35),
    height: responsiveWidth(35),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  mainbottom: {
    width: responsiveWidth(85),
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  challengetxt: {
    color: '#fff',
    fontSize: responsiveFontSize(2.7),
    fontFamily: fontFamily.Sans_Regular,
  },
  loremtxt: {
    color: '#DFDFDF',
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
    marginTop: responsiveHeight(1.6),
    marginBottom: responsiveHeight(4),
  },
  button: {
    backgroundColor: '#fff',
    width: responsiveWidth(43),
    alignSelf: 'center',
    paddingVertical: responsiveHeight(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(3),
    borderRadius: responsiveWidth(100),
  },
  buttontxt: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.3),
  },
});
