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
  TouchableRipple,
  Modal,
  SectionList,
  RefreshControl,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useSelector, useDispatch} from 'react-redux';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {appImages} from '../../../assets/utilities';

import {api} from '../../../constants/api';
import Loader from '../../../components/Loader/Loader';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fontFamily} from '../../../constants/fonts';
import moment from 'moment';

import {Calendar} from 'react-native-calendars';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AddButton from '../../../components/AddButton';
import {BannerAd, BannerAdSize,TestIds} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const To_do_list = props => {
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
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const refRBSheet2 = useRef();
  const refRBSheetTaskDetail = useRef();
  const refRBSheet_Add_TODO = useRef(null);
  const [clickedId, setclickedId] = useState(0);
  const [check, setcheck] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  const [todoListCopy, setTodoListCopy] = useState([]);
  const [todoText, setTodoText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [clickedTitle, setClickedTitle] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectedTaskStatus, setSelectedTaskStatus] = useState('');

  const [markedDates, setMarkedDates] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const [textdate, setTextdate] = useState('');
  const [dateapi, setdateapi] = useState('');
  const [formatedDate, setformatedDate] = useState('');

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isFilter, setIsFilter] = useState(false);

  const [taskAdddedModalVisible, setTaskAdddedModalVisible] = useState(false);

  const getSelectedDayEvents = date => {
    setformatedDate(moment(date).format('DD-MM-YYYY'));

    let markedDates = {};
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    let serviceDate = moment(date);

    serviceDate = serviceDate.format('DD.MM.YYYY');
    setSelectedDate(serviceDate);
    setMarkedDates(markedDates);
    setTextdate(moment(date).format('ddd, MMMM YY'));
  };

  const update = async () => {
    setModalVisible(true);
  };
  const remove = async () => {
    setModalVisible1(true);
  };

  const plan = (item, index) => {
    refRBSheet.current.open();
    setclickedId(item?.task_id);
    setSelectedTaskStatus(item?.status);
    setSelectedText(item?.task_name);
    // if (check == true) {
    //   if (index == 0) {
    //     console.log('0');
    //     setclickedId(0);
    //     setcheck(false);
    //   }
    //   if (index == 1) {
    //     console.log('1');
    //     setclickedId(1);
    //     setcheck(false);
    //   }
    //   if (index == 2) {
    //     console.log('2');
    //     setclickedId(2);
    //     setcheck(false);
    //   }
    //   if (index == 3) {
    //     console.log('3');
    //     setclickedId(3);
    //     setcheck(false);
    //   }
    // }
  };
  const [TEMP_DATA, setTEMP_DATA] = useState([]);

  useEffect(() => {
    setLoading(true);
    handleGetAllTasks();
  }, []);

  const handleGetAllTasks = async () => {
    let user_id = await AsyncStorage.getItem('user_id');

    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_all_task_by_UID, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        let list = [];
        for (const element of response) {
          if (element?.tasks != null) {
            let obj = {
              title: element?.created_at,
              data: element?.tasks,
            };
            list.push(obj);
          }
        }

        list?.reverse();
        setTEMP_DATA(list);
        setTodoListCopy(list);
      })
      .catch(error => {
        console.log('error in getting to-do list :', error);
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

  //add to-do
  const handleAddTODO = async () => {
    let user_id = await AsyncStorage.getItem('user_id');

    if (todoText.length == 0) {
      Snackbar.show({
        text: 'Please Enter Name.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);
      refRBSheet_Add_TODO.current.close();
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      await fetch(api.create_tasks, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          user_id: user_id,
          task_name: todoText,
          // date: new Date(),
          date: moment(new Date()).format('DD-MM-YYYY'),
        }),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false) {
            setTodoText(''); // clear todo state
            setTaskAdddedModalVisible(!taskAdddedModalVisible);
            handleGetAllTasks();
          } else {
            Snackbar.show({
              text: response[0]?.message
                ? response[0]?.message
                : 'Something went wrong',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
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
    }
  };

  //remove to_do
  const handleRemoveTask = async () => {
    setModalVisible1(false);
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.delete_tasks, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        task_id: clickedId,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          const newData = TEMP_DATA?.map(element => {
            let filter = element?.data.filter(
              item => item?.task_id != clickedId,
            );
            return {
              ...element,
              data: filter,
            };
          });

          setTEMP_DATA(newData);
          setTodoListCopy(newData);

          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });
        } else {
          Snackbar.show({
            text: response[0]?.message
              ? response[0]?.message
              : 'Something went wrong.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
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

  //update to-do
  const handleUpdateTask = async () => {
    if (selectedText?.length == 0) {
      Snackbar.show({
        text: 'Please Enter TODO Text.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);
      refRBSheet.current?.close();
      refRBSheet1.current?.close();
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      await fetch(api.update_tasks, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          task_id: clickedId,
          task_name: selectedText,
        }),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false) {
            setTodoText(''); // clear todo state
            Snackbar.show({
              text: 'Task Updated successfully.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
            updateTaskList();
          } else {
            Snackbar.show({
              text: response[0]?.message
                ? response[0]?.message
                : 'Something went wrong',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
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
    }
  };

  //update nested list of todo
  const updateTaskList = () => {
    const newData = TEMP_DATA?.map(element => {
      let selected_task = element?.data.findIndex(
        item => item?.task_id == clickedId,
      );
      let updatedTask = element?.data;
      if (selected_task != -1) {
        updatedTask = element?.data?.map(item => {
          if (item?.task_id == clickedId) {
            return {
              ...item,
              task_name: selectedText,
            };
          } else {
            return {
              ...item,
            };
          }
        });
      }
      return {
        ...element,
        data: updatedTask,
      };
    });
    setTEMP_DATA(newData);
    setTodoListCopy(newData);
  };

  //mark task as done
  const handleMarkAsDone = async selectedTaskStatus => {
    setLoading(true);
    refRBSheet.current?.close();
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.update_task_status, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        task_id: clickedId,
        // current_status: 'done',
        current_status: selectedTaskStatus,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          setTodoText(''); // clear todo state
          Snackbar.show({
            text: 'Task Updated successfully.',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });
          //________________________ UPdate list ______________

          const newData = TEMP_DATA?.map(element => {
            let selected_task = element?.data.findIndex(
              item => item?.task_id == clickedId,
            );
            let updatedTask = element?.data;
            if (selected_task != -1) {
              updatedTask = element?.data?.map(item => {
                if (item?.task_id == clickedId) {
                  return {
                    ...item,
                    // status: 'done',
                    status: selectedTaskStatus,
                  };
                } else {
                  return {
                    ...item,
                  };
                }
              });
            }
            return {
              ...element,
              data: updatedTask,
            };
          });
          setTEMP_DATA(newData);
          setTodoListCopy(newData);
          //________________________ UPdate list ______________
        } else {
          Snackbar.show({
            text: response[0]?.message
              ? response[0]?.message
              : 'Something went wrong',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
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

  const handlePullRefresh = () => {
    setRefreshing(true);
    handleGetAllTasks();
  };

  const handleApplyFilter = () => {
    setFilterModalVisible(false);
    setIsFilter(true);
    const filter = todoListCopy?.filter(item => item.title == formatedDate);
    setTEMP_DATA(filter);
  };
  const handleClearFilter = () => {
    setIsFilter(false);
    setFilterModalVisible(false);
    setTEMP_DATA(todoListCopy);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        {/* <TouchableOpacity
          style={{
            position: 'absolute',
            right: responsiveWidth(6),
            // bottom: responsiveHeight(14),
            top: responsiveHeight(85),
            zIndex: 1,
          }}
          onPress={() => refRBSheet_Add_TODO?.current?.open()}>
          <Image
            source={appImages.addemoji}
            style={{
              width: responsiveWidth(22),
              height: responsiveWidth(22),
              // tintColor: isdarkmode ? soliddark : solid,
            }}
          />
        </TouchableOpacity> */}
        <ScrollView
          style={{flex: 1}}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                handlePullRefresh();
              }}
              colors={[isdarkmode ? soliddark : solid]}
            />
          }>
          <View>
            <MainHeader {...props} headertxt={'To_Do list'} />
            <TouchableOpacity
              onPress={() => {
                setFilterModalVisible(!filterModalVisible);
              }}
              style={{position: 'absolute', right: 15, top: '30%'}}>
              {isFilter ? (
                <Icon
                  name="filter"
                  color={isdarkmode ? soliddark : solid}
                  size={35}
                />
              ) : (
                <MaterialCommunityIcons
                  name="filter-outline"
                  color={isdarkmode ? soliddark : solid}
                  size={35}
                />
              )}
            </TouchableOpacity>
          </View>
          {loading && <Loader />}
          <View
            style={{
              alignSelf: 'center',
              position: 'relative',
              top: 0,
              marginBottom: 5,
            }}>
            <BannerAd
              unitId={TestIds.BANNER}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
          <SectionList
            // style={{height: responsiveHeight(90)}}
            scrollEnabled
            sections={TEMP_DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({item, index}) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      ...styles.optionsView,
                    }}>
                    {item?.status === 'done' ? (
                      <Text
                        style={{
                          backgroundColor: isdarkmode ? soliddark : solid,
                          color: 'white',
                          // width: 40,
                          textAlign: 'center',
                          position: 'absolute',
                          top: 0,
                          paddingVertical: 2,
                          paddingHorizontal: 6,
                          borderTopLeftRadius: 10,
                          borderBottomEndRadius: 10,
                        }}>
                        Done
                      </Text>
                    ) : (
                      <Text style={styles.icon}></Text>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedText(item?.task_name);
                        refRBSheetTaskDetail?.current?.open();
                      }}
                      style={{
                        flex: 1,
                        padding: responsiveWidth(4),
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          zIndex: 1,
                        }}
                        numberOfLines={2}>
                        {item.task_name}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{marginRight: responsiveWidth(1)}}
                      // onPress={() => plan(item, index)}
                      onPress={() => plan(item, index)}>
                      <MaterialIcons
                        name="more-vert"
                        size={24}
                        color={isdarkmode ? soliddark : solid}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            renderSectionHeader={({section: {title}}) => (
              <LinearGradient
                colors={isdarkmode ? doubledark : double}
                style={{padding: 10, marginBottom: responsiveHeight(2)}}>
                <Text
                  style={{
                    fontFamily: fontFamily.Sans_Regular,
                    color: '#FFF',
                    fontSize: responsiveFontSize(2.2),
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  {title}
                </Text>
              </LinearGradient>
            )}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    height: responsiveHeight(80),
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

          {/*_____________________________________  bottom sheet to show detail of task________________________________ */}
          <RBSheet
            ref={refRBSheetTaskDetail}
            closeOnDragDown={true}
            closeOnPressMask={true}
            // animationType="fade"
            customStyles={{
              wrapper: {
                // backgroundColor: 'transparent',
                backgroundColor: 'rgba(0,0,0,0.4)',
              },
              draggableIcon: {
                backgroundColor: 'black',
              },
              container: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: '40%',
                backgroundColor: isdarkmode ? soliddark : '#fff',
              },
            }}>
            <ScrollView style={{flex: 1, paddingVertical: 20}}>
              <TouchableOpacity activeOpacity={1}>
                <View
                  style={{
                    // backgroundColor:isdarkmode? '#fff',
                    width: responsiveWidth(100),
                    // height: responsiveHeight(100),
                    borderRadius: responsiveWidth(1),
                    paddingHorizontal: responsiveWidth(4),
                  }}>
                  <Text
                    style={[
                      styles.txtstyle,
                      {
                        color: isdarkmode ? '#fff' : 'black',
                        lineHeight: 20,
                      },
                    ]}>
                    {selectedText}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </RBSheet>

          {/* __________________________________Bottom to Add TO-DO List_________________________________________________ */}
          <RBSheet
            ref={refRBSheet_Add_TODO}
            closeOnDragDown={false}
            closeOnPressMask={true}
            // animationType="fade"
            customStyles={{
              wrapper: {
                backgroundColor: 'rgba(0,0,0,0.4)',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
              container: {
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                height: responsiveHeight(35),
              },
            }}>
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              style={{
                paddingHorizontal: responsiveWidth(5),
                height: responsiveHeight(30),
                paddingTop: 25,
              }}>
              <View style={{position: 'absolute', right: 10}}>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet_Add_TODO?.current?.close();
                  }}
                  style={{alignSelf: 'flex-end'}}>
                  <Image
                    source={appImages.closeemoji}
                    style={{
                      height: 15,
                      width: 15,

                      tintColor: '#000',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveFontSize(2.2),
                    // margin: 5,
                    fontWeight: 'bold',
                  }}>
                  Add Task
                </Text>
              </View>
              <ScrollView
                style={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <TouchableOpacity activeOpacity={1}>
                  {/* <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
                    Name
                  </Text> */}
                  <View
                    style={{
                      height: responsiveHeight(19),
                    }}>
                    <TextInput
                      style={{
                        borderBottomColor: '#838383',
                        borderBottomWidth: 1,
                        padding: 5,
                        maxHeight: responsiveHeight(15),
                        color: '#000',
                      }}
                      multiline
                      value={todoText}
                      onChangeText={txt => setTodoText(txt)}
                    />
                  </View>
                  <View
                    style={{
                      // height: responsiveHeight(15),
                      justifyContent: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#CA6FE4',
                        height: responsiveHeight(6),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: responsiveHeight(1.5),
                      }}
                      onPress={() => handleAddTODO()}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 15,
                          margin: 5,
                          textAlign: 'center',
                        }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </ScrollView>
          </RBSheet>

          {/* -----------------update task---------------------- */}
          <RBSheet
            ref={refRBSheet1}
            closeOnDragDown={false}
            closeOnPressMask={true}
            // animationType="fade"
            customStyles={{
              wrapper: {
                // backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
              container: {
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                // height: '40%',
              },
            }}>
            <ScrollView
              keyboardShouldPersistTaps={'handled'}
              style={{
                paddingHorizontal: responsiveWidth(5),
                height: responsiveHeight(30),
                paddingTop: 25,
              }}>
              <View style={{position: 'absolute', right: 15}}>
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

                      // marginBottom: 20,
                      tintColor: '#000',
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: responsiveFontSize(2.2),
                    // margin: 5,
                    fontWeight: 'bold',
                  }}>
                  Update Task
                </Text>
              </View>
              <ScrollView
                style={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <TouchableOpacity activeOpacity={1}>
                  <ScrollView keyboardShouldPersistTaps={'handled'}>
                    {/* <Text style={{color: 'black', fontSize: 15, marginTop: 10}}>
                    Name
                  </Text> */}
                    <View
                      style={{
                        height: responsiveHeight(19),
                      }}>
                      <TextInput
                        style={{
                          borderBottomColor: '#838383',
                          borderBottomWidth: 1,
                          padding: 5,
                          maxHeight: responsiveHeight(15),
                          color: '#000',
                        }}
                        multiline
                        value={selectedText}
                        onChangeText={txt => setSelectedText(txt)}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: 'flex-end',
                      }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#CA6FE4',
                          height: responsiveHeight(6),
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: responsiveHeight(1.5),
                        }}
                        onPress={() => handleUpdateTask()}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 15,
                            margin: 5,
                            textAlign: 'center',
                          }}>
                          Update
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </TouchableOpacity>
              </ScrollView>
            </ScrollView>
          </RBSheet>
          {/* ---------------------------remove------------------------ */}
          <RBSheet
            ref={refRBSheet2}
            closeOnDragDown={true}
            closeOnPressMask={false}
            // animationType="fade"
            customStyles={{
              wrapper: {
                backgroundColor: 'transparent',
              },
              draggableIcon: {
                backgroundColor: '#000',
              },
              container: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: '40%',
              },
            }}>
            <View style={{paddingLeft: 10}}>
              <View style={{flexDirection: 'row', marginBottom: 10}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    margin: 5,
                    fontWeight: 'bold',
                  }}>
                  Remove Task
                </Text>
              </View>
              <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                Name
              </Text>
              <TextInput
                placeholder="Enter Name"
                onChangeText={email => setemail(email)}
                style={{
                  backgroundColor: '#E1E1E14F',
                  width: 200,
                  height: 40,
                  borderRadius: 20,
                  margin: 5,
                }}
              />
              <TouchableOpacity
                onPress={() => remove()}
                style={{
                  margin: 20,
                  marginLeft: 90,
                  backgroundColor: '#CA6FE4',
                  width: '40%',
                  borderRadius: 20,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 15,
                    margin: 5,
                    textAlign: 'center',
                  }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>

          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                // backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                  refRBSheet?.current?.close();
                }}
                style={{alignSelf: 'flex-end'}}>
                <Image
                  source={appImages.closeemoji}
                  style={{
                    height: 15,
                    width: 15,
                    marginRight: 8,
                    // marginBottom: 20,
                    tintColor: '#000',
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  // setcheck(true);
                  refRBSheet?.current?.close();
                  handleMarkAsDone(
                    selectedTaskStatus == 'done' ? 'active' : 'done',
                  );
                }}>
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  {selectedTaskStatus == 'done'
                    ? ' Mark Task as Un-Done'
                    : ' Mark Task as Done'}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  margin: 5,
                }}></View>
              <TouchableOpacity
                onPress={() => {
                  // refRBSheet2.current.open();
                  refRBSheet?.current?.close();
                  setModalVisible1(true);
                }}>
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Remove Task
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'lightgray',
                  margin: 5,
                }}></View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet?.current?.close();
                  refRBSheet1.current.open();
                }}>
                <Text style={{color: 'black', fontSize: 15, margin: 5}}>
                  Update Task
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>

          {/* __________________________________Bottom to Add TO-DO List_________________________________________________ */}

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  {/* <Lottie source={require('../../../assets/JsonImages/super_gift.json')} style={styles.modelimg}  /> */}
                  {/* <Image source={appImages.login} style={styles.modelimg} /> */}
                  <Text style={[styles.textStyle, {color: '#CA6FE4'}]}>
                    Task updated successfully
                  </Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={[styles.textStyle, {color: 'white'}]}>OK</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible1}
              onRequestClose={() => {
                setModalVisible1(!modalVisible1);
              }}>
              <View
                style={{
                  ...styles.centeredView,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View style={styles.modalView}>
                  {/* <Lottie source={require('../../../assets/JsonImages/super_gift.json')} style={styles.modelimg}  /> */}
                  {/* <Image source={appImages.login} style={styles.modelimg} /> */}

                  <Image
                    source={appImages.alert}
                    style={{
                      height: responsiveWidth(15),
                      width: responsiveWidth(15),
                      marginTop: responsiveWidth(3),
                      resizeMode: 'contain',
                      tintColor: isdarkmode ? soliddark : solid,
                    }}
                  />

                  <Text
                    style={[
                      styles.textStyle,
                      {
                        color: isdarkmode ? soliddark : solid,
                        marginVertical: responsiveWidth(4),
                      },
                    ]}>
                    Do You want to Remove this Task?
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {top: 0, backgroundColor: '#ccc'},
                      ]}
                      onPress={() => setModalVisible1(!modalVisible1)}>
                      <Text style={[styles.textStyle, {color: 'white'}]}>
                        No
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonClose,
                        {
                          top: 0,
                          backgroundColor: isdarkmode ? soliddark : solid,
                        },
                      ]}
                      onPress={() => {
                        setModalVisible1(!modalVisible1);
                        handleRemoveTask();
                      }}>
                      <Text style={[styles.textStyle, {color: 'white'}]}>
                        Yes
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          {/* ____________________________ task added modal ____________________________________________________ */}
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={taskAdddedModalVisible}
              onRequestClose={() => {
                setTaskAdddedModalVisible(!taskAdddedModalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={{...styles.modalView, height: 150}}>
                  <Text style={[styles.textStyle, {color: '#CA6FE4'}]}>
                    Task Added Successfully
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={[styles.button, {...styles.buttonClose, top: 30}]}
                      onPress={() =>
                        setTaskAdddedModalVisible(!taskAdddedModalVisible)
                      }>
                      <Text style={[styles.textStyle, {color: 'white'}]}>
                        OK
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
          {/* ____________________________ task added modal ____________________________________________________ */}

          {/* __________________________date filter modal _________________________________________ */}

          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              // onDismiss={() => setFilterModalVisible(false)}
              visible={filterModalVisible}
              onRequestClose={() => {
                setFilterModalVisible(!filterModalVisible);
              }}>
              <View
                style={{
                  ...styles.centeredView,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View
                  style={{
                    margin: 20,
                    // height: 400,
                    width: responsiveWidth(88),
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 10,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <View
                    style={{
                      // height: 200,
                      width: '100%',
                      marginBottom: 10,
                    }}>
                    <Calendar
                      style={{
                        width: responsiveWidth(88),
                        alignSelf: 'center',
                      }}
                      enableSwipeMonths
                      //   initialDate="2022-04-01"
                      onMonthChange={item => {
                        console.log('THE MONTHS', item);
                      }}
                      onVisibleMonthsChange={item => {
                        console.log('THE MONTHS VISIBLE', item);
                      }}
                      theme={{
                        backgroundColor: '#ffffff',
                        calendarBackground: '#ffffff',
                        textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: isdarkmode
                          ? soliddark
                          : solid,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#2d4150',
                        textDisabledColor: '#d9e1e8',
                        dotColor: isdarkmode ? soliddark : solid,
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: 'blue',
                        indicatorColor: 'blue',
                        textDayFontFamily: 'monospace',
                        textMonthFontFamily: 'monospace',
                        textDayHeaderFontFamily: 'monospace',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                      }}
                      markedDates={markedDates}
                      onDayPress={day => {
                        getSelectedDayEvents(day.dateString);
                        setdateapi(day.dateString);
                      }}
                      hideExtraDays={true}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable
                      style={[styles.button, {...styles.buttonClose, top: 0}]}
                      onPress={() => {
                        handleClearFilter();
                      }}>
                      <Text style={[styles.textStyle, {color: 'white'}]}>
                        Clear
                      </Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, {...styles.buttonClose, top: 0}]}
                      onPress={() => {
                        handleApplyFilter();
                      }}>
                      <Text style={[styles.textStyle, {color: 'white'}]}>
                        Apply
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
        <AddButton onPress={() => refRBSheet_Add_TODO?.current?.open()} />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default To_do_list;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    // zIndex: 1,
  },
  optionsView: {
    flexDirection: 'row',
    width: 300,
    height: 70,
    // marginTop: 15,
    marginBottom: 15,
    marginLeft: 30,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: 250,
    // height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: responsiveWidth(4),
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
  },
  buttonClose: {
    top: 50,
    width: 100,
    margin: 10,
    backgroundColor: '#CA6FE4',
  },
  textStyle: {
    fontSize: 15,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modelimg: {
    width: 100,
    height: 100,
  },
  navigate_next: {
    right: 150,
    top: 10,
  },

  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});
