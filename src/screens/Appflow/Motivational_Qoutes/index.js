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
import React, {useEffect, useState, useCallback} from 'react';
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
import {Modal} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {BlurView} from '@react-native-community/blur';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import Loader from '../../../components/Loader/Loader';

import ImageView from 'react-native-image-viewing';

import {Modal as PaperModal, Portal} from 'react-native-paper';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const KeepSakes = props => {
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
  const [modalvisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [isFullPageVisible, setIsFullPageVisible] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const [numColumns, setnumColumns] = useState(2);

  const [firstList, setFirstList] = useState([]);

  //   const [list, setList] = useState([
  //     {
  //       id: 1,
  //       keepsake: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
  //     },
  //     {
  //       id: 2,
  //       keepsake:
  //         'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod  sadipscing elitr, sed diam nonumy eirmod ',
  //     },
  //   ]);
  //   const getKeepSakes = async () => {
  //     try {
  //       const response = await fetch("http://206.189.192.112:3000/api/keepSake/getAllKeepSakes");
  //       const json = await response.json();
  //       setData(json.result);            //json.id to sub ides ayan ge
  //       console.log(json.result[0].keepSake)
  //       // console.log(data[0])
  //       // console.log(response)
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   useEffect(() => {
  //       getKeepSakes()
  // }, []);

  useEffect(() => {
    setLoading(true);
    getAllMotivationalQuotes();
  }, []);

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
            if (list?.length > 5) {
              let filter = list?.filter((item, index) => index < 6);
              setFirstList(filter);
              let filter1 = list?.filter((item, index) => index >= 6);
              setData(filter1);
            } else {
              setFirstList(list);
            }
            // setFirstList(list);
          } else {
            Snackbar.show({
              text: 'Something went wrong.',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: 'red',
            });
          }
        })
        .catch(error => {
          Snackbar.show({
            text: 'Something went wrong.',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: 'red',
          });
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      setLoading(false);
    }
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          // showModal();
          setIsImageModalVisible(true);
          setSelectedImage(BASE_URL_IMAGE + '/' + item?.image);
        }}
        // disabled={item.id !== 1 ? true : false}
        style={{
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(3),
          marginTop: responsiveHeight(3),
          width: responsiveWidth(40),
          // paddingVertical: responsiveHeight(3),
          // paddingHorizontal: responsiveHeight(1),
          alignSelf: 'flex-start',
          overflow: 'hidden',
        }}>
        <FastImage
          // source={appImages.paris}
          source={{
            uri: BASE_URL_IMAGE + '/' + item?.image,
          }}
          style={{
            height: responsiveHeight(20),
            width: responsiveWidth(40),
            resizeMode: 'cover',
            // backgroundColor: 'red',
          }}
        />
      </TouchableOpacity>
    );
  };

  // const renderItem = ({item}) => {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       // onPress={() => console.log(';item  press  ::   ', item)}
  //       onPress={() => {
  //         // showModal();
  //         setIsFullPageVisible(true);
  //         setSelectedQuote(item?.quote);
  //       }}
  //       // disabled={item.id !== 1 ? true : false}
  //       style={{
  //         backgroundColor: '#fff',
  //         borderRadius: responsiveWidth(3),
  //         width: responsiveWidth(40),
  //         marginTop: responsiveHeight(3),
  //         paddingVertical: responsiveHeight(3),
  //         paddingHorizontal: responsiveHeight(1),
  //         alignSelf: 'flex-start',
  //       }}>
  //       {/* {item.id == 1 ? (
  //         <View
  //           style={{
  //             position: 'absolute',
  //             top: 0,
  //             bottom: 0,
  //             left: 0,
  //             right: 0,
  //             backgroundColor: '#fff',
  //             borderRadius: responsiveWidth(3),
  //             zIndex: 1,
  //             opacity: 0.975,
  //             width: responsiveWidth(40),
  //           }}>
  //           <View
  //             style={{
  //               backgroundColor: 'rgba(0,0,0,0.04)',
  //               position: 'absolute',
  //               top: 0,
  //               bottom: 0,
  //               left: 0,
  //               right: 0,
  //               borderRadius: responsiveWidth(3),
  //             }}></View>
  //         </View>
  //       ) : null} */}

  //       <Text style={[styles.txtstyle]} numberOfLines={3}>
  //         {/* {item.keepSake} */}
  //         {item?.quote}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };

  const handlePullToRefresh = () => {
    setRefreshing(true);
    getAllMotivationalQuotes();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Motivational Qoutes'} />
        {loading && <Loader />}

        <ImageView
          images={[
            {
              uri: selectedImage,
            },
          ]}
          imageIndex={0}
          visible={isImageModalVisible}
          onRequestClose={() => setIsImageModalVisible(false)}
        />
        <View style={{flex: 1}}>
          <FlatList
            data={firstList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => handlePullToRefresh()}
                colors={[isdarkmode ? soliddark : solid]}
              />
            }
            renderItem={renderItem}
            contentContainerStyle={{
              paddingHorizontal: responsiveWidth(6),
              width: responsiveWidth(100),
            }}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            ListFooterComponent={() => (
              <View>
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

                <FlatList
                  data={data}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={() => handlePullToRefresh()}
                      colors={[isdarkmode ? soliddark : solid]}
                    />
                  }
                  renderItem={renderItem}
                  contentContainerStyle={{
                    paddingHorizontal: responsiveWidth(6),
                    width: responsiveWidth(100),
                  }}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'space-between',
                  }}
                  ListFooterComponent={() => (
                    <View
                      style={{
                        paddingTop: 50,
                        flexDirection: 'row',
                        justifyContent: 'center',
                      }}></View>
                  )}
                />
              </View>
            )}
          />
        </View>
        {/* <View
          style={{
            paddingTop: 50,
            flexDirection: 'row',
            justifyContent: 'center',
          }}></View> */}
      </LinearGradient>

      {/* full page  modal   */}

      <Modal
        visible={isFullPageVisible}
        onDismiss={() => setIsFullPageVisible(false)}
        dismissable={false}
        contentContainerStyle={{
          backgroundColor: '#fff',
          padding: responsiveWidth(4),
          height: responsiveHeight(100),
        }}>
        <View
          style={{
            flex: 1,
            marginBottom: responsiveHeight(6),
          }}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: responsiveWidth(0),
              top: -20,
              padding: 10,
            }}
            onPress={() => {
              setIsFullPageVisible(false);
            }}>
            <Image
              source={appImages.closeemoji}
              style={{
                tintColor: '#838383',
                width: responsiveWidth(5),
                height: responsiveHeight(5),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: '#000',
                marginTop: responsiveHeight(6),
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2.1),
                padding: responsiveWidth(4),
              }}>
              {selectedQuote}
            </Text>
          </View>
        </View>
      </Modal>

      {/* <Modal visible={modalvisible} onDismiss={hideModal}>
        <View
          style={{
            backgroundColor: '#fff',
            width: responsiveWidth(80),
            alignSelf: 'center',
            borderRadius: responsiveWidth(10),
            alignItems: 'center',
            paddingVertical: responsiveHeight(3),
            paddingHorizontal: responsiveWidth(2),
          }}>
          <Image
            source={appImages.alert}
            style={{
              width: responsiveWidth(13),
              height: responsiveWidth(13),
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              color: isdarkmode ? soliddark : solid,
              fontFamily: fontFamily.Poppins_Regular,
              fontSize: responsiveFontSize(2.4),
              paddingVertical: responsiveHeight(3),
            }}>
            Oops! Keepsake Locked
          </Text>
          <TouchableOpacity
            onPress={() => hideModal()}
            activeOpacity={0.65}
            style={{
              width: responsiveWidth(68),
              backgroundColor: isdarkmode ? seconddark : second,
              paddingVertical: responsiveHeight(1),
              borderRadius: responsiveWidth(7),
            }}>
            <Text
              style={{
                fontFamily: fontFamily.Poppins_Regular,
                fontSize: responsiveFontSize(2),
                // paddingVertical: responsiveHeight(0.5),
                width: responsiveWidth(60),
                textAlign: 'center',
                color: '#fff',
                alignSelf: 'center',
              }}>
              Unlock Keepsake with{'\n'} 20 coins
            </Text>
          </TouchableOpacity>
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

export default KeepSakes;

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
    color: '#787878',
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(1.9),
    // alignSelf: 'center',
    textAlign: 'center',
  },
});
