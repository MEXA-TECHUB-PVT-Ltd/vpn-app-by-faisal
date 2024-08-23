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
import {Button, Menu, Divider, Provider} from 'react-native-paper';
import {appImages} from '../../../assets/utilities';
import {useSelector, useDispatch} from 'react-redux';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import {useNavigation} from '@react-navigation/native';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const Books = props => {
  const navigation = useNavigation();
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
  const [data, setData] = useState([
    // {
    //   id: 0,
    //   title: 'test',
    // },
  ]);
  const [loading, setLoading] = useState(false);
  const [firstList, setFirstList] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllBooks();
  }, []);

  const getAllBooks = async () => {
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_books, {
      method: 'POST',
      headers: headers,
      // body: JSON.stringify({
      //   user_id: user_id,
      // }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let list = response[0]?.data ? response[0]?.data : [];
          // setData(list);
          if (list?.length > 5) {
            let filter = list?.filter((item, index) => index < 6);
            setFirstList(filter);
            let filter1 = list?.filter((item, index) => index >= 6);
            setData(filter1);
          } else {
            setFirstList(filter);
          }
        } else {
          setData([]);
        }
      })
      .catch(error => {
        console.log('Error catch   :  ', error);
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

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('Book_Name_here', {
            booktitle: item?.book_detail?.name,
            id: item?.book_id,
          });
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: responsiveWidth(5),
            width: responsiveWidth(40),
            marginBottom: responsiveHeight(3),
            paddingVertical: responsiveHeight(3),
            height: responsiveHeight(25),
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(4),
          }}>
          <Image
            source={appImages.note_book}
            style={{
              width: responsiveWidth(23),
              height: responsiveWidth(23),
              marginRight: responsiveWidth(3),
            }}
          />
          <View style={{flex: 1, justifyContent: 'center'}}>
            <Text
              numberOfLines={3}
              style={[
                styles.txtstyle,
                {
                  width: responsiveWidth(25),
                  textAlign: 'center',
                  color: isdarkmode ? seconddark : second,
                },
              ]}>
              {item?.book_detail?.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Books'} />
        {loading && <Loader />}
        <FlatList
          data={firstList}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: responsiveHeight(3),
            paddingHorizontal: responsiveWidth(6.4),
          }}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          ListFooterComponent={() => (
            <View>
              <View
                style={{
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <BannerAd
                  unitId={TestIds.BANNER}
                  size={BannerAdSize.BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                  }}
                />
              </View>
              <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={{
                  paddingTop: responsiveHeight(3),
                  paddingHorizontal: responsiveWidth(6.4),
                }}
                numColumns={2}
                columnWrapperStyle={{justifyContent: 'space-between'}}
              />
            </View>
          )}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Books;

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
