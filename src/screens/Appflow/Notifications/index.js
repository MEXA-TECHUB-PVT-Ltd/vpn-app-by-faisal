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
import React, {useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import {Avatar} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../components/Loader/Loader';
import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const Notifications = props => {
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllNotifications();
    }, []),
  );

  const getAllNotifications = async () => {
    try {
      let notifications = await AsyncStorage.getItem('Notifications');
      if (notifications) {
        let list = JSON.parse(notifications);
        // setData(JSON.parse(notifications));
        let noti_List = [];
        for (const element of list) {
          if (
            new Date(element?.notification_detail?.date)?.getTime() <=
            new Date()?.getTime()
          ) {
            noti_List.push(element);
          }
        }
        noti_List?.sort((a, b) => {
          return (
            new Date(new Date(b?.notification_detail?.date)?.getTime()) -
            new Date(new Date(a?.notification_detail?.date)?.getTime())
          );
        });
        setData(noti_List);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log('Error raised :', error);
      setLoading(false);
    }
  };

  const onNotificationPress = async selected_challenge => {
    // console.log('selected_challenge  :', selected_challenge?.uniq_id);
    // return;
    // console.log(selected_challenge?.uniq_id);
    // return;
    // props.navigation.navigate('ChallengeName', {
    //   uniq_id: item?.challenge_uniq_id,
    // });

    setLoading(true);

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      // challenge_uniq_id: selected_challenge?.challenge_uniq_id,
      challenge_uniq_id: selected_challenge?.uniq_id,
      started_user_id: user_id,
    };
    await fetch(api.get_started_challenge_detail, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          props?.navigation.navigate('ChallengeList', {
            challenge_uniq_id:
              response[0]?.started_challenge_detail?.challenge_uniq_id,
            challengeName: selected_challenge?.name,
            challengeDescription: selected_challenge?.description,
            img: BASE_URL_IMAGE + '/' + selected_challenge?.image,
            // daysDesc: daysDesc,
            daysDesc: response[0]?.started_challenge_days,
            hiddenStatus: response[0]?.started_challenge_detail?.hide_status,
            // _id: _id,
            adderId: selected_challenge?.addedby,
            id: response[0]?.started_challenge_detail?.id,
          });
        } else {
          console.log('started challenge message : ', response[0]?.message);
          props.navigation.navigate('ChallengeName', {
            uniq_id: selected_challenge?.uniq_id,
          });
        }
      })
      .catch(error => {
        console.log('error  : ', error);
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Notification'} />
        {loading && <Loader />}

        <View
          style={{
            alignSelf: 'center',
            position: 'relative',
            top: 0,
          }}>
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          {data?.length == 0 ? (
            <Text style={styles.emptytxt}>No notifications yet</Text>
          ) : (
            <View
              style={{
                flex: 1,
                // alignItems: 'flex-start',
                width: responsiveWidth(100),
                padding: responsiveWidth(5),
              }}>
              <FlatList
                data={data}
                contentContainerStyle={{paddingBottom: 70}}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => {
                  return <View style={styles.line}></View>;
                }}
                renderItem={(item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        // props.navigation.navigate('ChallengeName', {
                        //   uniq_id: item.item?.challenge_detail?.uniq_id,
                        // });

                        onNotificationPress(item.item?.challenge_detail);
                      }}
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View style={styles.avaterView}>
                        <Image
                          source={{
                            uri:
                              BASE_URL_IMAGE +
                              '/' +
                              item?.item?.challenge_detail?.image,
                          }}
                          style={styles.avaterImage}
                        />
                      </View>
                      {/* <Avatar.Image
                        size={responsiveWidth(15)}
                        style={{
                          resizeMode: 'contain',
                          backgroundColor: '#fff',
                        }}
                        source={{
                          uri:
                            BASE_URL_IMAGE +
                            '/' +
                            item?.item?.challenge_detail?.image,
                        }}
                      /> */}
                      <View
                        style={{marginHorizontal: responsiveWidth(5), flex: 1}}>
                        <Text style={styles.title}>
                          {item?.item?.notification_detail?.title}
                        </Text>
                        <Text style={styles.description}>
                          {item?.item?.notification_detail?.description}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: '400',
                          fontSize: 14,
                        }}>
                        {item?.item?.notification_detail?.date &&
                          moment(
                            item?.item?.notification_detail?.date,
                          ).fromNow()}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  avaterView: {
    height: responsiveWidth(15),
    width: responsiveWidth(15),
    borderRadius: responsiveWidth(15) / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avaterImage: {
    height: responsiveWidth(15),
    width: responsiveWidth(15),
    // borderRadius: responsiveWidth(15) / 2,
    resizeMode: 'contain',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 14,
  },
  line: {
    width: responsiveWidth(90),
    height: responsiveHeight(0.05),
    backgroundColor: '#FFF',
    alignSelf: 'center',
    marginVertical: responsiveHeight(2),
  },
});
