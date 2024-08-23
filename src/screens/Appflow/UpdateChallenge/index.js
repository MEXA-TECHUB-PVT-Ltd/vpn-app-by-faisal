import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {TextInput, Button, Modal} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import ImagePicker from 'react-native-image-crop-picker';
import {fontFamily} from '../../../constants/fonts';
import img from '../../../assets/images/emoji/angle.png';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import {useSelector, useDispatch} from 'react-redux';
import {color} from 'react-native-reanimated';

import Snackbar from 'react-native-snackbar';
import {api} from '../../../constants/api';
import Loader from '../../../components/Loader/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import EmojiBoard from 'react-native-emoji-board';

// import EmojiPicker from 'rn-emoji-keyboard';
// import EmojiModal from 'react-native-emoji-modal';
import EmojiPicker from 'react-native-emoji-picker-staltz';

import Entypo from 'react-native-vector-icons/Entypo';

import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {fn} from 'moment/moment';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';

function UpdateChallenge(props) {
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
  const [challengeName, setchallengeName] = useState('');
  const [challengeDescription, setchallengeDescription] = useState('');
  // day description
  const [currentDay, setcurrentDay] = useState(1);
  const [currentDescription, setcurrentDescription] = useState('');

  const [dayDescription, setdayDescription] = useState([]);

  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState(false);

  const [imagecheckforgalary, setimagecheckforgalary] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [imageType, setImageType] = useState('');

  const [searchemoji, setSearchemoji] = useState(false);
  const [isskip, setIsskip] = useState(false);

  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1);

  const [isImageChanged, setIsImageChanged] = useState(false);

  // reference url : https://emojipedia.org/whatsapp/
  const [emojiList1, setEmojiList1] = useState([
    {
      id: 0,
      name: 'Grinning Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face_1f600.png',
    },
    {
      id: 1,
      name: 'Grinning Face with Smiling Eyes',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-smiling-eyes_1f604.png',
    },
    {
      id: 2,
      name: 'Grinning Face with Sweat',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-sweat_1f605.png',
    },
    {
      id: 3,
      name: 'Rolling on the Floor Laughing',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/rolling-on-the-floor-laughing_1f923.png',
    },
    {
      id: 4,
      name: ' Face with Tears of Joy',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/face-with-tears-of-joy_1f602.png',
    },
  ]);
  const [emojiList, setEmojiList] = useState([
    // {
    //   id: 0,
    //   name: 'angle',
    //   path: require('../../../assets/images/emoji/angle.png'),
    // },
    // {
    //   id: 1,
    //   name: 'confused',
    //   path: require('../../../assets/images/emoji/confused.png'),
    // },
    // {
    //   id: 2,
    //   name: 'happy',
    //   path: require('../../../assets/images/emoji/happy.png'),
    // },
    // {
    //   id: 3,
    //   name: 'happyhand',
    //   path: require('../../../assets/images/emoji/happyhand.png'),
    // },
    // {
    //   id: 4,
    //   name: 'laughing',
    //   path: require('../../../assets/images/emoji/laughing.png'),
    // },

    {
      id: 0,
      name: 'Grinning Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face_1f600.png',
    },
    {
      id: 1,
      name: 'Grinning Face with Smiling Eyes',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-smiling-eyes_1f604.png',
    },
    {
      id: 2,
      name: 'Grinning Face with Sweat',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-sweat_1f605.png',
    },
    {
      id: 3,
      name: 'Rolling on the Floor Laughing',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/rolling-on-the-floor-laughing_1f923.png',
    },
    {
      id: 4,
      name: ' Face with Tears of Joy',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/face-with-tears-of-joy_1f602.png',
    },
    {
      id: 5,
      name: 'Slightly Smiling Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/slightly-smiling-face_1f642.png',
    },
    {
      id: 6,
      name: 'Upside-Down Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/upside-down-face_1f643.png',
    },
    {
      id: 7,
      name: 'Melting Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/melting-face_1fae0.png',
    },
    {
      id: 8,
      name: 'Winking Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/winking-face_1f609.png',
    },
    {
      id: 9,
      name: 'Smiling Face with Smiling Eyes',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-smiling-eyes_1f60a.png',
    },
    {
      id: 10,
      name: 'Smiling Face with Halo',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-halo_1f607.png',
    },
    {
      id: 11,
      name: 'Smiling Face with Hearts',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-hearts_1f970.png',
    },

    {
      id: 12,
      name: 'Smiling Face with Heart-Eyes',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-heart-eyes_1f60d.png',
    },
    {
      id: 13,
      name: 'Star-Struck',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/star-struck_1f929.png',
    },
    {
      id: 14,
      name: 'Face Blowing a Kiss',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/face-blowing-a-kiss_1f618.png',
    },
    {
      id: 15,
      name: 'Kissing Face',
      path: 'https://em-content.zobj.net/thumbs/144/whatsapp/326/kissing-face_1f617.png',
    },
  ]);

  useEffect(() => {
    if (props?.route?.params) {
      getChallengeInfo(props?.route?.params?.challenge_Detail?.uniq_id);
    }
  }, [props?.route?.params]);
  const getChallengeInfo = async uniq_id => {
    try {
      setLoading(true);

      let challenge_Info = await getSpecificChallengeDetail(uniq_id);
      if (challenge_Info) {
        let imagePath =
          BASE_URL_IMAGE + '/' + challenge_Info[0]?.challenge_detail.image;
        var filename = imagePath.split('/').pop();

        setImage(imagePath);
        setImageName(filename);
        setImageType('image/png');

        setchallengeName(challenge_Info[0]?.challenge_detail?.name);
        setchallengeDescription(
          challenge_Info[0]?.challenge_detail?.description,
        );

        let list = challenge_Info[0]?.challenge_days
          ? challenge_Info[0]?.challenge_days
          : [];

        let daysList = [];
        for (const element of list) {
          let obj = {
            id: element?.id,
            dayno: element?.day_no,
            description: element?.description,
          };
          daysList.push(obj);
        }
        setcurrentDay(daysList?.length + 1);
        setdayDescription(daysList);
      }
      console.log('here....');
      setLoading(false);
    } catch (error) {
      console.log('Error occurred while getting challenge details : ', error);
      setLoading(false);
    }
  };

  const getSpecificChallengeDetail = async uniq_id => {
    return new Promise(async (resolve, reject) => {
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
            //also update local list
            let list = response[0]?.all_record ? response[0]?.all_record : [];
            if (list?.length > 0) {
              resolve(list);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          resolve(false);
        });
    });
  };

  const handleUpdateChallenge = async () => {
    setLoading(true);
    let challenge_id = props?.route?.params?.challenge_Detail?.uniq_id;

    const formData = new FormData();
    let imageObj = {
      uri: image,
      name: imageName,
      type: imageType,
    };
    console.log('image object  :  ', imageObj);
    formData.append('uniq_id', challenge_id);
    if (isImageChanged) {
      formData.append('image', imageObj);
    }
    formData.append('name', challengeName);
    formData.append('description', challengeDescription);

    var headers = {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    };
    await fetch(api.update_challenge, {
      method: 'POST',
      headers: headers,
      body: formData,
    })
      .then(response => response.json())
      .then(async response => {
        console.log('update challenge response  :::  ', response);

        if (response[0]?.error == true) {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        } else {
          handleUpdateDayDescription();
          Snackbar.show({
            text: 'Challenge Updated Successfully',
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'green',
          });

          props.navigation.goBack();
        }
      })
      .catch(error => {
        console.log('error  in update challenge ::::  ', error);
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

  const handleUpdateDayDescription = async () => {
    // console.log('day description  :  ', dayDescription);
    const updatedDaysList = dayDescription?.filter(
      item => item?.updated == true,
    );
    console.log('updatedDaysList  :  ', updatedDaysList);
    if (updatedDaysList?.length > 0) {
      //code to update challenge day description
      let challenge_id = props?.route?.params?.challenge_Detail?.uniq_id;
      for (const element of updatedDaysList) {
        console.log('element :   ', element);
        var headers = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
        await fetch(api.update_challenge_days_description, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            challenge_uniq_id: challenge_id,
            day_id: element?.id,
            description: element?.description,
          }),
        })
          .then(response => response.json())
          .then(async response => {
            console.log('update days response :::::  ', response);
          })
          .catch(error => {
            Snackbar.show({
              text: 'Something went wrong.',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
          });
      }
    }
  };

  const renderItemDays = ({item}) => {
    return (
      <View>
        <Text style={styles.txt2}>Day {item.id}</Text>
        <TextInput
          style={styles.txtinput2}
          placeholder={'Add day description'}
          onChangeText={dayDescription =>
            setdayDescription([
              ...dayDescription,
              {
                day: 'day1',
                desc: dayDescription,
                adderId: global._id,
              },
            ])
          }
        />
      </View>
    );
  };

  const takePhotoFromCamera = async () => {
    // console.warn('camera')
    const data = await ImagePicker.openCamera({
      width: 500,
      height: 500,
      // cropping: true,
    }).then(imageDetail => {
      if (imageDetail) {
        setImage(imageDetail.path);
        setImageType(imageDetail.mime);
        var filename = imageDetail.path.split('/').pop();
        setImageName(filename);
      }

      setimagecheckforgalary('click');
      //   updateProfileImage(imageDetail);
    });
  };
  const renderItemEmoji = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          //   marginRight: responsiveWidth(2.2),
          marginLeft: responsiveWidth(3.8),
        }}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setEmoji(item.path);
            console.log(item.path);
            setSearchemoji(false);
          }}>
          <Image
            source={item.path}
            // resizeMode="contain"
            style={styles.drawericonstyle}
          />
        </TouchableOpacity>
      </View>
    );
  };
  // const [emojilist, setEmojiList] = useState([
  //   {
  //     id: 1,
  //     name: '😀',
  //     path: img,
  //     // path:appImages.confused
  //   },
  //   {
  //     id: 2,
  //     name: '😁',
  //     path: appImages.confused,
  //   },
  //   {
  //     id: 3,
  //     name: '😂',
  //     path: appImages.happy,
  //   },
  //   {
  //     id: 4,
  //     name: '😃',
  //     path: appImages.happyhand,
  //   },
  //   {
  //     id: 5,
  //     name: '😄',
  //     path: appImages.laughing,
  //   },
  //   {
  //     id: 6,
  //     name: '😆',
  //     path: appImages.love,
  //   },
  //   {
  //     id: 7,
  //     name: '😇',
  //     path: appImages.rude,
  //   },
  //   {
  //     id: 8,
  //     name: '😈',
  //     path: appImages.sad,
  //   },
  //   {
  //     id: 9,
  //     name: '😉',
  //     path: appImages.sady,
  //   },
  //   {
  //     id: 10,
  //     name: '😊',
  //     path: appImages.shocked,
  //   },
  //   {
  //     id: 11,
  //     name: '😋',
  //     path: appImages.sleeping,
  //   },
  //   {
  //     id: 12,
  //     name: '😌',
  //     path: appImages.smile,
  //   },
  //   {
  //     id: 13,
  //     name: '😍',
  //     path: appImages.surprised,
  //   },
  //   {
  //     id: 14,
  //     name: '😎',
  //     path: appImages.thinking,
  //   },
  //   {
  //     id: 15,
  //     name: '😏',
  //     path: appImages.winking_face,
  //   },
  //   {
  //     id: 16,
  //     name: '😐',
  //   },
  //   {
  //     id: 17,
  //     name: '😑',
  //   },
  //   {
  //     id: 18,
  //     name: '😒',
  //   },
  //   {
  //     id: 19,
  //     name: '😓',
  //   },
  //   {
  //     id: 20,
  //     name: '😔',
  //   },
  //   {
  //     id: 21,
  //     name: '😕',
  //   },
  //   {
  //     id: 22,
  //     name: '😖',
  //   },
  //   {
  //     id: 23,
  //     name: '😗',
  //   },
  //   {
  //     id: 24,
  //     name: '😘',
  //   },
  //   {
  //     id: 25,
  //     name: '😙',
  //   },
  //   {
  //     id: 26,
  //     name: '😚',
  //   },
  //   {
  //     id: 27,
  //     name: '😛',
  //   },
  //   {
  //     id: 28,
  //     name: '😜',
  //   },
  //   {
  //     id: 29,
  //     name: '😝',
  //   },
  //   {
  //     id: 30,
  //     name: '😞',
  //   },
  //   {
  //     id: 31,
  //     name: '😟',
  //   },
  //   {
  //     id: 32,
  //     name: '😠',
  //   },
  //   {
  //     id: 33,
  //     name: '😡',
  //   },
  //   {
  //     id: 34,
  //     name: '😢',
  //   },
  //   {
  //     id: 35,
  //     name: '😣',
  //   },
  //   {
  //     id: 36,
  //     name: '😤',
  //   },
  //   {
  //     id: 37,
  //     name: '😥',
  //   },
  //   {
  //     id: 38,
  //     name: '😦',
  //   },
  //   {
  //     id: 39,
  //     name: '😧',
  //   },
  //   {
  //     id: 40,
  //     name: '😨',
  //   },
  // ]);

  const createChnlg = async () => {
    // readImage();
    // return;
    // let profile_Obj = {
    //   uri: image,
    //   // uri: '../../../assets/images/emoji/happy.png',
    //   name: imageName,
    //   type: imageType,
    // };

    // console.log('challenge image  :::: ', profile_Obj);
    // return;

    if (image?.length == 0) {
      Snackbar.show({
        text: 'Challenge Icon is required',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else if (challengeName.length == 0) {
      Snackbar.show({
        text: 'Please Enter Challenge Name',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else if (challengeDescription.length == 0) {
      Snackbar.show({
        text: 'Please Enter Challenge Description',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);
      let user_id = await AsyncStorage.getItem('user_id');
      var headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      };
      const formData = new FormData();
      let profile_Obj = {
        uri: image,
        name: imageName,
        type: imageType,
      };

      console.log('challenge image  :::: ', profile_Obj);

      formData.append('image', profile_Obj);
      formData.append('name', challengeName);
      formData.append('description', challengeDescription);
      formData.append('addedby', user_id);
      formData.append('community_challenge', 'false');

      await fetch(api.create_challenge, {
        method: 'POST',
        headers: headers,
        body: formData,
      })
        .then(response => response.json())
        .then(async response => {
          console.log('create challenge response  :::  ', response);

          if (response[0]?.error == true) {
            Snackbar.show({
              text: response[0]?.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'red',
            });
          } else {
            Snackbar.show({
              text: 'Challenge Created Successfully',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });

            console.log('_______________', response[0]);
            let uniq_id = response[0]?.hall_id;
            console.log('uniq_id passed ::::  ', uniq_id);
            if (dayDescription.length > 0) {
              handleAddChallengeDays(uniq_id);
            } else {
              props?.navigation?.goBack();
            }
          }
        })
        .catch(error => {
          console.log('error  in add challenge ::::  ', error);

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

  const handleAddChallengeDays = async uniq_id => {
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.create_challenge_days, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        uniq_id: uniq_id,
        data: dayDescription,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        console.log('create days response :::::  ', response);
        props?.navigation?.goBack();
        // Snackbar.show({
        //   text: response[0]?.message,
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'red',
        // });
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
  const handleEmojiSelect = v => {
    setSelectedEmoji(v);
  };
  const readImage = image => {
    try {
      let fileName = image?.split('/')?.pop();
      RNFS.downloadFile({
        fromUrl: image,
        toFile: `${RNFS.TemporaryDirectoryPath}/${fileName}`,
      })
        .promise.then(res => {
          // work with it
          console.log('binary: ', res);
          let path = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
          RNFS.readDir(RNFS.TemporaryDirectoryPath).then(res => {
            let file = res.filter(item => item?.name == fileName);
            console.log('file  :   ', file);
            if (file.length > 0) {
              setImage('file://' + file[0].path);
              setImageName(file[0].name);
              setImageType('image/png');
              setIsImageChanged(true);
              console.log('file ::::    ', file[0].path);
            }
          });
        })
        .catch(console.error);
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  const handleEditDescription = async (text, index) => {
    try {
      const newData = dayDescription?.map((element, i) => {
        if (i === index) {
          return {
            ...element,
            description: text,
            updated: true,
          };
        } else {
          return {
            ...element,
          };
        }
      });
      setdayDescription(newData);
    } catch (error) {
      console.log('error  :  ', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Update Challenge'} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollviewcontainer}>
          <View style={styles.innercontainer}>
            <Text style={styles.txt1}>Icons</Text>

            {loading && <Loader color={'red'} />}

            {isEmojiPickerVisible && (
              <View style={{marginTop: 10}}>
                {/* <EmojiPicker
                  onEmojiSelected={handleEmojiSelect}
                  rows={5}
                  emojiSize={20}
                  headerStyle={{
                    color: '#000',
                  }}
                  hideClearButton={true}
                  emojiStyle={{color: 'red'}}
                  backgroundStyle={{backgroundColor: 'red'}}
                  containerStyle={{backgroundColor: '#ccc'}}
                  localizedCategories={[
                    // Always in this order:
                    'Smileys and emotion',
                    'People and body',
                    'Animals and nature',
                    'Food and drink',
                    'Activities',
                    'Travel and places',
                    'Objects',
                    'Symbols',
                  ]}
                /> */}
                <View style={{backgroundColor: '#ccc', paddingVertical: 10}}>
                  <FlatList
                    key={'_'}
                    numColumns={5}
                    data={emojiList}
                    keyExtractor={(item, index) => '_' + index.toString()}
                    renderItem={(item, index) => {
                      return (
                        <View
                          style={{
                            marginLeft: responsiveWidth(2),
                            marginTop: responsiveHeight(0.2),
                            opacity:
                              item.item.id == selectedEmojiIndex ? 0.4 : 1,
                          }}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              setSelectedEmojiIndex(item.item.id);
                              setEmoji(item.item.path);
                              setSearchemoji(false);
                              //image
                              // setImage(item.item.path);
                              // setImageName(item.item.name);
                              // setImageType('image/png');
                              readImage(item.item.path);
                            }}>
                            <Image
                              // source={item.item.path}
                              source={{uri: item.item.path}}
                              style={{
                                ...styles.drawericonstyle,
                                width: 40,
                                height: 40,
                                marginHorizontal: 2,
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>

                <TouchableOpacity
                  style={{position: 'absolute', right: 0}}
                  onPress={() =>
                    setIsEmojiPickerVisible(!isEmojiPickerVisible)
                  }>
                  <Entypo
                    name="cross"
                    color={isdarkmode ? soliddark : solid}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            )}

            {!isEmojiPickerVisible && (
              <View style={{flexDirection: 'row'}}>
                <FlatList
                  data={emojiList1}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  renderItem={item => {
                    return (
                      <View
                        style={{
                          marginLeft: responsiveWidth(2),
                          marginTop: responsiveHeight(3),
                          opacity: item.item.id == selectedEmojiIndex ? 0.4 : 1,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => {
                            setSelectedEmojiIndex(item.item.id);
                            setEmoji(item.item.path);
                            console.log(item.item.path);
                            setSearchemoji(false);
                            //image
                            // setImage(item.item.path);
                            // setImageName(item.item.name);
                            // setImageType('image/png');
                            readImage(item.item.path);
                          }}>
                          <Image
                            // source={item.item.path}
                            source={{uri: item.item.path}}
                            style={{
                              ...styles.drawericonstyle,
                              width: 40,
                              height: 40,
                              marginHorizontal: 2,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
                <View style={{...styles.iconselector, marginHorizontal: 2}}>
                  {/* {image ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      // onPress={() => takePhotoFromCamera()}
                      onPress={() => setIsEmojiPickerVisible(true)}>
                      <FastImage
                        source={{uri: image}}
                        resizeMode={'contain'}
                        style={{
                          width: responsiveWidth(50),
                          height: responsiveHeight(15),
                        }}
                      />
                    </TouchableOpacity>
                  ) : ( */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() => takePhotoFromCamera()}
                    onPress={() => setIsEmojiPickerVisible(true)}>
                    <FastImage
                      source={appImages.addemoji}
                      resizeMode={'contain'}
                      style={styles.addiconstyle}
                    />
                  </TouchableOpacity>
                  {/* // )} */}
                </View>
              </View>
            )}

            <Text style={[styles.txt1, {marginVertical: responsiveHeight(2)}]}>
              Challenge Name
            </Text>
            <TextInput
              value={challengeName}
              style={[
                styles.txtinput1,
                {
                  backgroundColor: '#fff',
                },
              ]}
              onChangeText={name => setchallengeName(name)}
            />
            <View>
              <Text
                style={[styles.txt1, {marginVertical: responsiveHeight(2)}]}>
                Challenge Description
              </Text>

              <TextInput
                style={[
                  styles.txtinput1,
                  {
                    backgroundColor: '#fff',
                  },
                ]}
                placeholder={'Add challenge description'}
                multiline={true}
                numberOfLines={5}
                value={challengeDescription}
                onChangeText={description =>
                  setchallengeDescription(description)
                }
              />
            </View>

            <View
              style={{
                zIndex: 999,
              }}>
              <Text
                style={[styles.txt1, {marginVertical: responsiveHeight(2)}]}>
                Days Description
              </Text>
              <FlatList
                data={dayDescription}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flexDirection: 'row',
                      height: responsiveHeight(10),
                      width: responsiveWidth(90),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#ededed',
                      }}>
                      You have not Added any Day Yet{' '}
                    </Text>
                  </View>
                )}
                renderItem={({item, index}) => (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginVertical: responsiveHeight(1),
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: responsiveFontSize(2),
                          color: '#fff',
                        }}>
                        Day No :
                      </Text>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(2),
                          color: '#fff',
                        }}>
                        {item.dayno}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'space-between',
                        marginVertical: responsiveHeight(1),
                      }}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: responsiveFontSize(2),
                          color: '#fff',
                        }}>
                        Description :
                      </Text>
                      {/* <Text
                        style={{
                          color: '#fff',
                          textTransform: 'capitalize',
                          marginTop: responsiveHeight(1),
                        }}>
                        {item.description}
                      </Text> */}
                      <TextInput
                        style={[
                          styles.txtinput1,
                          {
                            backgroundColor: '#fff',
                          },
                        ]}
                        placeholder={'Add day description'}
                        multiline={true}
                        numberOfLines={5}
                        value={item?.description}
                        onChangeText={description =>
                          // setcurrentDescription(description)
                          handleEditDescription(description, index)
                        }
                      />
                    </View>
                  </View>
                )}
                keyExtractor={item => item.day}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: '#fff',
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View
                    style={{
                      height: 0.5,
                      backgroundColor: '#fff',
                    }}
                  />
                )}
              />
            </View>
            <View style={{marginVertical: responsiveHeight(2)}}>
              {/* <Text
                style={[styles.txt1, {marginVertical: responsiveHeight(2)}]}>
                Add Day
              </Text>
              <TextInput
                style={[
                  styles.txtinput1,
                  {
                    backgroundColor: '#fff',
                  },
                ]}
                placeholder={'Add days description'}
                multiline={true}
                numberOfLines={5}
                value={currentDescription}
                onChangeText={description => setcurrentDescription(description)}
              />
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: 50,
                  backgroundColor: '#CA6FE4',
                  paddingHorizontal: responsiveWidth(0),
                  paddingVertical: responsiveHeight(1),
                  alignItems: 'center',
                  marginVertical: responsiveHeight(2),
                  borderRadius: responsiveWidth(3),
                  // marginLeft: responsiveHeight(30),
                  alignSelf: 'flex-end',
                  borderWidth: 1,
                  borderColor: '#fff',
                }}
                onPress={() => {
                  if (currentDay <= 40) {
                    // if (currentDescription != '') {
                    setdayDescription([
                      ...dayDescription,
                      {dayno: currentDay, description: currentDescription},
                    ]);
                    setcurrentDay(currentDay + 1);
                    setcurrentDescription('');
                    // }
                  }
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                  }}>
                  Add Day
                </Text>
              </TouchableOpacity> */}
              <Button
                loading={false}
                disabled={loading}
                color={'#fff'}
                style={{
                  backgroundColor: '#CA6FE4',
                  borderRadius: responsiveWidth(3),
                  borderWidth: 1,
                  alignSelf: 'center',
                  // borderColor: '#fff',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,

                  width: '100%',
                  height: 50,
                }}
                onPress={() => {
                  // createChnlg();
                  handleUpdateChallenge();
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: 'bold',
                  }}>
                  Update
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
export default UpdateChallenge;
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
  txt1: {
    fontSize: responsiveFontSize(2.8),
    color: '#fff',
    fontFamily: fontFamily.Sans_Regular,
  },
  txt2: {
    fontSize: responsiveFontSize(2.4),
    color: '#fff',
    fontFamily: fontFamily.Sans_Regular,
    marginTop: responsiveHeight(2),
  },
  txtemoji: {
    fontSize: responsiveFontSize(3.2),
    color: '#fff',
    fontFamily: fontFamily.Sans_Regular,
  },
  txtemoji2: {
    fontSize: responsiveFontSize(3.7),
    color: '#fff',
    fontFamily: fontFamily.Sans_Regular,
  },
  addiconstyle: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    // backgroundColor: 'red',
  },
  iconselector: {
    marginTop: responsiveHeight(3),
    borderBottomColor: '#FFF',
    borderBottomWidth: responsiveWidth(0.1),
    paddingBottom: responsiveHeight(2),
    alignItems: 'center',
  },
  txtinput1: {
    borderBottomColor: '#FFF',
    borderBottomWidth: responsiveWidth(0.1),

    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
  },
  desctxt: {
    marginTop: responsiveHeight(2),
    color: '#F8F8F8',
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveHeight(3.5),
  },
  txtinput2: {
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(5.5),
    marginTop: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2.2),
    fontFamily: fontFamily.Sans_Regular,
  },
  skipview: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: responsiveHeight(-6),
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(100),
    zIndex: 1,
  },
  skiptxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
  },
  floatingbutton: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    bottom: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.3),
    paddingHorizontal: responsiveWidth(9),
    borderRadius: responsiveWidth(100),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  createtxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.5),
  },
  drawericonstyle: {
    marginHorizontal: 5,
    marginVertical: 3,
    width: responsiveWidth(5.3),
    height: responsiveWidth(5.3),
  },
});
