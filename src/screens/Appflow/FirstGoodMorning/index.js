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
  SectionList,
  RefreshControl,
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
import {useSelector, useDispatch} from 'react-redux';
import MainHeader from '../../../components/MainHeader';
import Loader from '../../../components/Loader/Loader';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import {useFocusEffect} from '@react-navigation/native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import AddButton from '../../../components/AddButton';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {bannerAdID} from '../../../utils/adsKey';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';

// const GoodMorning = props => {
const FirstGoodMorning = props => {
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
  const [refreshing, setRefreshing] = useState(false);

  const [myChallenges, setMyChallenges] = useState([]);
  const [guruChallenges, setGuruChallenges] = useState([]);

  const getBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        global.url + 'api/challenge/getAllChallenges',
      );
      const json = await response.json();
      setData(json.result); //json.id to sub ides ayan ge
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // getBooks();
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getDisciplineGuruChallenges();
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
        user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let responseData = response[0]?.all_record
            ? response[0]?.all_record
            : [];

          const filter = responseData?.filter(item => item?.hidestatus != true);
          setMyChallenges(filter);
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
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const getDisciplineGuruChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_challenges_by_type, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        addedby_id: 'admin',
        user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let responseData = response[0]?.all_record
            ? response[0]?.all_record
            : [];
          const filter = responseData?.filter(item => item?.hidestatus != true);
          setGuruChallenges(filter);
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
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setRefreshing(false);
        setLoading(false);
      });
  };

  const handlePullRefresh = () => {
    setRefreshing(true);
    getDisciplineGuruChallenges();
    getChallenges();
  };

  const handleChallengePress = async selected_challenge => {
    setLoading(true);

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      challenge_uniq_id: selected_challenge?.challenge_uniq_id,
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
            challengeName: selected_challenge?.challenge_detail?.name,
            challengeDescription:
              selected_challenge?.challenge_detail?.description,
            img:
              BASE_URL_IMAGE +
              '/' +
              selected_challenge?.challenge_detail?.image,
            // daysDesc: daysDesc,
            daysDesc: response[0]?.started_challenge_days,
            hiddenStatus: response[0]?.started_challenge_detail?.hide_status,
            // _id: _id,
            adderId: selected_challenge?.challenge_detail.addedby,
            id: response[0]?.started_challenge_detail?.id,
          });
        } else {
          props.navigation.navigate('ChallengeName', {
            uniq_id: selected_challenge?.challenge_uniq_id,
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

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.singleview,
          {backgroundColor: isdarkmode ? soliddark : 'white'},
        ]}
        onPress={() => {
          // props.navigation.navigate('ChallengeName', {
          //   uniq_id: item?.challenge_uniq_id,
          // });
          handleChallengePress(item);
        }}>
        {item?.completionchallengeestatus && (
          <TouchableOpacity style={{position: 'absolute', right: 10, top: 5}}>
            {/* <Entypo
              name="check"
              size={20}
              color={isdarkmode ? soliddark : 'gray'}
            /> */}
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={isdarkmode ? 'white' : 'green'}
            />
          </TouchableOpacity>
        )}

        <View
          style={{
            ...styles.runnerimg,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item?.challenge_detail?.image ? (
            <FastImage
              // source={appImages.runner}
              source={{
                uri: BASE_URL_IMAGE + '/' + item?.challenge_detail?.image,
              }}
              style={{
                ...styles.runnerimg,
                width: responsiveWidth(16),
                height: responsiveWidth(16),
              }}
              resizeMode="contain"
            />
          ) : (
            <FastImage
              // source={appImages.runner}
              style={styles.runnerimg}
              resizeMode="contain"
            />
          )}
        </View>

        <Text
          style={{...styles.challengetxt, color: isdarkmode ? '#fff' : '#000'}}>
          {item?.challenge_detail?.name}{' '}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Challenges'} />

        {/* {loading && <Loader />} */}
        {/* <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}> */}
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={[isdarkmode ? soliddark : solid]}
            />
          }
          contentContainerStyle={{
            ...styles.listcontainer,
          }}
          style={{height: responsiveHeight(100)}}
          renderItem={renderItem}
          data={myChallenges}
          initialNumToRender={15}
          keyExtractor={(item, index) => index?.toString()}
          numColumns={2}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <>
                {/* <LinearGradient
                colors={isdarkmode ? doubledark : double}
                style={{
                  paddingBottom: 10,
                  marginBottom: responsiveHeight(2),
                }}> */}
                <Text
                  style={{
                    fontFamily: fontFamily.Sans_Regular,
                    color: '#FFF',
                    fontSize: responsiveFontSize(2.2),
                    // alignSelf: 'center',
                    // textAlign: 'center',
                    paddingBottom: 15,
                    paddingLeft: 15,
                  }}>
                  My Challenges :
                </Text>
                {/* </LinearGradient> */}
              </>
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  height: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: isdarkmode ? '#fff' : '#000',
                    fontSize: 16,
                    fontFamily: fontFamily.Sans_Regular,
                  }}>
                  No Record Found
                </Text>
              </View>
            );
          }}
          ListFooterComponent={() => {
            return (
              <View style={{flex: 1}}>
                {/* <LinearGradient
                  colors={isdarkmode ? doubledark : double}
                  style={{padding: 10, marginBottom: responsiveHeight(2)}}> */}

                <View
                  style={{
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}>
                  <BannerAd
                    unitId={bannerAdID}
                    size={BannerAdSize.BANNER}
                    requestOptions={{
                      requestNonPersonalizedAdsOnly: true,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontFamily: fontFamily.Sans_Regular,
                    color: '#FFF',
                    fontSize: responsiveFontSize(2.2),
                    // alignSelf: 'center',
                    // textAlign: 'center',
                    paddingBottom: 20,
                    paddingLeft: 15,
                  }}>
                  Challenges By Discipline Guru :
                </Text>
                {/* </LinearGradient> */}
                <FlatList
                  contentContainerStyle={styles.listcontainer}
                  renderItem={renderItem}
                  data={guruChallenges}
                  keyExtractor={item => item.id}
                  numColumns={2}
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={() => {
                    return (
                      <View
                        style={{
                          height: 100,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: isdarkmode ? '#fff' : '#000',
                            fontSize: 16,
                            fontFamily: fontFamily.Sans_Regular,
                          }}>
                          No Record Found
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            );
          }}
        />
        {/* <TouchableOpacity
          // style={styles.modalbutton}
          style={styles.modalbutton1}
          onPress={() => props.navigation.navigate('AddChallenge1')}>
          <AntDesign
            name="pluscircle"
            color={'#EC1D94'}
            size={responsiveWidth(17)}
          />
        </TouchableOpacity> */}

        <AddButton onPress={() => props.navigation.navigate('AddChallenge1')} />

        {/* </ScrollView> */}
      </LinearGradient>
    </SafeAreaView>
  );
};

// export default GoodMorning;
export default FirstGoodMorning;

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
    marginBottom: responsiveHeight(4),
  },
  challengetxt: {
    fontFamily: fontFamily.Sans_Regular,
    // color: '#FFF',
    fontSize: responsiveFontSize(2.2),
    alignSelf: 'center',
    textAlign: 'center',
  },
  runnerimg: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },
  listcontainer: {
    marginTop: responsiveHeight(2),
  },
  modalbutton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    marginLeft: '75%',
    bottom: responsiveWidth(5),
    marginRight: responsiveWidth(7),
  },
  modalbutton1: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    // marginLeft: '75%',
    bottom: responsiveWidth(5),
    marginRight: responsiveWidth(7),
    right: 10,
    backgroundColor: 'white',
    borderRadius: responsiveWidth(40),
  },
});
