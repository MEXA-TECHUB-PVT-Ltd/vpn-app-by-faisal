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

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';

const HiddenChallenges = props => {
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

  const [loading, setLoading] = useState(false);

  const [list, setList] = useState([
    // {
    //   id: 1,
    // },
    // {
    //   id: 2,
    // },
  ]);

  useEffect(() => {
    getAllHiddenChallenges();
  }, []);

  const getSpecificChallengeDetail = async uniq_id => {
    return new Promise(async (resolve, reject) => {
      try {
        let user_id = await AsyncStorage.getItem('user_id');
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
              let challenge_detail =
                response[0]?.all_record[0]?.challenge_detail;
              resolve(challenge_detail);
            } else {
              resolve(false);
            }
          })
          .catch(error => {
            resolve(false);
          })
          .finally(() => {
            resolve(false);
          });
      } catch (error) {
        resolve(false);
      }
    });
  };

  const getAllHiddenChallenges = async () => {
    setLoading(true);
    let user_id = await AsyncStorage.getItem('user_id');
    // let user_id = 21;
    console.log('user_id  :  ', user_id);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      user_id: user_id,
    };

    await fetch(api.get_all_hidden_challenges_of_a_user, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error != true) {
          // setList(response);
          let responseList = [];
          for (const element of response) {
            let challenge_detail = await getSpecificChallengeDetail(
              element?.started_challenge_detail?.challenge_uniq_id,
            );
            let obj = {
              ...element,
              challenge_detail,
            };
            responseList?.push(obj);
          }
          setList(responseList);
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

  const handleShowHiddenChallenge = async item => {
    setLoading(true);
    try {
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let challenge_Detail = item?.started_challenge_detail;
      let data = {
        started_challenge_id: challenge_Detail?.id,
        // user_id: challenge_Detail?.started_user_id,
        started_user_id: challenge_Detail?.started_user_id,
        // user_id: 21,
        challenge_uniq_id: challenge_Detail?.challenge_uniq_id,
        current_hide_status: challenge_Detail?.hide_status,
      };
      console.log('data passed  to hide a challenge  is   :   ', data);
      await fetch(api.hide_a_challenge, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('response of hide challenge is  :   ', response);

          Snackbar.show({
            text: 'Challenge Visible Successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });
          const filter = list.filter(
            item =>
              item.started_challenge_detail?.challenge_uniq_id !=
              challenge_Detail?.challenge_uniq_id,
          );
          setList(filter);
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
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CommunityChallengeView', {
              item: item?.item,
              uniq_id: item?.item?.challenge_detail?.uniq_id,
              view: 'view',
              type: 'view',
            });
          }}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          {item?.item?.challenge_detail?.image ? (
            <Image
              source={{
                uri: `${BASE_URL_IMAGE}/${item?.item?.challenge_detail?.image}`,
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
            {item?.item?.challenge_detail?.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          // onPress={() => props.navigation.navigate('ChallengeList')}
          onPress={() => handleShowHiddenChallenge(item?.item)}>
          <Text
            style={[
              styles.txtstyle,
              {
                textDecorationLine: 'underline',
                color: isdarkmode ? seconddark : second,
              },
            ]}>
            Show
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Hidden Challenges'} />

        {loading && <Loader color={'red'} />}
        <FlatList
          data={list}
          renderItem={renderItem}
          contentContainerStyle={{padding: responsiveHeight(1.5)}}
          ListEmptyComponent={() => {
            return (
              <View
                style={{
                  flex: 1,
                  height: responsiveHeight(80),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {!loading && (
                  <Text
                    style={{
                      color: isdarkmode ? '#fff' : '#000',
                      fontSize: 16,
                      fontFamily: fontFamily.Sans_Regular,
                    }}>
                    No Record Found
                  </Text>
                )}
              </View>
            );
          }}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HiddenChallenges;

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
