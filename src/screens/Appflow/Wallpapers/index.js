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
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

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
import {MyButton} from '../../../components/MyButton';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import Loader from '../../../components/Loader/Loader';

const Wallpapers = props => {
  const [data, setData] = useState([]);
  const [bigwallpaper, setbigwallpaper] = useState();
  const [reference, setReference] = useState(null);

  const [loading, setLoading] = useState(false);

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadImage();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage Permission Required',
            message: 'App needs access to your storage to download Photos',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('storage Permission Granted,');
          downloadImage();
        } else {
          alert('storage Permission Not Granted');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };
  const downloadImage = () => {
    let date = new Date();
    // let image_URL = global.url + bigwallpaper;
    let image_URL = bigwallpaper;
    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/image_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'Image',
      },
    };
    config(options)
      .fetch('GET', image_URL)
      .then(res => {
        Snackbar.show({
          text: 'Wallpaper downloaded successfully',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
      })
      .catch(error => {
        Snackbar.show({
          text: 'Something went wrong.Please try again.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      });
  };
  const getExtention = filename => {
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  // const [list, setList] = useState([
  //   {
  //     id: 1,
  //     flag: false,
  //   },
  //   {
  //     id: 2,
  //     flag: false,
  //   },
  //   {
  //     id: 3,
  //     flag: false,
  //   },
  //   {
  //     id: 4,
  //     flag: true,
  //   },
  // ]);
  // const getWallpaper = async () => {
  //   try {
  //     const response = await fetch(global.url + "api/wallPaper/getAllWallPapers");
  //     const json = await response.json();
  //     setData(json.result);            //json.id to sub ides ayan ge
  //     console.log(json.result[0].wallPaper)
  //     setbigwallpaper(json.result[0].wallPaper)
  //     // console.log(data[0])
  //     // console.log(response)
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const isImageExist = async url => {
    return new Promise((resolve, reject) => {
      try {
        fetch(url)
          .then(res => {
            if (res.status == 404) {
              resolve(false);
            } else {
              resolve(true);
            }
          })
          .catch(err => {
            resolve(false);
          });
      } catch (error) {
        resolve(false);
      }
    });
  };
  const getAllWallpaper = async () => {
    try {
      setLoading(true);
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      fetch(api.get_all_wallpapers, requestOptions)
        .then(response => response.json())
        .then(async result => {
          if (result[0]?.error == false) {
            let list = result[0]?.data ? result[0]?.data : [];
            let myList = [];
            for (const element of list) {
              let img = element?.image
                ? BASE_URL_IMAGE + '/' + element?.image
                : '';
              let isExist = await isImageExist(img);
              if (isExist) {
                let obj = {
                  wallpaper_id: element?.wallpaper_id,
                  image: img,
                  created_at: element?.created_at,
                };
                myList.push(obj);
              }
            }
            if (myList.length > 0) {
              setbigwallpaper(myList[0]?.image);
            }
            setData(myList);
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
        .finally(() => setLoading(false));
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    // getWallpaper()
    getAllWallpaper();
  }, []);
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.65}
        style={{
          marginLeft: responsiveWidth(5.6),
        }}
        // onPress={() => setbigwallpaper(item.wallPaper)}>
        onPress={() => setbigwallpaper(item?.image)}>
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          {/* <Image
            // source={{uri: global.url + item.wallPaper}}
            source={{uri: item?.image}}
            // source={{
            //   uri: 'http://ec2-52-69-249-182.ap-northeast-1.compute.amazonaws.com/backend/images/wallpapers/WhatsApp Image 2022-12-25 at 8.15.28 PM.jpeg',
            // }}
            style={{
              width: responsiveWidth(18),
              height: responsiveWidth(24),
              resizeMode: 'stretch',
              backgroundColor: '#fff',
            }}
          /> */}

          <FastImage
            style={{
              width: responsiveWidth(18),
              height: responsiveWidth(24),
              backgroundColor: '#fff',
            }}
            source={{
              uri: item?.image,
              priority: FastImage.priority.normal,
              resizeMode: 'stretch',
            }}
            resizeMode={FastImage.resizeMode.stretch}
          />
        </View>
      </TouchableOpacity>
    );
  };
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
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Wallpapers'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          {loading && <Loader color={isdarkmode ? doubledark : double} />}
          <MyButton
            title={'Download'}
            onPress={checkPermission}
            myStyles={{
              alignSelf: 'flex-end',
              marginTop: responsiveHeight(2),
              marginRight: responsiveWidth(7),
            }}
          />
          {/* <Image
            // source={{uri: global.url + bigwallpaper}}
            source={{uri: bigwallpaper}}
            style={{
              width: responsiveWidth(85),
              height: responsiveHeight(60),
              alignSelf: 'center',
              // resizeMode: 'cover',
              resizeMode: 'stretch',
              marginVertical: responsiveHeight(2),
            }}
          /> */}

          <FastImage
            style={{
              width: responsiveWidth(85),
              height: responsiveHeight(60),
              marginVertical: responsiveHeight(2),
              alignSelf: 'center',
              backgroundColor: '#fff',
            }}
            source={{
              uri: bigwallpaper,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />

          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{width: '75%', height: 100}}>
              <FlatList
                data={data}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                ref={ref => {
                  setReference(ref);
                }}
              />
            </View>

            <View>
              <TouchableOpacity
                style={{
                  width: responsiveWidth(19),
                  height: responsiveWidth(27),
                  // position: 'absolute',
                  // marginTop: '129%',
                  // marginLeft: '75%',
                  left: 5,
                  marginRight: responsiveWidth(7),
                  backgroundColor: isdarkmode ? seconddark : second,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                }}
                onPress={() => {
                  reference.scrollToEnd({animated: true});
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontFamily: fontFamily.Sans_Regular,
                    fontSize: responsiveFontSize(2.4),
                  }}>
                  Load{'\n'}
                  More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Wallpapers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    // paddingHorizontal: responsiveWidth(5),
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
});
