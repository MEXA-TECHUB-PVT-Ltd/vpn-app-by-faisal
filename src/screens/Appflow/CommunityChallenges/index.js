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
  Keyboard,
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
import {appImages} from '../../../assets/utilities';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import Loader from '../../../components/Loader/Loader';

import debounce from 'lodash/debounce';

const CommunityChallenges = props => {
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
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [showTrendingSearches, setShowTrendingSearches] = useState(false);
  const [trendingSearchList, setTrendingSearchList] = useState([]);

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    getCommunityChallenges();
    setSearchQuery('');
  }, [isFocused]);

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

  const getCommunityChallenges = async () => {
    let user_id = await AsyncStorage.getItem('user_id');
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      // addedby_id: 'admin',
      community_challenge_status: 'true',
      logged_in_user_id: user_id,
    };

    await fetch(api.get_all_by_community_status, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          let responseData = response[0].all_record
            ? response[0].all_record
            : [];
          let list = [];
          for (const element of responseData) {
            let isChallengeStart = await isChallengeStartedByThisUser(
              element?.challenge_detail?.uniq_id,
            );
            let obj = {
              ...element,
              isStarted: isChallengeStart,
            };
            list.push(obj);
          }
          setData(list);
          setFilteredlist(list);
        } else {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
          setData([]);
          setFilteredlist([]);
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

  const like = async _id => {
    // var InsertAPIURL =
    //   global.url + 'challenge/likeCommunityChallenge/?challengeId=' + _id;
    // var headers = {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    // };
    // await fetch(InsertAPIURL, {
    //   method: 'PUT',
    //   headers: headers,
    // })
    //   .then(response => response.json())
    //   .then(response => {
    //     alert('Challenge Liked!');
    //   })
    //   .catch(error => {
    //     alert('this is error' + error);
    //   });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredlist, setFilteredlist] = useState([]);
  const onChangeValue = async (itemSelected, index, _id) => {
    // console.log(
    //   'itemSelected.challenge_detail?.uniq_id  :  ',
    //   itemSelected.challenge_detail?.uniq_id,
    // );
    const newData = filteredlist.map(item => {
      // if (item.challenge_uniq_id == itemSelected.challenge_uniq_id) {
      if (
        item?.challenge_detail?.uniq_id ==
        itemSelected.challenge_detail?.uniq_id
      ) {
        return {
          ...item,
          liked: !item.liked,
          likes_count: item.liked
            ? item?.likes_count - 1
            : item?.likes_count + 1,
        };
      }
      return {
        ...item,
        liked: item.liked,
      };
    });
    // setData(newData);
    setFilteredlist(newData);
    like(_id);
  };

  //this function will decide which method call like/dislike based on like status
  const handleHeartPress = item => {
    console.log('item  : ', item);
    if (item?.liked) {
      //handle dislike
      handleDisLike(item);
    } else {
      //handle like
      handleLike(item);
    }
  };

  const handleLike = async itemSelected => {
    console.log('itemSelected : ', itemSelected);
    // onChangeValue(itemSelected);

    // return;
    let user_id = await AsyncStorage.getItem('user_id');
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      user_id: user_id,
      challenge_uniq_id: itemSelected?.challenge_uniq_id,
    };
    await fetch(api.like_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          //also update local list
          console.log('updating like status :: ', itemSelected);
          onChangeValue(itemSelected);
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
        setLoading(false);
      });
  };

  const handleDisLike = async itemSelected => {
    console.log('itemSelected :  ', itemSelected);
    let user_id = await AsyncStorage.getItem('user_id');
    let data = {
      user_id: user_id,
      challenge_uniq_id: itemSelected?.challenge_uniq_id,
    };
    console.log('data to dislike challenge :   ', data);
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(api.dislike_challenge, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        console.log('dislike challenge api response   :   ', response);
        if (response[0]?.error == false) {
          //also update local list
          onChangeValue(itemSelected);
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
        setLoading(false);
      });
  };

  // Create a debounced function with a delay of 300 milliseconds
  // const debouncedSearch = debounce(getSearchSuggestion, 300);

  const search = searchText => {
    if (searchText) {
      // setShowTrendingSearches(true);
      getSearchSuggestion(searchText);
      // debouncedSearch(searchText);
    } else {
      setShowTrendingSearches(false);
      setFilteredlist(data);
      setSearchQuery(searchText);
    }

    // setSearchQuery(searchText);

    // let filteredData = data.filter(function (item) {
    //   var searchIdNameLowerCase = searchText.toLowerCase();
    //   var itemNameLowerCase = item?.challenge_detail?.name?.toLowerCase();
    //   var a = itemNameLowerCase.includes(searchIdNameLowerCase);
    //   return a;
    // });
    // setFilteredlist(filteredData);
  };

  const getSearchSuggestion = async searchText => {
    console.log('searchText?.length :  ', searchText?.length);
    if (searchText?.length == 0) {
      setShowTrendingSearches(false);
      return;
    }
    setSearchQuery(searchText);
    console.log('get search suggestion called ... : : : ', searchText);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      search_suggestion: searchText,
    };
    await fetch(api.get_search_suggestions_community, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        let list = response[0]?.all_record ? response[0]?.all_record : [];

        if (list?.length == 0) {
          searchChallenge(searchText);
          setShowTrendingSearches(false);
        } else {
          setShowTrendingSearches(true);
          setTrendingSearchList(list);
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

  const searchChallenge = async searchText => {
    setSearchQuery(searchText);
    setLoading(true);
    setShowTrendingSearches(false);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    let data = {
      search: searchText,
    };
    await fetch(api.search_with_in_community, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(async response => {
        let list = response[0]?.all_record ? response[0]?.all_record : [];
        let list1 = [];
        for (const element of list) {
          let isChallengeStart = await isChallengeStartedByThisUser(
            element?.challenge_detail?.uniq_id,
          );
          let obj = {
            ...element,
            isStarted: isChallengeStart,
          };
          list1.push(obj);
        }
        setFilteredlist(list1);
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

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          props.navigation.navigate('CommunityChallengeView', {
            item,
            uniq_id: item?.challenge_uniq_id,
            liked: item?.liked,
            likes_count: item?.likes_count,
            isStarted: item?.isStarted,
          });
        }}
        style={{
          width: responsiveWidth(87),
          alignSelf: 'center',
          borderRadius: responsiveWidth(6),
          marginBottom: responsiveHeight(4),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,
          elevation: 11,
        }}>
        <LinearGradient
          colors={isdarkmode ? doubledark : double}
          start={{x: -0.2, y: 1}}
          end={{x: 1, y: 1}}
          style={[
            styles.linearGradient,
            {
              borderTopLeftRadius: responsiveWidth(6),
              borderTopRightRadius: responsiveWidth(6),
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: responsiveHeight(3.3),
              paddingHorizontal: responsiveWidth(5),
            }}>
            {item?.challenge_detail?.image && (
              <Image
                // source={{uri: global.url + item.image}}
                source={{
                  uri: BASE_URL_IMAGE + '/' + item?.challenge_detail?.image,
                }}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveWidth(25),
                  resizeMode: 'contain',
                }}
              />
            )}

            {item?.isStarted && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  handleHeartPress(item);
                }}>
                <Image
                  source={
                    item.liked ? appImages.heartred : appImages.heartempty
                  }
                  style={{
                    width: responsiveWidth(6),
                    height: responsiveWidth(6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: responsiveWidth(5),
            backgroundColor: '#fff',
            borderBottomLeftRadius: responsiveWidth(6),
            borderBottomRightRadius: responsiveWidth(6),
            paddingVertical: responsiveHeight(2.3),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={[styles.txt1, {color: isdarkmode ? soliddark : solid}]}>
              {item?.challenge_detail?.name}
            </Text>
            <Text
              style={[styles.txt2, {color: isdarkmode ? soliddark : solid}]}>
              {item?.user_data
                ? item?.user_data?.name
                : item?.challenge_detail?.addedby}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Image
              source={appImages.heartred}
              style={{
                width: responsiveWidth(6),
                height: responsiveWidth(6),
                resizeMode: 'contain',
              }}
            />
            <Text
              style={[
                styles.txt1,
                {color: '#444444', marginLeft: responsiveWidth(2.5)},
              ]}>
              {item?.likes_count}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handlePullRefresh = () => {
    setRefreshing(true);
    getCommunityChallenges();
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Community Challenges'} />

        {loading && <Loader color={'red'} />}
        <View
          style={{
            width: responsiveWidth(100),
            backgroundColor: '#fff',
            paddingTop: responsiveHeight(7),
            borderBottomLeftRadius: responsiveWidth(20),
            borderBottomRightRadius: responsiveWidth(20),
            paddingBottom: responsiveHeight(12),
            // zIndex: 999,
          }}>
          <View
            style={{
              backgroundColor: '#F5F5F5',
              width: responsiveWidth(80),
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: responsiveWidth(5),
              alignSelf: 'center',
              paddingHorizontal: responsiveWidth(4),
            }}>
            <TextInput
              style={{
                backgroundColor: '#F5F5F5',
                width: responsiveWidth(65),
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2.1),
                borderRadius: responsiveWidth(5),
                paddingRight: responsiveWidth(2),
                color: '#000',
              }}
              onChangeText={text => {
                search(text);
              }}
              value={searchQuery}
              placeholder="Search"
              placeholderTextColor={'rgba(0,0,0,0.4)'}
            />
            <TouchableOpacity
              onPress={() =>
                searchQuery?.length > 0 && searchChallenge(searchQuery)
              }
              style={{
                padding: 10,
              }}>
              <Image
                source={appImages.searchicon}
                style={{
                  width: responsiveWidth(5),
                  height: responsiveWidth(5),
                  tintColor: 'rgba(0,0,0,0.4)',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showTrendingSearches && searchQuery?.length > 0 && (
          <View
            style={{
              backgroundColor: '#fff',
              width: responsiveWidth(80),
              alignSelf: 'center',
              maxHeight: responsiveHeight(40),
              position: 'absolute',
              zIndex: 999,
              top: 180,
              padding: 20,
            }}>
            <Text
              style={{
                color: '#000',
                fontSize: 16,
                fontFamily: fontFamily.Sans_Regular,
              }}>
              Trending Searches
            </Text>
            <FlatList
              data={trendingSearchList}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              removeClippedSubviews={true} // Unmount components when outside of window
              updateCellsBatchingPeriod={100} // Increase time between renders
              windowSize={7} // Reduce the window size
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      searchChallenge(item?.challenge_detail?.name)
                    }
                    style={{
                      paddingHorizontal: 10,
                      paddingTop: 15,
                      paddingBottom: 5,
                    }}>
                    <Text style={{color: '#222'}}>
                      {item?.challenge_detail?.name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 1,
                    backgroundColor: '#ddd',
                    width: '90%',
                    alignSelf: 'center',
                  }}></View>
              )}
            />
          </View>
        )}

        <View
          style={{
            marginTop: responsiveHeight(-6),
            flex: 1,
          }}>
          <FlatList
            keyboardShouldPersistTaps="handled"
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
            // data={searchQuery == '' ? data : filteredlist}
            data={filteredlist}
            renderItem={renderItem}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CommunityChallenges;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  txt1: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.3),
  },
  txt2: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.1),
  },
});
