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
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {fontFamily} from '../../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../../../constants/api';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const Profile = props => {
  const isFocused = useIsFocused();
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('');

  const [noOfCommunityLikes, setNoOfCommunityLikes] = useState(0);

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
  useEffect(() => {
    getUser();
    getLikesOfCommunity();
  }, [isFocused]);
  const getUser = async () => {
    let user = await AsyncStorage.getItem('user');
    if (user != null) {
      let parse = JSON.parse(user);
      setUserName(parse?.name);
      setGender(parse?.gender);
    }
    let user_image = await AsyncStorage.getItem('user_image');
    if (user_image) {
      let parse = JSON.parse(user_image);
      setUserImage(parse);
    }
  };

  const getLikesOfCommunity = async () => {
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
        community_challenge_status: 'true',
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let responseData = response[0]?.all_record
            ? response[0]?.all_record
            : [];

          let sum = responseData.reduce(
            (n, {likes_count}) => n + likes_count,
            0,
          );
          setNoOfCommunityLikes(sum);
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
        console.log('error raised  :  ', error);
      });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <ScrollView>
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
              <Text
                style={[
                  styles.cointxt,
                  {color: isdarkmode ? soliddark : solid},
                ]}>
                {''}
              </Text>
            </View>
          </View>
          {userImage != '' ? (
            <Image
              source={userImage}
              resizeMode="contain"
              style={styles.avatarstyle}
            />
          ) : (
            <View style={styles.avatarstyle}></View>
          )}

          <Text style={styles.hellotxt}>{userName}</Text>
          <Text style={{...styles.hellotxt, marginTop: responsiveHeight(0.4)}}>
            {gender}
          </Text>
          <View style={{marginVertical: responsiveHeight(4)}}>
            {/* <View style={styles.secondcontainer}> */}
            <TouchableRipple
              onPress={() => props.navigation.navigate('EditProfile')}
              style={[
                styles.touchables,
                {backgroundColor: isdarkmode ? soliddark : '#FFF'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: responsiveWidth(4),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...styles.txt1,
                    color: isdarkmode ? '#fff' : '#707070',
                  }}>
                  Edit Profile
                </Text>
                <FastImage
                  source={appImages.iconforward}
                  resizeMode="contain"
                  tintColor={'#707070'}
                  style={styles.imgstyle}
                />
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => console.log('PRESSED')}
              style={[
                styles.touchables,
                {backgroundColor: isdarkmode ? soliddark : '#FFF'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: responsiveWidth(4),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...styles.txt1,
                    color: isdarkmode ? '#fff' : '#707070',
                  }}>
                  Likes of Community
                </Text>
                <Text
                  style={{
                    ...styles.txt1,
                    color: isdarkmode ? '#fff' : '#707070',
                  }}>
                  {noOfCommunityLikes}
                </Text>
              </View>
            </TouchableRipple>
            <TouchableRipple
              onPress={() => props.navigation.navigate('My_Challenges')}
              style={[
                styles.touchables,
                {backgroundColor: isdarkmode ? soliddark : '#FFF'},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingHorizontal: responsiveWidth(4),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    ...styles.txt1,
                    color: isdarkmode ? '#fff' : '#707070',
                  }}>
                  My Challenges
                </Text>
                <FastImage
                  source={appImages.iconforward}
                  resizeMode="contain"
                  tintColor={'#707070'}
                  style={styles.imgstyle}
                />
              </View>
            </TouchableRipple>
            {/* </View> */}
          </View>
        </ScrollView>
        <View
          style={{
            alignSelf: 'center',
            position: 'absolute',
            bottom: 0,
          }}>
          <BannerAd
            unitId={TestIds.BANNER}
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

export default Profile;

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
  avatarstyle: {
    width: responsiveWidth(28),
    height: responsiveWidth(28),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(100),
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
  },
  hellotxt: {
    color: '#fff',
    fontFamily: fontFamily.Segoe_Regular,
    fontSize: responsiveFontSize(2.7),
    alignSelf: 'center',
    marginTop: responsiveHeight(2),
    textTransform: 'capitalize',
  },
  secondcontainer: {
    width: responsiveWidth(85),
    alignSelf: 'center',
    marginTop: responsiveHeight(5),
    paddingVertical: responsiveHeight(3),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(7),
    marginBottom: responsiveHeight(2),
  },
  touchables: {
    paddingVertical: responsiveHeight(2),
    width: responsiveWidth(85),
    borderRadius: responsiveWidth(3),
    alignSelf: 'center',
    marginTop: responsiveHeight(2),
    marginVertical: responsiveHeight(1.5),
  },
  imgstyle: {
    width: responsiveWidth(3.5),
    height: responsiveWidth(3.5),
    tintColor: '#707070',
  },
  txt1: {
    color: '#fff',
    // fontFamily: fontFamily.Poppins_SemiBold,
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginLeft: responsiveWidth(2),
  },
});
