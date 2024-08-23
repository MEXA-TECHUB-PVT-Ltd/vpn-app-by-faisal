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
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
import {useFocusEffect} from '@react-navigation/native';
import AddButton from '../../../components/AddButton';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const DailyJournal = props => {
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
  // const openMenu = () => setVisible(true);
  // const closeMenu = () => setVisible(false);
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const [data, setData] = useState([
    // {
    //   id: 1,
    //   date: '19 Dec, 2022',
    //   color: '#90DBC7',
    //   text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et',
    // },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [list, setList] = useState([
  //   {
  //     id: 1,
  //     date: '19 Dec, 2022',
  //     color: '#90DBC7',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
  //   },
  //   {
  //     id: 2,
  //     date: '17 Dec, 2022',
  //     color: '#3EC09C',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
  //   },
  //   {
  //     id: 3,
  //     date: '18 Dec, 2022',
  //     color: '#FFA69E',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
  //   },
  //   {
  //     id: 4,
  //     date: '19 Dec, 2022',
  //     color: '#6C63FF',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
  //   },
  //   {
  //     id: 5,
  //     date: '20 Dec, 2022',
  //     color: '#90DBC7',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et '
  //   },
  //   {
  //     id: 6,
  //     date: '21 Dec, 2022',
  //     color: '#3EC09C',
  //     text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et'
  //   },

  // ]);
  const [date, setdate] = useState();
  const [color, setcolor] = useState();
  const [text, settext] = useState();
  const [getid, setgetid] = useState();
  const [formatedDate, setFormatedDate] = useState('');

  const [selected_journalID, setSelected_journalID] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const downView = item => {
    refRBSheet.current.open();
    setdate(item.date);
    setFormatedDate(item?.formatedDate);
    setcolor(item.color);
    // setcolor('white');
    settext(item.text);
    // settext(item.note);
    // console.log(item.date + "------" + item.color + "-------" + item.text)
  };
  const options = item => {
    refRBSheet1.current.open();
    setgetid(item._id);

    //setting journal id to update or delete jounral with the reference of this id
    setSelected_journalID(item.id);
    settext(item?.text);
    setdate(item?.date);
    setFormatedDate(item?.formatedDate);
    setcolor(item?.color);

    // console.log(getid)
  };
  const Remove = async () => {
    // try {
    //   await fetch(global.url + "api/journals/deleteJournal/" + getid
    //   // await fetch("http://206.189.192.112:3000/api/journals/deleteJournal/63a42d73d8d312f31a697235"
    //   ).then(response => response.json())
    //     .then(data => {
    //       if (data != '') {
    //         alert("Request Accepted!" + data)
    //       }
    //       else alert("Plz Try Again!")
    //     });
    // }
    // catch (error) {
    //   console.log("Post submission failed");
    //   console.log(error.message);
    // }
    var InsertAPIURL = global.url + 'api/journals/deleteJournal/' + getid;
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'DELETE',
      headers: headers,
    })
      .then(response => response.json())
      .then(response => {
        alert('Challenge Deleted!');
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };

  const getFormattedDate = date => {
    return new Promise((resolve, reject) => {
      try {
        // let date = '10-01-2023';
        let s = date?.split('-');
        let day = s[0];
        let month = s[1];
        let year = s[2];
        let dateString = month + '/' + day + '/' + year;
        resolve(dateString);
      } catch (error) {
        resolve('');
      }
    });
  };

  const getDailyJournal1 = useCallback(async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let obj = {
      user_id: user_id,
    };
    await fetch(api.get_all_journal_by_userId, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(obj),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false || response[0]?.error == false) {
          let list = response[0]?.data ? response[0]?.data : [];
          let myList = [];
          for (const element of list) {
            let formated_date = await getFormattedDate(element?.created_at);
            let obj = {
              id: element?.journal_id,
              date: element?.created_at,
              formatedDate: formated_date
                ? moment(formated_date).format('ddd, MMMM YY')
                : '',
              color: element?.color,
              text: element?.note,
            };
            myList.push(obj);
          }
          setData(myList);
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
        setRefresh(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    // getDailyJournal();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // getDailyJournal();
      getDailyJournal1();
    }, []),
  );

  //update selected jounral
  const handleUpdateJournal = () => {
    refRBSheet1?.current?.close();

    props?.navigation?.navigate('UpdateJournal', {
      selected_journalID,
      date,
      color,
      text,
      formatedDate,
    });
  };

  const handleDeleteJournal = async () => {
    if (selected_journalID) {
      console.log(
        'selectd journal id to delete journal :::  ',
        selected_journalID,
      );

      setLoading(true);
      let user_id = await AsyncStorage.getItem('user_id');
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let obj = {
        journal_id: selected_journalID,
      };
      await fetch(api.delete_journal, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(obj),
      })
        .then(response => response.json())
        .then(async response => {
          console.log('delete journal api response  :::  ', response);
          if (response[0]?.error == false || response[0]?.error == false) {
            // refRBSheet1.current.close();
            const filter = data?.filter(item => item?.id != selected_journalID);
            setData(filter);
            setModalVisible(false);
            Snackbar.show({
              text: 'Journal deleted successfully.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
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
        .finally(() => setLoading(false));
    } else {
      Snackbar.show({
        text: 'Something went wrong.Journal Id Not found.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    }
  };

  const renderItem = ({item, index}) => {
    console.log('iteem?.color', item);
    return (
      <View
        style={{
          backgroundColor: item.color ? item.color : '#fff',
          borderRadius: responsiveWidth(5),
          width: responsiveWidth(85),
          padding: responsiveWidth(3.9),
          paddingHorizontal: responsiveWidth(5),
          overflow: 'hidden',
          marginBottom: 10,
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            right: responsiveWidth(2.5),
            top: responsiveWidth(3.5),
            // padding: responsiveWidth(5),
          }}
          onPress={() => options(item)}>
          <MaterialIcons name="more-vert" size={24} color={'gray'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{width: responsiveWidth(67)}}
          onPress={() => downView(item)}
          activeOpacity={0.6}>
          <Text
            style={{
              fontFamily: 'Segoe-UI',
              color: 'black',
              fontSize: 15,
              fontWeight: 'bold',
              marginBottom: responsiveWidth(1),
            }}>
            {/* {item.date} */}
            {item?.formatedDate}
            {/* {moment(item.date).format('D MMMM, YYYY')} */}
          </Text>
          <Text
            numberOfLines={3}
            style={{
              fontFamily: 'Segoe-UI',
              color: 'black',
              fontSize: 15,
            }}>
            {item.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const handlePullRefresh = async () => {
    setRefresh(true);
    getDailyJournal1();
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Daily journal'} />

        {isLoading && <Loader />}

        <View
          style={{
            alignSelf: 'center',
            position: 'relative',
            top: 0,
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
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={[isdarkmode ? soliddark : solid]}
            />
          }
          data={data}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop: responsiveHeight(3),
            paddingHorizontal: responsiveWidth(6.4),
          }}
          // numColumns={2}
          // columnWrapperStyle={{justifyContent: 'space-between'}}
        />
        {/* <TouchableOpacity
          style={styles.modalbutton}
          onPress={() => props.navigation.navigate('Calander')}>
          <Image
            source={appImages.addemoji}
            style={{
              width: responsiveWidth(22),
              height: responsiveWidth(22),
              // alignSelf: 'center',
            }}
          />
        </TouchableOpacity> */}
        <AddButton onPress={() => props.navigation.navigate('Calander')} />
        {/* -----------------downView---------------------- */}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          // animationType="fade"
          customStyles={{
            wrapper: {
              // backgroundColor: 'transparent',
              // backgroundColor: 'rgba(0,0,0,0.4)',
            },
            draggableIcon: {
              backgroundColor: 'black',
            },
            container: {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: '40%',
              backgroundColor: color,
              // padding: 20,
            },
          }}>
          <ScrollView style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                refRBSheet?.current?.close();
              }}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={appImages.closeemoji}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 25,
                  marginTop: 20,
                  marginBottom: 10,
                  tintColor: '#000',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}>
              <View
                style={{
                  backgroundColor: color,
                  width: responsiveWidth(100),
                  // height: responsiveHeight(100),
                  borderRadius: responsiveWidth(1),
                  paddingHorizontal: responsiveWidth(4),
                }}>
                {/* <Image
                  source={appImages.emoji}
                  style={{
                    width: responsiveWidth(20),
                    height: responsiveWidth(20),
                    marginRight: responsiveWidth(3),
                  }}
                /> */}
                <Text
                  style={{
                    fontFamily: fontFamily.Sans_Regular,
                    color: 'black',
                    fontSize: 15,
                    fontWeight: 'bold',
                    marginVertical: responsiveHeight(1.5),
                  }}>
                  {/* {date} */}

                  {formatedDate}
                </Text>
                <Text
                  style={[
                    styles.txtstyle,
                    {
                      color: 'black',
                    },
                  ]}>
                  {text}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
        {/* -------------------options--------------------- */}
        <RBSheet
          ref={refRBSheet1}
          closeOnDragDown={false}
          closeOnPressMask={true}
          // animationType="fade"
          customStyles={{
            wrapper: {
              // backgroundColor: 'transparent',
              // backgroundColor: 'rgba(0,0,0,0.4)',
            },
            draggableIcon: {
              backgroundColor: '#000',
            },
            container: {
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: '30%',
            },
          }}>
          <View style={{padding: 20}}>
            <TouchableOpacity
              onPress={() => {
                refRBSheet1?.current?.close();
              }}
              style={{alignSelf: 'flex-end'}}>
              <Image
                source={appImages.closeemoji}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 8,
                  marginBottom: 20,
                  tintColor: '#000',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={setcheck(true)}
              onPress={() => {
                refRBSheet1?.current?.close();
                handleUpdateJournal();
              }}
              style={{flexDirection: 'row', paddingLeft: 15}}>
              <MaterialIcons name="update" size={24} color={'black'} />
              <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                Update
              </Text>
            </TouchableOpacity>

            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'lightgray',
                margin: 15,
              }}></View>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                refRBSheet1?.current?.close();
              }}
              style={{flexDirection: 'row', paddingLeft: 15}}>
              <MaterialIcons name="delete" size={24} color={'black'} />
              <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
        {/* ====================model for delete-------------------------- */}
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View
              style={{
                ...styles.centeredView,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              }}>
              <View style={styles.modalView}>
                <Image
                  source={appImages.alert}
                  style={{
                    height: responsiveWidth(14),
                    width: responsiveWidth(14),
                    tintColor: isdarkmode ? soliddark : solid,
                  }}
                  resizeMode={'contain'}
                />
                <Text
                  style={{
                    ...styles.textStyle,
                    marginVertical: responsiveWidth(3.5),
                    color: isdarkmode ? soliddark : solid,
                  }}>
                  Do you want to delete this Journal?
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveWidth(2.5),
                  }}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose1,
                      {
                        paddingLeft: 10,
                        top: 0,
                        marginRight: responsiveWidth(4),
                      },
                    ]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={[styles.textStyle, {color: '#000'}]}>NO</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.button,
                      styles.buttonClose,
                      {top: 0, backgroundColor: isdarkmode ? soliddark : solid},
                    ]}
                    // onPress={() => Remove()}>
                    onPress={() => handleDeleteJournal()}>
                    <Text style={[styles.textStyle, {color: '#fff'}]}>YES</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DailyJournal;

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
    // fontSize: responsiveFontSize(2.3),
    fontSize: 14,
  },
  modalbutton: {
    // alignSelf: 'flex-end',
    position: 'absolute',
    bottom: responsiveHeight(7),
    // marginTop: '150%',
    // marginLeft: '75%',
    right: responsiveWidth(1),
    marginRight: responsiveWidth(7),
  },
  // ----------------------------model styleing----------------------
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
  },
  modalView: {
    margin: 20,
    width: 250,
    // height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: responsiveWidth(5.5),
    paddingHorizontal: responsiveWidth(5.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#ccc',
  },

  buttonClose: {
    top: 50,
    width: 90,
    backgroundColor: '#EC1D94',
  },

  buttonClose1: {
    top: 50,
    width: 90,
    // backgroundColor: COLORS.orange,
  },
  textStyle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#EC1D94',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
