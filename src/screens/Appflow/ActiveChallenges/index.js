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
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';

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
import {Button, Menu, Divider, Provider} from 'react-native-paper';
import {appImages} from '../../../assets/utilities';
import {useSelector, useDispatch} from 'react-redux';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader/Loader';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import moment from 'moment/moment';

const ActiveChallenges = props => {
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
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState([]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getActiveChallenges();
    }, []),
  );

  const getActiveChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    console.log('user_id  :  ', user_id);

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_started_challenge_of_user, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == true) {
          setList([]);
        } else {
          let responseData = response?.length > 0 ? response : [];
          let responseData1 = responseData?.filter(
            item =>
              item?.started_challenge_detail?.completed_challenge == 'false' &&
              item?.started_challenge_detail?.hide_status == 'false' &&
              item?.started_challenge_detail?.started_date <=
                moment(new Date()).format('DD-MM-YYYY'),
          );

          let data = [];
          for (const element of responseData1) {
            let complete_challenge_details = await getChallengeDetail(
              element?.started_challenge_detail?.challenge_uniq_id,
            );

            let challenge_detail =
              complete_challenge_details == false
                ? null
                : complete_challenge_details?.challenge_detail;
            let hidestatus =
              complete_challenge_details == false
                ? false
                : complete_challenge_details?.hidestatus;
            if (challenge_detail) {
              let obj = {
                ...element,
                challenge_detail: challenge_detail?.challenge_detail,
                likes_count: challenge_detail?.likes_count,
                hidestatus: hidestatus,
              };

              data.push(obj);
            } else {
              // console.log('Oops!challenge detail not found');
            }
          }
          //remove hidden challenges from list
          // const filter = data?.filter(item => item?.hidestatus != true);
          // setList(data);
          setList(data);
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

  // get single challenge all detail
  const getChallengeDetail = async uniq_id => {
    return new Promise(async (resolve, reject) => {
      try {
        var headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        let user_id = await AsyncStorage.getItem('user_id');
        await fetch(api.get_single_challenge_detail, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            uniq_id: uniq_id,
            user_id: user_id,
          }),
        })
          .then(response => response.json())
          .then(async response => {
            if (response[0]?.error == false) {
              // let responseData = response[0]?.all_record
              //   ? response[0]?.all_record
              //   : [];
              let obj = {
                challenge_detail: response[0]?.all_record[0],
                hidestatus: response[0]?.hidestatus,
              };
              // resolve(response[0]?.all_record[0]);
              resolve(obj);
            } else {
              //error or data not found
              resolve(false);
            }
          })
          .catch(error => {
            resolve(false);
          });
      } catch (error) {
        resolve(false);
      }
    });
  };

  // const renderItem = item => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: '#fff',
  //         borderRadius: responsiveWidth(5),
  //         width: responsiveWidth(40),
  //         marginBottom: responsiveHeight(3),
  //         paddingVertical: responsiveHeight(3),
  //         alignItems: 'center',
  //         paddingHorizontal: responsiveWidth(4),
  //       }}>
  //       {/* <Image
  //         // source={appImages.runner}
  //         source={{uri:BASE_URL}}
  //         style={{
  //           width: responsiveWidth(23),
  //           height: responsiveWidth(23),
  //           marginRight: responsiveWidth(3),
  //         }}
  //       /> */}
  //       <FastImage
  //         // source={appImages.runner}
  //         source={{
  //           uri: BASE_URL_IMAGE + '/' + item?.item?.challenge_detail?.image,
  //         }}
  //         style={{
  //           ...styles.runnerimg,
  //           width: responsiveWidth(16),
  //           height: responsiveWidth(16),
  //         }}
  //         resizeMode="contain"
  //       />
  //       <Text
  //         style={[
  //           styles.txtstyle,
  //           {
  //             width: responsiveWidth(25),
  //             textAlign: 'center',
  //             color: isdarkmode ? seconddark : second,
  //           },
  //         ]}>
  //         {item?.item?.challenge_detail?.name}
  //       </Text>
  //     </View>
  //   );
  // };

  const handleItemPress = item => {
    let obj = {
      challenge_uniq_id: item?.started_challenge_detail?.challenge_uniq_id,
      challengeName: item?.challenge_detail?.name,
      challengeDescription: item?.challenge_detail?.description,
      img: BASE_URL_IMAGE + '/' + item?.challenge_detail?.image,
      // daysDesc: daysDesc,
      daysDesc: item?.started_challenge_days,
      hiddenStatus: item?.started_challenge_detail?.hide_status,
      // _id: _id,
      adderId: item?.challenge_detail.addedby,
      id: item?.started_challenge_detail?.id,
    };

    props?.navigation.navigate('ChallengeList', obj);
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.singleview,
          {backgroundColor: isdarkmode ? soliddark : 'white'},
        ]}
        onPress={() => {
          // props.navigation.navigate('CommunityChallengeView', {
          //   item: item?.item,
          //   uniq_id: item?.item?.challenge_detail?.uniq_id,
          //   // liked: true,
          //   likes_count: item?.item?.likes_count,
          //   type: 'view',
          // });
          // props.navigation.navigate('ChallengeName', {
          //   uniq_id: item?.item?.challenge_uniq_id,
          // });

          handleItemPress(item?.item);
        }}>
        <View
          style={{
            ...styles.runnerimg,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {item?.item?.challenge_detail?.image ? (
            <FastImage
              // source={appImages.runner}
              source={{
                uri: BASE_URL_IMAGE + '/' + item?.item?.challenge_detail?.image,
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
          {item?.item?.challenge_detail?.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handlePullRefresh = () => {
    setRefreshing(true);
    getActiveChallenges();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Active Challenges'} />
        {loading && <Loader />}
        <FlatList
          data={list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={[isdarkmode ? soliddark : solid]}
            />
          }
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true} // Unmount components when outside of window
          updateCellsBatchingPeriod={100} // Increase time between renders
          windowSize={7} // Reduce the window size
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: responsiveHeight(3),
            paddingHorizontal: responsiveWidth(6.4),
          }}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          ListEmptyComponent={() => (
            <View
              style={{
                // height: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? null : (
                <Text
                  style={{
                    color: isdarkmode ? '#fff' : '#fff',
                    fontSize: 16,
                    fontFamily: fontFamily.Sans_Regular,
                  }}>
                  No Record Found
                </Text>
              )}
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ActiveChallenges;

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
    // marginLeft: responsiveWidth(7),
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
});
