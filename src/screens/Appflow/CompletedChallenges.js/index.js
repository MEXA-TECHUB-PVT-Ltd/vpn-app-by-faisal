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

const CompletedChallenges = props => {
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
      getCompletedChallenges();
    }, []),
  );

  const getCompletedChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    console.log('user id to get completed challenges : ', user_id);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(api.get_user_all_completed_challenges, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        started_user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == true) {
          setList([]);
        } else {
          let data = response ? response : [];
          setList(data?.reverse());
        }
        // if (response[0]?.error == false) {
        //   let responseData = response[0] ? response[0] : [];
        //   // setList(responseData);
        //   console.log('responseData :  ', responseData);
        // } else {
        //   setList([]);
        // }
      })
      .catch(error => {
        console.log('Error raised: ' + error);
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

  const renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate('CommunityChallengeView', {
            item: item?.item,
            uniq_id: item?.item?.challenge__detail?.uniq_id,
            view: 'view',
            type: 'view',
          });
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
          {item?.item?.challenge__detail?.image ? (
            <Image
              source={{
                uri: `${BASE_URL_IMAGE}/${item?.item?.challenge__detail?.image}`,
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
            {item?.item?.challenge__detail?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePullRefresh = () => {
    getCompletedChallenges();
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Completed Challenge'} />
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

export default CompletedChallenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
  },
  linearGradient: {
    flex: 1,
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
