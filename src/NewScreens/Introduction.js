import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  ImageBackground,
  TextInput,
  Image,
  LogBox,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import AsyncStorage from '@react-native-async-storage/async-storage';
import bgimage from '../NewScreens/Images/a.png';
// import { fontFamily } from '../../constants/fonts';
import {fontFamily} from '../constants/fonts';
import React, {useEffect, useState} from 'react';
import FastImage from 'react-native-fast-image';
// import { appImages } from '../../assets/utilities';
import {appImages} from '../assets/utilities';
import bg from '../NewScreens/Images/bg.jpeg';
import intro from '../NewScreens/Images/Intro.png';
import logo from '../../src/assets/images/logo.png';

import Loader from '../components/Loader/Loader';
// import DeviceInfo from 'react-native-device-info';

// or ES6+ destructured imports

import {
  DeviceInfo,
  getApplicationName,
  getBrand,
  getUniqueId,
  getManufacturer,
  getDeviceId,
  getDeviceToken,
} from 'react-native-device-info';

import Snackbar from 'react-native-snackbar';

import {api} from '../constants/api';

import messaging from '@react-native-firebase/messaging';

LogBox.ignoreAllLogs();
const Introduction = ({navigation}) => {
  const [selectedGenderImage, setSelectedGenderImage] = useState('');
  const [gender, setGender] = useState('');
  const [name, setname] = useState('');
  const [Ldata, setLData] = useState([]);

  const deviceid = getDeviceId();

  // global.user_id = deviceid

  const [isLoading, setLoading] = useState(false);

  const Login = async () => {
    try {
      const response = await fetch(global.url + 'api/user/getUser');
      const json = await response.json();
      setLData(json.result); //json.id to sub ides ayan ge
      for (let i = 0; i < Ldata.length; i++) {
        if (Ldata[i].deviceToken == deviceid) {
          global._id = Ldata[i]._id;
          global.userName = Ldata[i].userName;
          global.gender = Ldata[i].gender;
          console.log(
            global._id + '-----' + global.userName + '-------' + global.gender,
          );
          navigation.navigate('GoodMorning');
        }
      }
      // console.log(json.result[0].deviceToken)
      // console.log(data[0])
      // console.log(response)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const CreateUser = async () => {
    // navigation.navigate("GoodMorning")
    // console.log(name+"-------"+deviceid+"-------"+gender)
    var InsertAPIURL = global.url + 'api/user/createUser';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        userName: name,
        deviceToken: deviceid,
        gender: gender,
      }),
    })
      .then(response => response.json())
      .then(response => {
        if (response.statusCode == 201) {
          alert('User is Created,Now login');
        } else {
          // alert(response.message)
          Login();

          // alert("Login")
          // navigation.navigate("GoodMorning")
        }
        console.log(response);
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };

  const getUserFCMToken = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          const fcmToken = await messaging().getToken();
          resolve(fcmToken);
        } else {
          resolve('');
        }
      } catch (error) {
        resolve('');
      }
    });
  };

  const handleCreateUser = async () => {
    navigation.replace('App', {screen: 'MyTab'});
    // let device_id = getDeviceId();
    console.log('gender  :  ', gender);
    let device_id = await getUserFCMToken();
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

      await fetch(api.create_user, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: name,
          gender: gender?.toLowerCase(),
          device_token: device_id,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false || response[0]?.error == false) {
            await AsyncStorage.setItem('user', JSON.stringify(response[0]));
            await AsyncStorage.setItem('isFirstViewInApp', 'true');
            // await AsyncStorage.setItem('user_id', '34');
            await AsyncStorage.setItem('user_id', response[0]?.user_id);
            let user_image = await AsyncStorage.getItem('user_image');
            if (user_image == null) {
              await AsyncStorage.setItem(
                'user_image',
                JSON.stringify(selectedGenderImage),
              );
            }
            await AsyncStorage.setItem('user_name', name);
            global.userName = response[0].name;
            global.gender;
            global.SelectedAvatar = response[0]?.gender;
            gender?.toLowerCase() == 'male'
              ? appImages?.male
              : gender?.toLowerCase() == 'female'
              ? appImages?.female
              : appImages?.thirdgender;
            // navigation.replace('GoodMorning');
            navigation.replace('App', {screen: 'MyTab'});
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
    <ImageBackground source={bg} style={styles.container}>
      {/* <Image source={bgimage} style={styles.image} /> */}
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View
          style={{
            top: 30,

            height: responsiveHeight(100),
          }}>
          {isLoading && <Loader />}
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 20,
              left: 100,
              top: 180,
            }}>
            Introduce Yourself
          </Text>
          {/* <FastImage
          // source={intro}
          source={logo}
          resizeMode="contain"
          style={styles.imgstyle}
        /> */}
          <FastImage
            // source={intro}
            source={logo}
            resizeMode="stretch"
            style={{
              width: responsiveWidth(60),
              height: responsiveWidth(38),
              alignSelf: 'center',
              marginBottom: 15,
            }}
          />
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
                  // backgroundColor: gender === 'Male' ? 'lightgray' : '#fff',
                  borderColor: '#E4175A',
                  borderWidth: gender === 'Male' ? 3 : 0,
                  elevation: gender === 'Male' ? 3 : 0,
                },
              ]}
              onPress={() => {
                setGender('Male');
                setSelectedGenderImage(appImages.male);
              }}>
              <Image
                source={appImages.male}
                resizeMode={'contain'}
                style={[
                  styles.genderimg,
                  {
                    tintColor: gender === 'Male' ? '#E4175A' : '#F48FB1',
                    marginRight: responsiveWidth(0.4),
                  },
                ]}
              />
              {/* <FastImage
                source={appImages.male}
                resizeMode={'contain'}
                style={[
                  styles.genderimg,
                  {
                    tintColor: 'red',
                    marginRight: responsiveWidth(0.4),
                  },
                ]}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.genderview,
                {
                  // backgroundColor: gender === 'Female' ? 'lightgray' : '#fff',
                  borderColor: '#E4175A',
                  borderWidth: gender === 'Female' ? 3 : 0,
                  elevation: gender === 'Female' ? 3 : 0,
                },
              ]}
              onPress={() => {
                setGender('Female');
                setSelectedGenderImage(appImages.female);
              }}>
              <Image
                source={appImages.female}
                resizeMode={'contain'}
                style={[
                  styles.genderimg,
                  {
                    tintColor: gender === 'Female' ? '#E4175A' : '#81D5FA',
                    marginLeft: responsiveWidth(0.4),
                  },
                ]}
              />
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
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.genderview,
                {
                  // backgroundColor:
                  //   gender === 'Thirdgender' ? 'lightgray' : '#fff',
                  borderColor: '#E4175A',
                  borderWidth: gender === 'other' ? 3 : 0,
                  elevation: gender === 'other' ? 3 : 0,
                },
              ]}
              onPress={() => {
                setGender('other');
                setSelectedGenderImage(appImages.thirdgender);
              }}>
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
          <TouchableOpacity
            style={styles.nextview}
            activeOpacity={0.7}
            // onPress={() => navigation.navigate("GoodMorning")}
            //   onPress={() => CreateUser()}
            // onPress={() => decide()}

            onPress={() => handleCreateUser()}>
            <Text style={[styles.nexttxt]}>
              {gender?.length > 0 ? 'Continue' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Introduction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 100,
    left: 110,
    top: 60,
  },
  imgstyle: {
    width: responsiveWidth(33),
    height: responsiveWidth(33),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: responsiveWidth(100),
  },
  txtinputstyle: {
    borderBottomWidth: responsiveWidth(0.1),
    borderColor: '#FFFFFF',
    paddingVertical: responsiveHeight(0.2),
    width: responsiveWidth(78),

    marginTop: responsiveHeight(0.5),
    alignSelf: 'center',
    // backgroundColor: 'red',

    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
  },
  txt2: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(9),
    left: 40,
    bottom: 10,
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
    color: '#cc3366',
    fontSize: responsiveFontSize(2.3),
  },
  nextview: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: responsiveHeight(7),
    paddingHorizontal: responsiveWidth(8),
    paddingVertical: responsiveHeight(1.3),
    borderRadius: responsiveWidth(2),
    marginLeft: 160,
    // borderColor: 'pink',
    // borderWidth: 2
  },
});
