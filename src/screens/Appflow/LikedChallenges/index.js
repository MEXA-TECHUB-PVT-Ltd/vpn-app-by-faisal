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
import {useFocusEffect} from '@react-navigation/native';
import Loader from '../../../components/Loader/Loader';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';

const LikedChallenges = props => {
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
      getChallenges();
    }, []),
  );

  const getChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_like_challenges_by_user_new, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        let responseData = response ? response : [];
        if (responseData?.length > 0) {
          const filter = responseData?.filter(
            item => item?.challenge_detail != null,
          );
          setList(filter);
        } else {
          setList([]);
        }
        // if (response[0]?.error == false) {
        //   // let responseData = response[0]?.all_record
        //   //   ? response[0]?.all_record
        //   //   : [];
        //   let responseData = response[0] ? response[0] : [];
        //   setList(responseData);
        // } else {
        //   setList([]);
        // }
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

  const isChallengeStartedByThisUser = async challenge_uniq_id => {
    return new Promise(async (resolve, reject) => {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let user_id = await AsyncStorage.getItem('user_id');
      let data = {
        challenge_uniq_id: challenge_uniq_id,
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
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('error  : ', error);
          resolve(false);
        });
    });
  };

  const handleChallengePress = async item => {
    // console.log('item :: ', item);
    let isChallengeStart = await isChallengeStartedByThisUser(
      item?.challenge_detail[0]?.uniq_id,
    );
    console.log({isChallengeStart});
    props.navigation.navigate('CommunityChallengeView', {
      item: item,
      // uniq_id: item?.item?.challenge_uniq_id,
      uniq_id: item?.challenge_detail[0]?.uniq_id,
      // type: 'view',
      isStarted: isChallengeStart,
      liked: true,
    });
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          handleChallengePress(item?.item);
        }}
        style={{
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(3),
          alignSelf: 'center',
          width: responsiveWidth(91),
          marginTop: responsiveHeight(3),
          paddingVertical: responsiveHeight(2),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: responsiveWidth(4),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.item?.challenge_detail[0]?.image ? (
            <Image
              source={{
                uri: `${BASE_URL_IMAGE}/${item?.item?.challenge_detail[0]?.image}`,
              }}
              style={{
                resizeMode: 'contain',
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
            {item?.item?.challenge_detail[0]?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePullRefresh = () => {
    getChallenges();
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Liked Challenge'} />
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
          renderItem={renderItem}
          contentContainerStyle={{padding: responsiveHeight(1.5)}}
          ListEmptyComponent={() => {
            return (
              <>
                {!loading && (
                  <Text
                    style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>
                    No Record Found
                  </Text>
                )}
              </>
            );
          }}
        />

        <View
          style={{
            paddingTop: 50,
            flexDirection: 'row',
            justifyContent: 'center',
          }}></View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LikedChallenges;

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
});
