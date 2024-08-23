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
import React, {useState} from 'react';
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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import {LocaleConfig} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const Challenge_Date = props => {
  // {navigation,route},
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

  const {challengeName, _id, adderId} = props?.route.params;

  const [loading, setLoading] = useState(false);

  const [markedDates, setMarkedDates] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const [textdate, setTextdate] = useState('');
  const [formatedDate, setFormatedDate] = useState('');
  const [dateapi, setdateapi] = useState('');

  const savedate = async () => {
    if (formatedDate?.length == 0) {
      Snackbar.show({
        text: 'Please Select Date to Start Challenge.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      handleStartChallenge();
    }

    // var InsertAPIURL = global.url + 'api/userChallenge/takeUserChallenge';
    // var headers = {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    // };

    // await fetch(InsertAPIURL, {
    //   method: 'POST',
    //   headers: headers,
    //   body: JSON.stringify({
    //     challengeId: _id,
    //     userId: adderId,
    //     startDate: global.Challenge_Date,
    //   }),
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     console.log(response);
    //     navigation.goBack();
    //   })
    //   .catch(error => {
    //     alert('this is error' + error);
    //   });
  };

  const handleStartChallenge = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    let challenge_uniq_id = props.route.params.challenge_uniq_id;
    console.log({formatedDate, user_id, challenge_uniq_id});
    console.log(
      'props.route.params?.item : ',
      props.route.params?.item?.challenge_detail,
    );
    let challenge_detail =
      props.route.params?.item?.challenge_detail?.description;
    let challengeDescription = challenge_detail?.description;
    let image = challenge_detail?.image;
    let id = challenge_detail?.uniq_id;
    let addedby = challenge_detail?.addedby;
    let daysList = props.route.params?.item?.challenge_days;

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
          // started_date: moment(new Date()).format('DD-MM-YYYY'),
          started_date: formatedDate,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false) {
            //handle success
            props?.navigation.replace('ChallengeList', {
              challengeName: challengeName,
              challengeDescription: challengeDescription,
              img: image,
              // daysDesc: daysDesc,
              daysDesc: daysList,
              // hiddenStatus: hiddenStatus,
              hiddenStatus: false,
              _id: id,
              // adderId: adderId,
              adderId: addedby,
              id: response[0]?.data?.id,
              challenge_uniq_id: challenge_uniq_id,
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
            // props?.navigation.navigate('ChallengeList', {
            //   challengeName: challengeName,
            //   challengeDescription: challengeDescription,
            //   img: image,
            //   // daysDesc: daysDesc,
            //   daysDesc: daysList,
            //   // hiddenStatus: hiddenStatus,
            //   hiddenStatus: false,
            //   _id: id,
            //   // adderId: adderId,
            //   adderId: addedby,
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
          console.log('error  ::  ', error);
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
      console.log('challenge_uniq_id  not found');
      Snackbar.show({
        text: 'Something went wrong.Please Try again later',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  const getSelectedDayEvents = date => {
    let markedDates = {};
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    let serviceDate = moment(date);
    serviceDate = serviceDate.format('DD.MM.YYYY');
    setSelectedDate(serviceDate);
    setMarkedDates(markedDates);
    setTextdate(moment(date).format('ddd, MMMM YY'));
    setFormatedDate(moment(date).format('DD-MM-YYYY'));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Select Date'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          {loading && <Loader color={isdarkmode ? soliddark : solid} />}
          <View
            style={{
              width: responsiveWidth(88),
              alignSelf: 'center',
              backgroundColor: isdarkmode ? soliddark : solid,
              paddingVertical: responsiveHeight(3),
              paddingHorizontal: responsiveWidth(4),
              borderTopLeftRadius: responsiveWidth(3),
              borderTopRightRadius: responsiveWidth(3),
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            {selectedDate !== '' ? (
              <>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: fontFamily.Sans_Regular,
                    fontSize: responsiveFontSize(2.3),
                  }}>
                  {textdate}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.65}
                  // onPress={() => props.navigation.navigate('WriteNotes', {date: textdate,dateapi:dateapi})}
                >
                  <Image
                    source={appImages.whiteeditpencil}
                    style={{
                      width: responsiveWidth(5.5),
                      height: responsiveWidth(5.5),
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : null}
          </View>
          <Calendar
            style={{
              width: responsiveWidth(88),
              alignSelf: 'center',
            }}
            enableSwipeMonths
            //   initialDate="2022-04-01"
            onMonthChange={item => {
              console.log('THE MONTHS', item);
            }}
            onVisibleMonthsChange={item => {
              console.log('THE MONTHS VISIBLE', item);
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: isdarkmode ? soliddark : solid,
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: isdarkmode ? soliddark : solid,
              selectedDotColor: '#ffffff',
              arrowColor: 'orange',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: 'blue',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            markedDates={markedDates}
            onDayPress={day => {
              getSelectedDayEvents(day.dateString);
              global.Challenge_Date = day.dateString;
            }}
            hideExtraDays={true}
          />
          <View
            style={{
              marginTop: responsiveHeight(3),
              width: responsiveWidth(86),
              alignItems: 'flex-end',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              onPress={() => savedate()}
              style={{
                backgroundColor: isdarkmode ? seconddark : second,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(1),
                borderRadius: responsiveWidth(100),
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                elevation: 6,
              }}
              activeOpacity={0.6}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: fontFamily.Sans_Regular,
                  fontSize: responsiveFontSize(2.1),
                }}>
                {/* Save */}
                Start
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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

export default Challenge_Date;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    // zIndex: 1,
  },
});
