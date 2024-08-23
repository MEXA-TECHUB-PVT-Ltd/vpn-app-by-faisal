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
  Modal,
  Image,
  Share,
  RefreshControl,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import {MenuProvider} from 'react-native-popup-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PushNotification, {Importance} from 'react-native-push-notification';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

// import { Modal } from 'react-native-paper';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import SuccessModal from '../../../components/SuccessModal';

import dynamicLinks from '@react-native-firebase/dynamic-links';
import AddButton from '../../../components/AddButton';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const AddChallengeList = props => {
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
  // const showModal = () => setModalVisible(true);
  // const hideModal = () => setModalVisible(false);
  // const [visible, setVisible] = React.useState(false);
  // const openMenu = () => setVisible(true);
  // const closeMenu = () => setVisible(false);
  const refRBSheet = useRef();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [time, settime] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('time');

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [isSetTimerModalVisible, setIsSetTimerModalVisible] = useState(false);

  const [challenge_Detail, setChallenge_Detail] = useState(null);

  const [list, setList] = useState([
    // {
    //   id: 1,
    // },
    // {
    //   id: 2,
    // },
  ]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getChallenges();
    }, []),
  );

  const getChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_challenge_byAddedType_and_community_status, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        addedby_id: user_id,
        community_challenge_status: 'false',
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let responseData = response[0]?.all_record
            ? response[0]?.all_record
            : [];
          setList(responseData);
        } else {
          //error or data not found
          // Snackbar.show({
          //   text: response[0]?.message,
          //   duration: Snackbar.LENGTH_LONG,
          //   backgroundColor: 'red',
          // });
        }
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong.',
          duration: Snackbar.LENGTH_LONG,
        });
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const onChange = (event, selectedDate) => {
    console.log('event  : ', event);
    setShow(Platform.OS === 'ios');
    settime(selectedDate);
    console.log('date=========' + selectedDate);
  };

  const showDatePicker = () => {
    setIsDateModalVisible(true);
    refRBSheet?.current?.close();
  };

  const hideDatePicker = () => {
    setIsDateModalVisible(false);
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
      console.log('challenge Detail : ', challenge_Detail);
      console.log('date selected  : ', date);
      console.log('started challenge detail   : ', challenge_Detail?.uniq_id);
      setLoading(true);

      // challenge_Detail?.challenge_uniq_id,
      let challenge_Info = await getSpecificChallengeDetail(
        challenge_Detail?.uniq_id,
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

  const buildLink = async challenge_uniq_id => {
    let user_id = await AsyncStorage.getItem('user_id');
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
    // console.log('selected challenge id  : ', selectedChallengeId);
    // console.log('selected challenge detail : ', challenge_Detail);
    let dynamicLink = await buildLink(selectedChallengeId);
    console.log('dynamicLink  :   ', dynamicLink);
    // let a = 'date: ' + time;
    // let a = 'demo://app/EditProfile';
    // let a = 'https://app.example.com';
    // let a = 'http://disciplineguru.co';

    //dynamic link
    // let a = 'https://fortydayschallenge.page.link/TG78';
    let a = dynamicLink;
    // create new dynamic link

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
  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };
  const showTimepicker = () => {
    showMode('time');
    setIsDateModalVisible(true);
  };
  const [show, setShow] = useState(false);

  const options = item => {
    refRBSheet.current.open();
  };

  const renderItem = item => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(3),
          alignSelf: 'center',
          width: responsiveWidth(91),
          marginTop: responsiveHeight(3),
          paddingVertical: responsiveHeight(1.2),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: responsiveWidth(4),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.item?.challenge_detail?.image ? (
            <Image
              source={{
                uri: BASE_URL_IMAGE + '/' + item?.item?.challenge_detail?.image,
              }}
              style={{
                width: responsiveWidth(15),
                height: responsiveWidth(15),
                marginRight: responsiveWidth(3),
              }}
            />
          ) : (
            <Image
              source={appImages.runner}
              style={{
                width: responsiveWidth(15),
                height: responsiveWidth(15),
                marginRight: responsiveWidth(3),
              }}
            />
          )}

          <Text
            style={[
              styles.txtstyle,
              {
                width: responsiveWidth(51),
                color: isdarkmode ? seconddark : second,
              },
            ]}>
            {item?.item?.challenge_detail?.name}
          </Text>
          <TouchableOpacity
            style={{marginLeft: 30}}
            onPress={() => {
              setChallenge_Detail(item?.item?.challenge_detail);
              setSelectedChallengeId(item?.item?.challenge_uniq_id);
              refRBSheet.current.open();
            }}>
            <MaterialIcons name="more-vert" size={24} color={'#EC1D94'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //delete challenge

  const handleDeleteChallenge = async () => {
    setModalVisible(!modalVisible);
    refRBSheet.current.close();
    if (selectedChallengeId) {
      setLoading(true);
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      await fetch(api.delete_challenge, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          uniq_id: selectedChallengeId,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('delete challenge resopnse  :::: ', response);
          if (response[0]?.error == false) {
            const filter = list.filter(
              item => item?.challenge_uniq_id != selectedChallengeId,
            );
            setList(filter);
            Snackbar.show({
              text: 'Challenge Deleted Successfully',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'green',
            });
          } else {
            Snackbar.show({
              text: response[0]?.message
                ? response[0]?.message
                : 'Something went wrong.',
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
        text: 'Something went wrong.Please try again',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  const handleCommunityShare = async () => {
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      challenge_uniq_id: selectedChallengeId,
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

  const handlePullRefresh = () => {
    setRefreshing(true);
    getChallenges();
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'My Challenges'} />

        <View
          style={{
            alignSelf: 'center',
            position: 'relative',
            top: 0,
          }}>
          <BannerAd
            unitId={bannerAdID}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={[isdarkmode ? soliddark : solid]}
            />
          }>
          {loading && <Loader color={'red'} />}

          <FlatList
            data={list}
            renderItem={renderItem}
            contentContainerStyle={{padding: responsiveHeight(1.5)}}
            ListEmptyComponent={() => {
              return (
                <Text
                  style={{
                    color: '#FFF',
                    fontWeight: '500',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  No Record Found
                </Text>
              );
            }}
          />
          <View
            style={{
              paddingTop: 50,
              flexDirection: 'row',
              justifyContent: 'center',
            }}></View>

          {/* ------------------RBSheet---------------- */}

          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            // animationType="fade"
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,0.4)',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
              container: {
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                height: '40%',
              },
            }}>
            <View style={{padding: 20}}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet?.current?.close();
                }}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  source={appImages.closeemoji}
                  style={{
                    height: 15,
                    width: 15,
                    marginRight: 8,
                    marginBottom: 20,
                    tintColor: '#000',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={setcheck(true)}
                onPress={() => {
                  refRBSheet?.current?.close();
                  props?.navigation?.navigate('UpdateChallenge', {
                    challenge_Detail,
                  });
                }}
                style={{flexDirection: 'row', paddingLeft: 15}}>
                <MaterialIcons name="update" size={24} color={'black'} />
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Update Challenge
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  margin: 10,
                }}></View>

              <TouchableOpacity
                // onPress={() => myCustomeShare()}
                onPress={() => {
                  setModalVisible1(!modalVisible1);
                  refRBSheet.current?.close();
                }}
                style={{flexDirection: 'row', paddingLeft: 15}}>
                <MaterialIcons name="share" size={24} color={'black'} />
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Share Challenge
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  margin: 10,
                }}></View>

              <TouchableOpacity
                // onPress={showTimepicker}
                onPress={() => showDatePicker()}
                style={{flexDirection: 'row', paddingLeft: 15}}>
                <MaterialIcons name="notifications" size={24} color={'black'} />
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Manage Notifications
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  margin: 10,
                }}></View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  refRBSheet.current.close();
                }}
                style={{flexDirection: 'row', paddingLeft: 15}}>
                <MaterialIcons name="delete" size={24} color={'black'} />
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Delete Challenge
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
          {/* ====================model delete-------------------------- */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View
                style={{
                  ...styles.centeredView,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                }}>
                <View style={styles.modalView}>
                  <Image
                    source={appImages.alert}
                    style={{
                      width: responsiveWidth(13),
                      height: responsiveWidth(13),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      ...styles.textStyle,
                      marginVertical: responsiveWidth(6),
                    }}>
                    Do you want to delete this Challenge?
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      width: responsiveWidth(55),
                      justifyContent: 'space-between',
                    }}>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonClose1,
                        {paddingLeft: 10, top: 0, backgroundColor: '#ccc'},
                      ]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text
                        style={[
                          styles.textStyle,
                          {color: 'gray', marginRight: responsiveWidth(2)},
                        ]}>
                        NO
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {top: 0, backgroundColor: '#CA6FE4'},
                      ]}
                      onPress={() => handleDeleteChallenge()}>
                      <Text style={[styles.textStyle, {color: '#fff'}]}>
                        YES
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
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
                      <MaterialIcons name="close" size={24} color={'#EC1D94'} />
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

          {/* ---------------------time picker-------------------- */}
          {/* {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={time}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
            />
          )} */}
          <SuccessModal
            title={'Timer Set Successfully'}
            isVisible={isSetTimerModalVisible}
            setIsVisible={setIsSetTimerModalVisible}
            onOK={() => setIsSetTimerModalVisible(false)}
          />
          <DateTimePickerModal
            isVisible={isDateModalVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </ScrollView>
        {/* <TouchableOpacity
          style={styles.modalbutton}
          onPress={() => props.navigation.navigate('AddChallenge1')}>
          <Image
            source={appImages.addemoji}
            style={{
              width: responsiveWidth(22),
              height: responsiveWidth(22),
            }}
          />
        </TouchableOpacity> */}
        <AddButton onPress={() => props.navigation.navigate('AddChallenge1')} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddChallengeList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
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
  txtstyle: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.3),
  },
  // ----------------------------model styleing----------------------
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
    // backgroundColor: 'red',
  },
  modalView: {
    margin: 20,
    width: responsiveWidth(68),
    // height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: responsiveWidth(4),
    paddingHorizontal: responsiveWidth(3),
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    top: 50,
    width: 90,
    // backgroundColor: "black",
  },

  buttonClose1: {
    top: 50,
    width: 90,
    // backgroundColor: COLORS.orange,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#EC1D94',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  // ----------------secound model design-------------
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
  modalbutton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    marginLeft: '75%',
    // top: responsiveHeight(50),
    bottom: responsiveWidth(5),
    marginRight: responsiveWidth(7),
  },
});
