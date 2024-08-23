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
import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import {useSelector, useDispatch} from 'react-redux';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from '../../../constants/api';

import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const GoodMorning = ({navigation}, props) => {
  const isFocused = useIsFocused();
  useEffect(() => {}, [isFocused]);
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

  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState('');
  const [greetingText, setGreetingText] = useState('');

  const [quote, setQuote] = useState('');

  const getUser = async () => {
    let user = await AsyncStorage.getItem('user');
    if (user != null) {
      let parse = JSON.parse(user);
      setUserName(parse?.name);
      setUserGender(parse?.gender);
    }
    let user_image = await AsyncStorage.getItem('user_image');
    if (user_image) {
      let parse = JSON.parse(user_image);
      setUserImage(parse);
    }
  };

  useFocusEffect(
    React.useCallback(
      React.useCallback(() => {
        getUser();
        greeting();
        getAllMotivationalQuotes();
      }, []),
    ),
  );

  const getAllMotivationalQuotes = useCallback(async () => {
    try {
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      fetch(api.get_all_motivational_quotes, requestOptions)
        .then(response => response.json())
        .then(async result => {
          if (result[0]?.error == false) {
            let list = result[0]?.data ? result[0]?.data : [];
            // setData(list);
            if (list?.length > 0) {
              setQuote(list[0].quote);
            }
          } else {
            //something went wrong
          }
        })
        .catch(error => {
          console.log('error raised : ', error);
        });
    } catch (error) {
      console.log('error raised : ', error);
    }
  }, []);

  const greeting = () => {
    let d = new Date();
    let currentHour = d.getHours();
    // if (currentHour < 12) {
    //   setGreetingText('Good Morning');
    // } else if (currentHour <= 18 && currentHour >= 12) {
    //   setGreetingText('Good Evening');
    // } else {
    //   setGreetingText('Good Night');
    // }
    if (currentHour < 12) {
      setGreetingText('Good Morning');
    } else if (currentHour < 18) {
      setGreetingText('Good Afternoon');
    } else if (currentHour < 22) {
      setGreetingText('Good Evening');
    } else {
      setGreetingText('Good Night');
    }
  };

  const [list, setList] = useState([
    {
      id: 1,
      name: 'Challenges',
      src: appImages.goal,
    },
    {
      id: 2,
      name: 'Books',
      src: appImages.book_stack,
    },
 
    {
      id: 3,
      name: 'Motivational Qoutes',
      src: appImages.speech_bubble, 
    },
    {
      id: 4,
      name: 'Inspirational Speeches',
      src: appImages.musical_note,
    },
    {
      id: 5,
      name: 'Articles',
      src: appImages.article,
    },
    {
      id: 6,
      name: 'To-Do List',
      src: appImages.task_list,
    },
    {
      id: 7,
      name: 'Journal',
      src: appImages.book,
    },
    {
      id: 8,
      name: 'Community challenges',
      src: appImages.community_challenge,
    },
   
  ]);
  const navigate = (item, index) => {
    if (index == 0) {
      // navigation.navigate('Motivational_Qoutes');
      navigation.navigate('FirstGoodMorning');
    }
    if (index == 1) {
      navigation.navigate('Books');
      // navigation.navigate('stackRelaxingMusic');
    }
    if (index == 2) {
      navigation.navigate('Motivational_Qoutes');
      // navigation.navigate('Books');
    }
    if (index == 3) {
      navigation.navigate('Inspirationalspeeches');
    }
    if (index == 4) {
      // navigation.navigate('DailyJournal');
      navigation.navigate('Article');
    }
    if (index == 5) {
      navigation.navigate('To_do_list');
    }
    if (index == 6) {
      navigation.navigate('DailyJournal');
    }
    if (index == 7) {
      navigation.navigate('CommunityChallenges');
    }
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.singleview,
          {backgroundColor: isdarkmode ? soliddark : solid},
        ]}
        onPress={() => {
          navigate(item, index);
        }}>
        <FastImage
          source={item.src}
          style={styles.runnerimg}
          resizeMode="contain"
        />
        <Text style={styles.challengetxt}>{item.name}</Text>
        {/* <Text style={styles.challengetxt}>Name</Text> */}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        {/* <StatusBar
          hidden={false}
          backgroundColor={'transparent'}
          // backgroundColor={isdarkmode ? doubledark : double}
          translucent={true}
        /> */}
        {/* <View style={{...styles.header, marginTop: 45}}> */}
        <View style={styles.header}>
          <TouchableRipple
            onPress={() => navigation?.toggleDrawer()}
            rippleColor="rgba(0, 0, 0, .1)"
            style={styles.drawerview}>
            <Image
              source={appImages.drawericon}
              resizeMode="contain"
              style={[
                styles.drawericonstyle,
                // {tintColor: isdarkmode ? '#fff' : '#000'},
                {tintColor: '#fff'},
              ]}
            />
          </TouchableRipple>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}></View>
        </View>
        <ScrollView>
          <View>
            <Text></Text>
            {/* {userGender == 'male' ? (
              <Image
                source={appImages.male}
                resizeMode="contain"
                style={styles.avatarstyle}
              />
            ) : userGender == 'female' ? (
              <Image
                source={appImages.female}
                resizeMode="contain"
                style={styles.avatarstyle}
              />
            ) : (
              <Image
                source={appImages.thirdgender}
                resizeMode="contain"
                style={styles.avatarstyle}
              />
            )} */}

            {userImage !== '' ? (
              <Image
                source={userImage}
                resizeMode="contain"
                style={styles.avatarstyle}
              />
            ) : (
              <View style={styles.avatarstyle}></View>
            )}

            <Text style={styles.txt1}>{greetingText}</Text>
            <Text style={styles.txt2}>{userName}</Text>
            <Text
              numberOfLines={2}
              style={[
                styles.loremtxt,
                {
                  color: isdarkmode ? '#fff' : '#fff',
                  textTransform: 'capitalize',
                  fontSize: 14,
                },
              ]}>
              {quote}
            </Text>
          </View>
          <View style={styles.secondview}>
            {/* <Text
              style={[styles.alltxt, {color: isdarkmode ? soliddark : solid}]}>
              All Challenges
            </Text> */}
            <View style={{height: responsiveHeight(1.4)}}></View>
            <FlatList
              contentContainerStyle={styles.listcontainer}
              renderItem={renderItem}
              data={list}
              keyExtractor={item => item.id}
              scrollEnabled={false} 
              numColumns={2}
            />
            <View style={{alignSelf: 'center'}}>
              <BannerAd
                unitId={TestIds.BANNER}
                size={BannerAdSize.BANNER}
                requestOptions={{
                  requestNonPersonalizedAdsOnly: true,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default GoodMorning;

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
    width: responsiveWidth(6.5),
    height: responsiveWidth(6.5),
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
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
  },
  avatarstyle: {
    width: responsiveWidth(17),
    height: responsiveWidth(17),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(100),
    alignSelf: 'center',
    marginTop: responsiveHeight(-2.5),
  },
  txt1: {
    fontFamily: fontFamily.Segoe_Bold,
    fontSize: responsiveFontSize(2.7),
    color: '#fff',
    alignSelf: 'center',
    marginTop: responsiveHeight(1.5),
  },
  txt2: {
    fontFamily: fontFamily.Segoe_Regular,
    fontSize: responsiveFontSize(2.5),
    color: '#fff',
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
  },
  loremtxt: {
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(2.1),
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
    // backgroundColor: 'red',
    width: responsiveWidth(90),
    marginBottom: responsiveHeight(2),
  },
  secondview: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopRightRadius: responsiveWidth(15),
    borderTopLeftRadius: responsiveWidth(15),
  },
  alltxt: {
    fontFamily: fontFamily.Sans_Regular,

    fontSize: responsiveFontSize(2.7),
    marginTop: responsiveHeight(2.5),
    marginLeft: responsiveWidth(8),
  },
  singleview: {
    width: responsiveWidth(39),
    // height: responsiveWidth(36),
    // width: responsiveWidth(38.4),
    height: responsiveWidth(34),

    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    borderRadius: responsiveWidth(4),
    // paddingVertical: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    elevation: 2,
    marginLeft: responsiveWidth(7),
    marginBottom: responsiveHeight(2),
  },
  challengetxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#FFF',
    fontSize: 15,
    // fontSize: responsiveFontSize(2.2),
    alignSelf: 'center',
  },
  runnerimg: {
    width: responsiveWidth(11),
    height: responsiveWidth(11),
    // backgroundColor: 'red',
    marginBottom: responsiveWidth(3),
    alignSelf: 'center',
  },
  listcontainer: {
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
    width: responsiveWidth(99.5),
    // backgroundColor: 'red',
  },
});
