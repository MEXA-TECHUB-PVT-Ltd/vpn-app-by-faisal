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
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Modal from 'react-native-modal';
import SuccessModal from '../../../components/SuccessModal';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import {bannerAdID} from '../../../utils/adsKey';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';

const EditProfile = props => {
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
  const [gender, setGender] = useState('');
  const [name, setname] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const isFocused = useIsFocused();

  useEffect(() => {
    getUser();
  }, [isFocused]);

  const getUser = async () => {
    let user = await AsyncStorage.getItem('user');
    if (user != null) {
      let parse = JSON.parse(user);
      setname(parse?.name);
      setGender(parse?.gender);
    }
    let user_image = await AsyncStorage.getItem('user_image');
    if (user_image) {
      let parse = JSON.parse(user_image);
      setImage(parse);
    }
  };
  const handleUpdateProfile = async () => {
    if (name?.length == 0) {
      Snackbar.show({
        text: 'Please Enter Name',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else if (gender?.length == 0) {
      Snackbar.show({
        text: 'Please Select Gender',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let user_id = await AsyncStorage.getItem('user_id');

      await fetch(api.update_user, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: name,
          gender: gender,
          user_id: user_id,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response  :   ', response);
          if (response[0]?.error == false || response[0]?.error == false) {
            await AsyncStorage.setItem('user', JSON.stringify(response[0]));
            await AsyncStorage.setItem('user_name', name);
            setModalVisible(true);
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
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Edit Profile'} />
        {loading && <Loader color={isdarkmode ? '#fff' : '#000'} />}
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          <View style={{flex: 1}}>
            <View
              style={{
                width: responsiveWidth(33),
                height: responsiveWidth(33),
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: responsiveWidth(100),
                marginTop: responsiveHeight(7),
              }}>
              {image != '' ? (
                <Image
                  source={image}
                  resizeMode="contain"
                  style={styles.imgstyle}
                />
              ) : (
                <View style={styles.imgstyle}></View>
              )}

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: responsiveWidth(0.1),
                  right: responsiveWidth(0.1),
                }}
                onPress={() => props.navigation.navigate('EditAvatar')}>
                <Image
                  source={appImages.whiteeditpencil}
                  resizeMode="contain"
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.txt2}>Enter name</Text>
            <TextInput
              style={styles.txtinputstyle}
              value={name}
              onChangeText={name => setname(name)}
            />
            <Text style={styles.txt2}>Gender</Text>
            <View style={styles.gendercontainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    // backgroundColor: gender === 'male' ? 'lightgray' : '#fff',
                    borderColor: '#E4175A',
                    borderWidth: gender === 'male' ? 3 : 0,
                    elevation: gender === 'male' ? 3 : 0,
                  },
                ]}
                onPress={() => setGender('male')}>
                {/* <FastImage
                  source={appImages.male}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      marginRight: responsiveWidth(0.4),
                    },
                  ]}
                /> */}
                <Image
                  source={appImages.male}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      tintColor: gender === 'male' ? '#E4175A' : '#F48FB1',
                      marginRight: responsiveWidth(0.4),
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    // backgroundColor: gender === 'female' ? 'lightgray' : '#fff',
                    borderColor: '#E4175A',
                    borderWidth: gender === 'female' ? 3 : 0,
                    elevation: gender === 'female' ? 3 : 0,
                  },
                ]}
                onPress={() => setGender('female')}>
                {/* <FastImage
                  source={appImages.female}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      marginLeft: responsiveWidth(0.4),
                    },
                  ]}
                /> */}
                <Image
                  source={appImages.female}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      tintColor: gender === 'female' ? '#E4175A' : '#81D5FA',
                      marginLeft: responsiveWidth(0.4),
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    // backgroundColor:
                    //   gender === 'thirdgender' ? 'lightgray' : '#fff',
                    borderColor: '#E4175A',
                    borderWidth: gender === 'other' ? 3 : 0,
                    elevation: gender === 'other' ? 3 : 0,
                  },
                ]}
                onPress={() => setGender('other')}>
                {gender === 'other' ? (
                  <Image
                    source={appImages.thirdgender}
                    resizeMode={'contain'}
                    style={{...styles.genderimg, tintColor: '#E4175A'}}
                  />
                ) : (
                  <FastImage
                    source={appImages.thirdgender}
                    resizeMode={'contain'}
                    style={styles.genderimg}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.8,
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                style={styles.btn}
                activeOpacity={0.7}
                onPress={() => handleUpdateProfile()}>
                <Text style={[styles.btnText]}>Save Changes</Text>
              </TouchableOpacity>
            </View>
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
          </View>

          <SuccessModal
            isVisible={modalVisible}
            setIsVisible={setModalVisible}
            title="Profile Updated Successfully"
            onOK={() => {
              setModalVisible(false), props?.navigation?.goBack();
            }}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    width: responsiveWidth(88),
    alignSelf: 'center',
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
  imgstyle: {
    width: responsiveWidth(33),
    height: responsiveWidth(33),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: responsiveWidth(100),
  },

  toprightstyle: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    right: responsiveWidth(-40),
    top: responsiveHeight(-12),
  },
  bottomleftstyle: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    left: responsiveWidth(-48),
    bottom: responsiveHeight(-32),
  },
  topleftstyle: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    left: responsiveWidth(-58),
    top: responsiveHeight(-12),
  },
  bottomrightstyle: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    right: responsiveWidth(-42),
    bottom: responsiveHeight(-32),
  },
  txt1: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.7),
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
  },
  txt2: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(2),
  },
  secondview: {
    width: responsiveWidth(80),
  },
  txtinputstyle: {
    borderBottomWidth: responsiveWidth(0.1),
    borderColor: '#fff',
    paddingVertical: responsiveHeight(0.2),
    width: responsiveWidth(78),

    marginTop: responsiveHeight(0.5),
    alignSelf: 'center',
    // backgroundColor: 'red',

    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
  },
  gendercontainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: responsiveWidth(65),
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  genderimg: {
    width: responsiveWidth(12),
    height: responsiveHeight(9),
    // backgroundColor: 'red',
    // borderRadius: responsiveWidth(100),
  },
  genderview: {
    width: responsiveWidth(17),
    height: responsiveWidth(17),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(100),

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },
  nexttxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
  },
  nextview: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: responsiveHeight(11),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: responsiveWidth(100),
  },
  btn: {
    backgroundColor: '#CA6FE4',
    alignSelf: 'center',
    marginTop: responsiveHeight(11),
    width: responsiveWidth(87),
    padding: 13,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 2,
  },
  btnText: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
  },
});
