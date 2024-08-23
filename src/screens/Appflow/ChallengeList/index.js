import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Share,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {fontFamily} from '../../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {FAB} from 'react-native-paper';
import Modal from 'react-native-modal';

import {useNavigation} from '@react-navigation/native';
import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import PushNotification, {Importance} from 'react-native-push-notification';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SuccessModal from '../../../components/SuccessModal';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {
  AdEventType,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {fullScreenAdId, rewardedAdId} from '../../../utils/adsKey';

const adUnitId = fullScreenAdId;

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
  requestNonPersonalizedAdsOnly: true,
});

const ChallengeList = props => {
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
  const navigation = useNavigation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const {
    challengeName,
    challengeDescription,
    img,
    daysDesc,
    hiddenStatus,
    _id,
    adderId,
  } = props?.route.params;

  const [date, setDate] = useState(null);
  const [isSetTimerModalVisible, setIsSetTimerModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false); //handle share modal

  //challenge detail
  const [loading, setLoading] = useState(false);
  const [challenge_Detail, setChallenge_Detail] = useState(null);
  const [challenge_Days, setChallenge_Days] = useState([]);

  const [image, setImage] = useState('');

  const [started_challenge_days_id, setStarted_challenge_days_id] =
    useState('');
  const [challenge_uniq_id, setChallenge_uniq_id] = useState('');

  const [selected_challenge_status, setSelected_challenge_status] =
    useState('');

  const [extraData, setExtraData] = useState(new Date());
  const [todayDate, setTodayDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = React.useState({open: false});
  const [modaltype, setModaltype] = useState('');
  const onStateChange = ({open}) => setState({open});
  const [iscompleted, setIsCompleted] = useState(false);
  const {open} = state;
  const [currentday, setCurrentday] = useState('');
  const [descr, setdescr] = useState('');

  const [isChallengeRestarted, setIsChallengeRestarted] = useState(false);
  const [showFullScreenAd, setShowFullScreenAd] = useState(false);

  const savedate = async () => {
    var InsertAPIURL = global.url + 'api/userChallenge/setTimer';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        title: challengeName,
        body: challengeDescription,
        startDate: date,
        userId: adderId,
        challengeId: _id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        // alert('this is error' + error);
      });
  };

  const getStartedChallengeDetails = async id => {
    try {
      console.log('get started challenge details : ', id);
      setLoading(true);
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      await fetch(api.get_started_challenge, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          started_challenge_id: id,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false) {
            setChallenge_Detail(response[0]?.started_challenge_detail);
            let daysList = response[0].started_challenge_days
              ? response[0].started_challenge_days
              : [];
            console.log('daysList  :  ', daysList?.length);
            let started_date =
              response[0]?.started_challenge_detail?.started_date;

            let today_date = moment(new Date()).format('YYYY-MM-DD');
            setTodayDate(today_date);
            //getting dates
            let prev_Date = started_date;
            let list = [];
            for (const element of daysList) {
              let splited_date = prev_Date.split('-');
              let day = splited_date['0'];
              let month = splited_date['1'];
              let year = splited_date['2'];
              let dateString = year + '-' + month + '-' + day;
              var tomorrow = new Date(dateString);
              let formatted_Date = moment(new Date(tomorrow)).format(
                'YYYY-MM-DD',
              );

              if (formatted_Date == today_date) {
                setCurrentday(element?.day_detail?.day_no);
                setdescr(element?.day_detail?.description);
                setStarted_challenge_days_id(element?.day?.id);
                setSelected_challenge_status(element?.day?.day_complete_status);
              }

              let obj = {
                day: {
                  ...element?.day,
                  date: formatted_Date,
                },
                day_detail: {
                  ...element?.day_detail,
                },
              };

              list.push(obj);

              tomorrow.setDate(tomorrow.getDate() + 1);
              prev_Date = moment(new Date(tomorrow)).format('DD-MM-YYYY');
            }
            // setChallenge_Days(daysList);
            setChallenge_Days(list);
          } else {
            //error or data not found
            console.log('response  :  ', response);
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
    } catch (error) {
      console.log('Error raised : ', error);
      Snackbar.show({
        text: 'Something went wrong.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  //get user all completed days of this challenge

  const getAllCompletedDays = challenge_Days => {
    // day_complete_status
    const filter = challenge_Days?.filter(
      item =>
        item?.day?.day_complete_status == 'true' ||
        item?.day?.day_complete_status == true,
    );
    let total_days = challenge_Days?.length;
    let total_completed_days = filter?.length;
    let total_uncompleted_days = total_days - total_completed_days;
    if (total_completed_days == total_days) {
      //call complete challenge api to mark this  challenge as completed for current user
      markChallengeASCompleted();
    } else {
      console.log('all days are not completed yet...');
    }
  };

  const markChallengeASCompleted = async () => {
    setLoading(true);

    let user_id = await AsyncStorage.getItem('user_id');

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      started_user_id: user_id,
      challenge_uniq_id: challenge_uniq_id,
    };

    console.log('data passed to mark challenge as completed : ', data);

    await fetch(api.complete_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          //handle success
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });

          setSelected_challenge_status(true);
          setTimeout(() => {
            interstitial?.show();
          }, 800);
        } else {
          //error or data not found
          Snackbar.show({
            text: response[0]?.message,
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
  };

  const handleCompleteDay = async () => {
    // getAllCompletedDays();
    // return;

    if (challenge_Days?.length == 0) {
      getAllCompletedDays(challenge_Days);
      return;
    } else if (currentday?.length == 0) {
      Snackbar.show({
        text: 'Please Select Day to Complete.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);

      let user_id = await AsyncStorage.getItem('user_id');

      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let data = {
        started_challenge_days_id: started_challenge_days_id,
        user_id: user_id,
        challenge_uniq_id: challenge_uniq_id,
        current_status: 'true',
      };

      console.log('data passed to complete challenge : ', data);

      await fetch(api.update_day_complete_status, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('challenge completed response: ' + response);
          if (response[0]?.error == false) {
            setModaltype('challengecompleted');
            setModalVisible(true);
            setIsCompleted(true);
            // getStartedChallengeDetails('44');

            //update local days state

            const newData = challenge_Days?.map(item => {
              if (item?.day?.id == started_challenge_days_id) {
                return {
                  ...item,
                  day: {
                    ...item?.day,
                    day_complete_status: 'true',
                  },
                };
              } else {
                return {
                  ...item,
                };
              }
            });
            getAllCompletedDays(newData); //get challenge completed days.if all days are completed then we will mark this challenge as completed for current user
            setExtraData(new Date());
            setChallenge_Days(newData);
            setCurrentday('');
          } else {
            //error or data not found

            Snackbar.show({
              text: response[0]?.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
          }
        })
        .catch(error => {
          console.log('error  : ', error);
          Snackbar.show({
            text: 'Something went wrong.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  //restart challenge
  const handleRestartChallenge = async () => {
    console.log('started user id  :   ', challenge_Detail?.started_user_id);
    console.log('challenge_uniq_id :  ', challenge_Detail?.challenge_uniq_id);

    setLoading(true);

    let user_id = await AsyncStorage.getItem('user_id');

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      started_user_id: challenge_Detail?.started_user_id,
      challenge_uniq_id: challenge_Detail?.challenge_uniq_id,
    };

    console.log('data passed to restart challenge  : ', data);

    await fetch(api.restart_a_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        console.log('response of restart challenge is  :   ', response);
        if (response[0]?.error == false) {
          getStartedChallengeDetails(response[0]?.data?.id);
          setIsChallengeRestarted(true);
          navigation?.goBack();
        } else {
          //error or data not found
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        console.log('Error  :  ', error);
        Snackbar.show({
          text: 'Something went wrong.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
        setTimeout(() => {
          navigation?.goBack();
        }, 1500);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //hide challenge
  const handleHideChallenge = async () => {
    setLoading(true);

    if (challenge_Detail?.hide_status == 'true') {
      setTimeout(() => {
        setLoading(false);
        Snackbar.show({
          text: 'This challenge is already hidden.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
        props.navigation.replace('HiddenChallenges');
      }, 1000);
      return;
    }
    try {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let user_id = await AsyncStorage.getItem('user_id');
      let data = {
        started_challenge_id: challenge_Detail?.id,
        // user_id: user_id,
        started_user_id: user_id,
        challenge_uniq_id: challenge_Detail?.challenge_uniq_id,
        current_hide_status: challenge_Detail?.hide_status,
        // ? challenge_Detail?.hide_status
        // : false,
      };

      await fetch(api.hide_a_challenge, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == true) {
            //error or data not found
            Snackbar.show({
              text: response[0]?.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
          } else {
            //handle success
            Snackbar.show({
              text: 'Challenge hidden successfully',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
            props.navigation?.replace('HiddenChallenges');
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
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  useEffect(() => {
    if (props?.route?.params) {
      setChallenge_uniq_id(props?.route.params?.challenge_uniq_id);
      // setChallenge_uniq_id('640867d1b38b6');
      setImage(props?.route?.params?.img);
    }
  }, [props?.route?.params]);

  const [loaded, setLoaded] = useState(false);

  // _________________________________FULL Screen Ad________________________________________

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('loaded......');
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
        handleRestartChallenge();
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // _________________________________FULL Screen Ad________________________________________

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('ad loaded......');
        interstitial.load();
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  useEffect(() => {
    getStartedChallengeDetails(props?.route?.params?.id);
    // getStartedChallengeDetails('56');
    let today = new Date();
    let date =
      today.getFullYear() +
      '-' +
      (today.getMonth() + 1) +
      '-' +
      today.getDate();
    setDate(date);
  }, []);

  const buildLink = async challenge_uniq_id => {
    const link = await dynamicLinks().buildLink({
      // link: 'https://invertase.io',
      link: `https://fortydayschallenge.page.link/MyChallenges?${challenge_uniq_id}`,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://fortydayschallenge.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      // analytics: {
      //   campaign: 'banner',
      // },
    });

    return link;
  };

  const myCustomeShare = async () => {
    console.log('challenge uniq id : ', challenge_uniq_id);
    // let a = 'date: ' + time;
    // let a = 'demo://app/EditProfile';
    // let a = 'https://app.example.com';
    let dynamicLink = await buildLink(challenge_uniq_id);
    console.log('dynamicLink  : ', dynamicLink);

    // let a = 'http://disciplineguru.co';
    let a = dynamicLink;
    try {
      const result = await Share.share({
        message: a,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    console.warn('A date has been picked: ', date);
    scheduleNotification(date);
    hideDatePicker();
  };

  const createNotificationChannel = () => {
    PushNotification.createChannel(
      {
        channelId: 'channel-id',
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  const scheduleNotification = async date => {
    try {
      console.log('date selected  : ', date);
      console.log(
        'started challenge detail   : ',
        challenge_Detail?.challenge_uniq_id,
      );
      setLoading(true);

      let challenge_Info = await getSpecificChallengeDetail(
        challenge_Detail?.challenge_uniq_id,
      );
      if (challenge_Info == false) {
        alert('Something went wrong');
        setLoading(false);
      } else {
        console.log('scheduleNotification called ...');
        createNotificationChannel();
        let challenge_name = challenge_Info[0]?.challenge_detail?.name;
        let description = `Complete your challenge  ${challenge_name}`;
        let obj = {
          challenge_detail: challenge_Info[0]?.challenge_detail,
          started_challenge_detail: challenge_Detail,
          notification_detail: {
            date: date,
            title: challenge_name,
            description: description,
          },
        };

        // await AsyncStorage.setItem()
        AsyncStorage.getItem('Notifications')
          .then(notifications => {
            const list = notifications ? JSON.parse(notifications) : [];
            list.unshift(obj);
            AsyncStorage.setItem('Notifications', JSON.stringify(list));
          })
          .catch(err => {
            console.log('error while save notifications to local storage');
          });

        PushNotification.localNotificationSchedule({
          channelId: 'channel-id',
          //... You can use all the options from localNotifications
          // id: task_id,
          title: challenge_name,
          message: description, // (required)
          date: date,
          allowWhileIdle: false, // (optional) set notification to work while on doze, default: false
          playSound: true,
          // soundName: 'tick1.mp3',
          // soundName: notification_sound,
          vibrate: true,
          /* Android Only Properties */
          repeatTime: 1, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
          data: obj,
        });
        setLoading(false);
        setIsSetTimerModalVisible(true);
      }
    } catch (error) {
      setLoading(false);
      console.log('error raised during scheduleNotification : ', error);
    }
  };

  const getSpecificChallengeDetail = async uniq_id => {
    return new Promise(async (resolve, reject) => {
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
            if (list?.length > 0) {
              resolve(list);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          resolve(false);
        });
    });
  };

  const handleCommunityShare = async () => {
    console.log('handle community share....');

    setLoading(true);

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      challenge_uniq_id: props?.route.params?.challenge_uniq_id,
      replicated_by_user_id: user_id,
    };
    await fetch(api.share_challenge_to_community, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        console.log('share challenge response  :   ', response);
        if (response[0]?.error == false) {
          Snackbar.show({
            text: 'Challenge Shared to community successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });
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
      <View>
        <TouchableOpacity
          onPress={() => {
            setCurrentday(item?.day_detail?.day_no);
            setdescr(item?.day_detail?.description);
            setStarted_challenge_days_id(item?.day?.id);
            setSelected_challenge_status(item?.day?.day_complete_status);
          }}
          style={[
            styles.singleview,
            {
              marginRight:
                index === challenge_Days.length - 1 ? responsiveWidth(4) : null,
              backgroundColor:
                item?.day?.id === started_challenge_days_id
                  ? isdarkmode
                    ? seconddark
                    : second
                  : item?.day?.day_complete_status == 'true'
                  ? '#E4175A'
                  : item?.day?.date <= todayDate &&
                    item?.day?.day_complete_status == 'false'
                  ? '#707070'
                  : isdarkmode
                  ? soliddark
                  : solid,
              // item?.day_detail?.day_no === currentday
              height:
                item?.day?.id === started_challenge_days_id
                  ? responsiveWidth(24)
                  : responsiveWidth(18),
              marginTop:
                item?.day?.id === started_challenge_days_id
                  ? responsiveWidth(-3)
                  : null,
            },
          ]}>
          <Text style={styles.daytxt}>Day</Text>
          <Text style={styles.daytxt}>{item?.day_detail?.day_no}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        {loading && <Loader color={'red'} />}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <View>
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
                  }}></View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: responsiveWidth(92),
                  alignSelf: 'center',
                  alignItems: 'center',
                  paddingBottom: responsiveHeight(6),
                  paddingTop: responsiveHeight(2),
                }}>
                {image?.length > 0 ? (
                  <FastImage
                    // source={appImages.runner}
                    source={{uri: image}}
                    style={styles.runnerimg}
                    resizeMode="contain"
                  />
                ) : (
                  <FastImage
                    source={appImages.runner}
                    style={styles.runnerimg}
                    resizeMode="contain"
                  />
                )}

                {/* ====================model for share-------------------------- */}
                <View style={styles.centeredView}>
                  <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    // visible={true}
                    onRequestClose={() => {
                      setModalVisible1(!modalVisible1);
                    }}>
                    <View style={styles.centeredView}>
                      <View style={styles.nmodalView}>
                        <View
                          style={{
                            flexDirection: 'row',
                            marginBottom: 10,
                          }}>
                          <Text style={{...styles.ntextStyle, flex: 1}}>
                            Share to:
                          </Text>

                          <TouchableOpacity
                            onPress={() => setModalVisible1(!modalVisible1)}
                            style={{}}>
                            <MaterialIcons
                              name="close"
                              size={24}
                              color={'#EC1D94'}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{marginTop: 30}}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                              styles.nbutton,
                              styles.nbuttonClose1,
                              {backgroundColor: '#CA6FE4', paddingLeft: 10},
                            ]}
                            onPress={() => {
                              setModalVisible1(!modalVisible1);

                              handleCommunityShare();
                            }}
                            // onPress={() => setModalVisible1(!modalVisible1)}
                          >
                            <Text style={[styles.textStyle, {color: 'white'}]}>
                              Share to community
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                              styles.nbutton,
                              styles.nbuttonClose,
                              {backgroundColor: '#CA6FE4'},
                            ]}
                            onPress={() => {
                              setModalVisible1(!modalVisible1);
                              // myCustomeShare();
                            }}
                            // onPress={() => Remove()}
                          >
                            <Text style={[styles.textStyle, {color: 'white'}]}>
                              Share to friends
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </View>

                <View
                  style={{
                    width: responsiveWidth(65),
                    marginLeft: responsiveWidth(2.5),
                  }}>
                  <Text
                    style={[
                      styles.challengetxt,
                      {color: isdarkmode ? soliddark : solid},
                    ]}>
                    {challengeName}
                  </Text>
                  <Text
                    style={[
                      styles.loremtxt,
                      {color: isdarkmode ? seconddark : second},
                    ]}>
                    {challengeDescription}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.mainbottom}>
              <FlatList
                data={challenge_Days}
                renderItem={renderItem}
                extraData={extraData}
                horizontal={true}
                contentContainerStyle={styles.listcontainer}
                showsHorizontalScrollIndicator={false}
              />
              {descr?.length > 0 && (
                <View style={styles.txtview}>
                  <Text style={styles.centertxt}>{descr}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={{...styles.fixedfooter, marginBottom: 85}}>
            <TouchableOpacity
              onPress={() => setModalVisible1(true)}
              style={[
                styles.sharebutton,
                {backgroundColor: isdarkmode ? soliddark : solid},
              ]}
              activeOpacity={0.7}>
              <Text style={styles.sharetxt}>Share</Text>
            </TouchableOpacity>
            {/* {iscompleted == false ? ( */}
            {selected_challenge_status == 'true' ||
            selected_challenge_status == true ? (
              <TouchableOpacity
                // onPress={() => {
                //   handleCompleteDay();
                // }}
                disabled
                style={{...styles.challengebutton}}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.challengebuttontxt,
                    {color: isdarkmode ? seconddark : second},
                  ]}>
                  Challenge completed
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  handleCompleteDay();
                }}
                style={styles.challengebutton}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.challengebuttontxt,
                    {color: isdarkmode ? seconddark : second},
                  ]}>
                  Complete Challenge
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        <SuccessModal
          title={'Timer Set Successfully'}
          isVisible={isSetTimerModalVisible}
          setIsVisible={setIsSetTimerModalVisible}
          onOK={() => setIsSetTimerModalVisible(false)}
        />
        <SuccessModal
          title={'Challenge Restarted Successfully'}
          isVisible={isChallengeRestarted}
          setIsVisible={setIsChallengeRestarted}
          onOK={() => setIsChallengeRestarted(false)}
        />
        <SuccessModal
          title={'Timer Set Successfully'}
          isVisible={isSetTimerModalVisible}
          setIsVisible={setIsSetTimerModalVisible}
          onOK={() => setIsSetTimerModalVisible(false)}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="time"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        <FAB.Group
          open={open}
          icon={open ? appImages.crossfab : appImages.iconfab}
          color={'#fff'}
          fabStyle={[
            styles.fabstylemain,
            {
              backgroundColor: open
                ? isdarkmode
                  ? seconddark
                  : second
                : isdarkmode
                ? soliddark
                : solid,
            },
          ]}
          actions={[
            {
              icon: appImages.restartfab,
              small: false,
              onPress: () => {
                setModaltype('restart');
                setModalVisible(true);
              },
              style: [
                // styles.fabStyle,
                {backgroundColor: isdarkmode ? soliddark : solid},
              ],
            },
            {
              icon: appImages.hidefab,
              small: false,
              onPress: () => {
                setModaltype('hidefab');
                setModalVisible(true);
              },
              style: [
                // styles.fabStyle,
                {backgroundColor: isdarkmode ? soliddark : solid},
              ],
            },
            {
              icon: appImages.notificationsfab,
              small: false,
              // onPress: () => navigation.navigate('NotificationStackScreens'),
              onPress: () => showDatePicker(),
              style: [
                // styles.fabStyle,
                {backgroundColor: isdarkmode ? soliddark : solid},
              ],
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
        <Modal
          animationIn={'fadeIn'}
          animationOut={'zoomOut'}
          statusBarTranslucent={true}
          backdropColor={'black'}
          backdropOpacity={0.7}
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.modalview}>
            {modaltype == 'challengecompleted' ? (
              <>
                <Image
                  source={appImages.alert}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveWidth(12),
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={[
                    styles.modaltxt1,
                    {
                      // fontFamily: fontFamily.Poppins_SemiBold,
                      color: isdarkmode ? soliddark : solid,
                      fontSize: 15,
                    },
                  ]}>
                  Challenge Completed !
                </Text>
                {/* <Text
                  style={[
                    styles.modaltxt2,
                    {color: isdarkmode ? soliddark : solid},
                  ]}>
                 
                </Text> */}
                <TouchableOpacity
                  style={styles.modalbutton}
                  // style={{
                  //   backgroundColor: '#CA6FE4',
                  //   width: 90,
                  //   height: 35,
                  //   borderRadius: 20,
                  //   alignSelf: 'center',
                  //   alignItems: 'center',
                  //   justifyContent: 'center',
                  // }}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setSelected_challenge_status(true);
                  }}>
                  <Text
                    style={[
                      styles.modaltxt3,
                      {color: isdarkmode ? seconddark : second},
                      // {color: '#FFF'},
                    ]}>
                    OK
                  </Text>
                </TouchableOpacity>
              </>
            ) : modaltype == 'hidefab' ? (
              <>
                <Image
                  source={appImages.alert}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveWidth(12),
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={[
                    styles.modaltxt2,
                    {color: isdarkmode ? soliddark : solid},
                  ]}>
                  Do You want to Hide this Challenge?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={styles.modalbutton}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text
                      style={[
                        styles.modaltxt3,

                        {color: isdarkmode ? seconddark : 'gray'},
                      ]}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalbutton}
                    onPress={() => {
                      // setModalVisible(!modalVisible);
                      // props.navigation.navigate('HiddenChallenges');
                      setModalVisible(!modalVisible);

                      handleHideChallenge();
                    }}>
                    <Text
                      style={[
                        styles.modaltxt3,
                        {color: isdarkmode ? soliddark : solid},
                      ]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : modaltype == 'restart' ? (
              <>
                <Image
                  source={appImages.alert}
                  style={{
                    width: responsiveWidth(12),
                    height: responsiveWidth(12),
                    alignSelf: 'center',
                  }}
                />
                <Text
                  style={[
                    styles.modaltxt2,
                    {color: isdarkmode ? soliddark : solid},
                  ]}>
                  Do You want to Restart this Challenge?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}>
                  <TouchableOpacity
                    style={styles.modalbutton}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text
                      style={[
                        styles.modaltxt3,

                        {color: isdarkmode ? seconddark : 'gray'},
                      ]}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalbutton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      if (rewarded?.show()) {
                        //ad loaded
                        console.log('video ad displayed');
                      } else {
                        handleRestartChallenge();
                      }
                    }}>
                    <Text
                      style={[
                        styles.modaltxt3,
                        {
                          color: isdarkmode ? soliddark : solid,
                        },
                      ]}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : null}
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ChallengeList;

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
    // paddingBottom: responsiveHeight(3),
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
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    marginRight: 5,
    // backgroundColor: 'red',
    // alignSelf: 'center',
  },
  mainbottom: {
    marginTop: responsiveHeight(2),
  },
  challengetxt: {
    fontSize: responsiveFontSize(2.6),
    fontFamily: fontFamily.Sans_Regular,
  },
  loremtxt: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
    marginTop: responsiveHeight(1.6),
  },
  listcontainer: {
    paddingTop: responsiveHeight(3),
  },
  singleview: {
    width: responsiveWidth(18),
    height: responsiveWidth(18),

    marginLeft: responsiveWidth(4),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
    marginBottom: responsiveHeight(2.5),
    borderRadius: responsiveWidth(3),
  },
  daytxt: {
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
  },
  txtview: {
    backgroundColor: '#fff',
    width: responsiveWidth(87),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  centertxt: {
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(5),
    fontFamily: fontFamily.Sans_Regular,
    color: '#000000',
    opacity: 0.5,
    fontSize: responsiveFontSize(2.6),
  },
  sharebutton: {
    alignSelf: 'center',
    marginTop: responsiveHeight(2.4),
    width: responsiveWidth(35),
    paddingVertical: responsiveHeight(1.6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  challengebutton: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(2.3),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(4),
    width: responsiveWidth(87),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  sharetxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.4),
  },
  challengebuttontxt: {
    fontFamily: fontFamily.Sans_Regular,

    fontSize: responsiveFontSize(2.4),
  },
  fixedfooter: {
    marginBottom: responsiveHeight(3),
  },
  fabicon2: {
    width: responsiveWidth(17),
    height: responsiveWidth(17),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(100),
  },
  fabStyle: {
    height: responsiveWidth(16),
    width: responsiveWidth(16),
    // marginLeft: responsiveWidth(2),
    // borderRadius: responsiveWidth(100),
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: responsiveWidth(3)
    left: responsiveWidth(2),
    // alignSelf:"center"
  },
  fabstylemain: {
    height: responsiveWidth(16),
    width: responsiveWidth(16),
    // marginLeft: responsiveWidth(2),
    // borderRadius: responsiveWidth(100),
    alignItems: 'center',
    justifyContent: 'center',
    // marginRight: responsiveWidth(6.5)
    // alignSelf:"center"
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#EC1D94',
  },
  modalview: {
    // height: responsiveHeight(30),
    alignSelf: 'center',
    width: responsiveWidth(75),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(7),
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(4.5),
  },
  modaltxt1: {
    padding: 30,
    fontFamily: fontFamily.Poppins_SemiBold,
    fontSize: responsiveFontSize(2.7),
    alignSelf: 'center',
  },
  modaltxt2: {
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(2.2),
    alignSelf: 'center',
    paddingVertical: responsiveHeight(3),
    width: responsiveWidth(55),
    textAlign: 'center',
  },
  modaltxt3: {
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(2.2),
  },
  modalbutton: {
    alignSelf: 'flex-end',
    marginRight: responsiveWidth(7),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
    // backgroundColor: 'red',
  },
  nbutton: {
    borderRadius: responsiveWidth(3.2),
    padding: 15,
    margin: 4,
    elevation: 2,
    marginVertical: responsiveWidth(3),
    width: responsiveWidth(70),
  },

  nbuttonClose: {
    // top: 50,
    // width: 180,
    // backgroundColor: "black",
  },

  nbuttonClose1: {
    // top: 50,
    // width: 180,
    // backgroundColor: COLORS.orange,s
  },
  ntextStyle: {
    fontSize: 18,
    fontWeight: '400',
    // textAlign: "center",
    color: '#EC1D94',
  },
  nmodalView: {
    // margin: 20,
    // width: 250,
    // height: 200
    width: responsiveWidth(85),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: responsiveWidth(6),
    paddingHorizontal: responsiveWidth(7),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
