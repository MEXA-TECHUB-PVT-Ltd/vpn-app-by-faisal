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
  Keyboard,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState } from "react";
import MainHeader from "../../../components/MainHeader";
import LinearGradient from "react-native-linear-gradient";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import ImagePicker from "react-native-image-crop-picker";
import { fontFamily } from "../../../constants/fonts";
import img from "../../../assets/images/emoji/angle.png";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import FastImage from "react-native-fast-image";
import { appImages } from "../../../assets/utilities";
import { useSelector, useDispatch } from "react-redux";
import { color } from "react-native-reanimated";

import Snackbar from "react-native-snackbar";
import { api } from "../../../constants/api";
import Loader from "../../../components/Loader/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";

// import EmojiBoard from 'react-native-emoji-board';

// import EmojiPicker from 'rn-emoji-keyboard';
import EmojiModal from "react-native-emoji-modal";
// import EmojiPicker from "react-native-emoji-picker-staltz";

import Entypo from "react-native-vector-icons/Entypo";

import RNFetchBlob from "rn-fetch-blob";
import RNFS from "react-native-fs";
import { fn } from "moment/moment";

import Ionicons from "react-native-vector-icons/Ionicons";

// import Modal from 'react-native-modal';
import { Modal } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { bannerAdID } from "../../../utils/adsKey";

function AddChallenge(props) {
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
  } = useSelector((state) => state.userReducer);
  const [challengeName, setchallengeName] = useState("");
  const [challengeDescription, setchallengeDescription] = useState("");
  // day description
  const [currentDay, setcurrentDay] = useState(1);
  const [currentDescription, setcurrentDescription] = useState("");

  const [dayDescription, setdayDescription] = useState([]);

  const [emoji, setEmoji] = useState();
  const [loading, setLoading] = useState(false);

  const [imagecheckforgalary, setimagecheckforgalary] = useState("");
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageType, setImageType] = useState("");

  const [searchemoji, setSearchemoji] = useState(false);
  const [isskip, setIsskip] = useState(false);

  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [selectedEmojiIndex, setSelectedEmojiIndex] = useState(-1);

  const [isSkip, setIsSkip] = useState(false);
  const [selectedDay, setSelectedDay] = useState(1);
  const [isDaysVisible, setIsDaysVisible] = useState(false);
  const [remainingDay, setRemainingDay] = useState(40); //remaining Days to add in challenge .Note :  user can add maximum 40 days in challenge

  const [isVisble, setIsVisble] = useState(false); //to show days modal

  const [monthList, setMonthList] = useState([
    { label: "7 days", value: "0" },
    { label: "10 days", value: "1" },
    { label: "21 days", value: "2" },
    { label: "30 days", value: "3" },
    { label: "40 days", value: "4" },
  ]);
  const [selectedMonth, setSelectedMonth] = useState(monthList[0]?.value);

  // reference url : https://emojipedia.org/whatsapp/
  const [emojiList1, setEmojiList1] = useState([
    {
      id: 0,
      name: "Grinning Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face_1f600.png",
    },
    {
      id: 1,
      name: "Grinning Face with Smiling Eyes",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-smiling-eyes_1f604.png",
    },
    {
      id: 2,
      name: "Grinning Face with Sweat",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-sweat_1f605.png",
    },
    {
      id: 3,
      name: "Rolling on the Floor Laughing",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/rolling-on-the-floor-laughing_1f923.png",
    },
    {
      id: 4,
      name: " Face with Tears of Joy",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/face-with-tears-of-joy_1f602.png",
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
      name: "Grinning Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face_1f600.png",
    },
    {
      id: 1,
      name: "Grinning Face with Smiling Eyes",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-smiling-eyes_1f604.png",
    },
    {
      id: 2,
      name: "Grinning Face with Sweat",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/grinning-face-with-sweat_1f605.png",
    },
    {
      id: 3,
      name: "Rolling on the Floor Laughing",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/rolling-on-the-floor-laughing_1f923.png",
    },
    {
      id: 4,
      name: " Face with Tears of Joy",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/face-with-tears-of-joy_1f602.png",
    },
    {
      id: 5,
      name: "Slightly Smiling Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/slightly-smiling-face_1f642.png",
    },
    {
      id: 6,
      name: "Upside-Down Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/upside-down-face_1f643.png",
    },
    {
      id: 7,
      name: "Melting Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/melting-face_1fae0.png",
    },
    {
      id: 8,
      name: "Winking Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/winking-face_1f609.png",
    },
    {
      id: 9,
      name: "Smiling Face with Smiling Eyes",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-smiling-eyes_1f60a.png",
    },
    {
      id: 10,
      name: "Smiling Face with Halo",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-halo_1f607.png",
    },
    {
      id: 11,
      name: "Smiling Face with Hearts",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-hearts_1f970.png",
    },

    {
      id: 12,
      name: "Smiling Face with Heart-Eyes",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/smiling-face-with-heart-eyes_1f60d.png",
    },
    {
      id: 13,
      name: "Star-Struck",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/star-struck_1f929.png",
    },
    {
      id: 14,
      name: "Face Blowing a Kiss",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/face-blowing-a-kiss_1f618.png",
    },
    {
      id: 15,
      name: "Kissing Face",
      path: "https://em-content.zobj.net/thumbs/144/whatsapp/326/kissing-face_1f617.png",
    },
  ]);

  const renderItemDays = ({ item }) => {
    return (
      <View>
        <Text style={styles.txt2}>Day {item.id}</Text>
        <TextInput
          style={styles.txtinput2}
          placeholder={"Add day description"}
          onChangeText={(dayDescription) =>
            setdayDescription([
              ...dayDescription,
              {
                day: "day1",
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
    }).then((imageDetail) => {
      if (imageDetail) {
        setImage(imageDetail.path);
        setImageType(imageDetail.mime);
        var filename = imageDetail.path.split("/").pop();
        setImageName(filename);
      }

      setimagecheckforgalary("click");
      //   updateProfileImage(imageDetail);
    });
  };
  const renderItemEmoji = ({ item }) => {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          //   marginRight: responsiveWidth(2.2),
          marginLeft: responsiveWidth(3.8),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            setEmoji(item.path);
            setSearchemoji(false);
          }}
        >
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
    if (image?.length == 0) {
      Snackbar.show({
        text: "Challenge Icon is required",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else if (challengeName.length == 0) {
      Snackbar.show({
        text: "Please Enter Challenge Name",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else if (challengeDescription.length == 0) {
      Snackbar.show({
        text: "Please Enter Challenge Description",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else {
      setLoading(true);
      let user_id = await AsyncStorage.getItem("user_id");
      var headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      };
      const formData = new FormData();
      let profile_Obj = {
        uri: image,
        name: imageName,
        type: imageType,
      };

      // formData.append("image", profile_Obj);
      formData.append('emoji', selectedEmojifor);
      formData.append("name", challengeName);
      formData.append("description", challengeDescription);
      formData.append("addedby", user_id);
      formData.append("community_challenge", "false");

      await fetch(api.create_challenge, {
        method: "POST",
        headers: headers,
        body: formData,
      })
        .then((response) => response.json())
        .then(async (response) => {
          if (response[0]?.error == true) {
            Snackbar.show({
              text: response[0]?.message,
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: "red",
            });
          } else {
            Snackbar.show({
              text: "Challenge Created Successfully",
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: "green",
            });
            let uniq_id = response[0]?.hall_id;
            if (dayDescription.length > 0) {
              handleAddChallengeDays(uniq_id);
            } else {
              props?.navigation?.goBack();
            }
          }
        })
        .catch((error) => {
          Snackbar.show({
            text: "Something went wrong.",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "red",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleAddChallengeDays = async (uniq_id) => {
    var headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    await fetch(api.create_challenge_days, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        uniq_id: uniq_id,
        data: dayDescription,
      }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        props?.navigation?.goBack();
        // Snackbar.show({
        //   text: response[0]?.message,
        //   duration: Snackbar.LENGTH_LONG,
        //   backgroundColor: 'red',
        // });
      })
      .catch((error) => {
        Snackbar.show({
          text: "Something went wrong.",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "red",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleEmojiSelect = (v) => {
    setSelectedEmoji(v);
    console.log("kon sa emoji", selectedEmoji);
  };

  const readImage = (image) => {
    try {
      let fileName = image?.split("/")?.pop();
      RNFS.downloadFile({
        fromUrl: image,
        toFile: `${RNFS.TemporaryDirectoryPath}/${fileName}`,
      })
        .promise.then((res) => {
          // work with it

          let path = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
          RNFS.readDir(RNFS.TemporaryDirectoryPath).then((res) => {
            let file = res.filter((item) => item?.name == fileName);
            if (file.length > 0) {
              setImage("file://" + file[0].path);
              setImageName(file[0].name);
              setImageType("image/png");
            }
          });
        })
        .catch(console.error);
    } catch (error) {
      Snackbar.show({
        text: "Something went wrong",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    }
  };

  const handleSelectDay = async (item) => {
    let no_of_added_days = currentDay - 1;
    let remainingDays = 40 - no_of_added_days;
    setRemainingDay(remainingDays);
    if (item > remainingDays) {
      Snackbar.show({
        text: `You have only ${remainingDays} days left to add`,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "red",
      });
    } else {
      setSelectedDay(item);
    }
  };

  const handleAddDay = async () => {
    try {
      if (selectedDay > 1) {
        let prevList = [];
        let day_no = currentDay;
        for (let i = 0; i < selectedDay; i++) {
          prevList = dayDescription;
          prevList.push({ dayno: day_no, description: currentDescription });
          day_no = day_no + 1;
        }
        setcurrentDay(day_no);
        setdayDescription(prevList);
        setcurrentDescription("");

        let no_of_added_days = day_no - 1;
        let remainingDays = 40 - no_of_added_days;
        setRemainingDay(remainingDays);
      } else if (currentDay <= 40) {
        // if (currentDescription != '') {
        setdayDescription([
          ...dayDescription,
          { dayno: currentDay, description: currentDescription },
        ]);
        setcurrentDay(currentDay + 1);
        setcurrentDescription("");

        let no_of_added_days = currentDay;
        let remainingDays = 40 - no_of_added_days;
        setRemainingDay(remainingDays);
        // }
      } else if (currentDay > 40) {
        Snackbar.show({
          text: `You can add maximum 40 days in a challenge.`,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: "red",
        });
      }
      setSelectedDay(1);
      setIsDaysVisible(false);
    } catch (error) {
      console.log("Error  : ", error);
    }
  };

  const [selectedEmojifor, setSelectedEmojiFor] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);

  const handleEmojiSelectData = (emoji) => {
    setSelectedEmojiFor(emoji);
    readImage(emoji);
    setPickerVisible(false); // Close the picker after selection
  };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        // colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.linearGradient}
      >
        <MainHeader {...props} headertxt={"Add Challenge"} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollviewcontainer}
        >
          <View style={styles.innercontainer}>
            <Text style={styles.txt1}>Challenge Icon</Text>
            <View>
            <TouchableOpacity
          style={styles.emojiButton}
          onPress={() => setPickerVisible(true)}
        >
          <View style={styles.emojiWrapper}>
            <Text style={styles.emojiText}>
              {selectedEmojifor ? (
                <>
                  <Text style={styles.emoji}>{selectedEmojifor}</Text>
                </>
              ) : (
                <Ionicons name="add-circle-outline" color="white" size={50} />
              )}
            </Text>
            {selectedEmojifor && (
              <TouchableOpacity
                onPress={() => setPickerVisible(true)}
                style={styles.editIconContainer}
              >
                <Ionicons name="pencil" color="white" size={15} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
              {/* {isPickerVisible && (
        <TouchableOpacity onPress={() => setSelectedEmojiFor(null)} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      )} */}
              {isPickerVisible && (
                // <EmojiPicker
                //   onEmojiSelected={handleEmojiSelectData}
                //   rows={5}
                //   emojiSize={30}
                //   hideClearButton={false}
                //   containerStyle={styles.pickerAboveContainer}
                //   emojiStyle={styles.emojiStyle}
                // />
                <EmojiModal
                  onEmojiSelected={handleEmojiSelectData}
                  emojiSize={40}
                  hideClearButton={false}
                  containerStyle={styles.pickerAboveContainer}
                  emojiStyle={styles.emojiStyle}
        
                />
              )}
            </View>
      
            {loading && <Loader color={"red"} />}
         

            <Text
              style={[styles.txt1, { marginVertical: responsiveHeight(2) }]}
            >
              Challenge Name
            </Text>
            <TextInput
              value={challengeName}
              style={[
                styles.txtinput1,
                {
                  backgroundColor: "#fff",
                },
              ]}
              onChangeText={(name) => setchallengeName(name)}
            />
            <View>
              <Text
                style={[styles.txt1, { marginVertical: responsiveHeight(2) }]}
              >
                Challenge Description
              </Text>

              <TextInput
                style={[
                  styles.txtinput1,
                  {
                    backgroundColor: "#fff",
                  },
                ]}
                placeholder={"Add challenge description"}
                multiline={true}
                numberOfLines={5}
                value={challengeDescription}
                onChangeText={(description) =>
                  setchallengeDescription(description)
                }
              />
            </View>

            {!isSkip && (
              <>
                <View
                  style={{
                    zIndex: 999,
                  }}
                >
                  <Text
                    style={[
                      styles.txt1,
                      { marginVertical: responsiveHeight(2) },
                    ]}
                  >
                    Days Description
                  </Text>
                  <FlatList
                    data={dayDescription}
                    ListEmptyComponent={() => (
                      <View
                        style={{
                          flexDirection: "row",
                          height: responsiveHeight(10),
                          width: responsiveWidth(90),
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#ededed",
                          }}
                        >
                          You have not Added any Day Yet{" "}
                        </Text>
                      </View>
                    )}
                    renderItem={({ item, index }) => (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: responsiveHeight(1),
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: responsiveFontSize(2),
                              color: "#fff",
                            }}
                          >
                            Day No :
                          </Text>
                          <Text
                            style={{
                              fontSize: responsiveFontSize(2),
                              color: "#fff",
                            }}
                          >
                            {item.dayno}
                          </Text>
                        </View>
                        <View
                          style={{
                            justifyContent: "space-between",
                            marginVertical: responsiveHeight(1),
                          }}
                        >
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: responsiveFontSize(2),
                              color: "#fff",
                            }}
                          >
                            Description :
                          </Text>
                          <Text
                            style={{
                              color: "#fff",
                              textTransform: "capitalize",
                              marginTop: responsiveHeight(1),
                            }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item) => item.day}
                    ItemSeparatorComponent={() => (
                      <View
                        style={{
                          height: 0.5,
                          backgroundColor: "#fff",
                        }}
                      />
                    )}
                    ListFooterComponent={() => (
                      <View
                        style={{
                          height: 0.5,
                          backgroundColor: "#fff",
                        }}
                      />
                    )}
                  />
                </View>
                <View style={{ marginVertical: responsiveHeight(2) }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.txt1,
                        { marginVertical: responsiveHeight(2) },
                      ]}
                    >
                      Add Day
                    </Text>
                    {/* {currentDescription?.length > 0 ? (
                      <TouchableOpacity
                        onPress={() => setIsDaysVisible(!isDaysVisible)}
                        style={{
                          // backgroundColor: '#CA6FE4',
                          backgroundColor: '#FFF',
                          height: 33,
                          // paddingHorizontal: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 25,
                        }}>
                        <Image
                          source={appImages.alert}
                          style={{height: 35, width: 35, tintColor: '#E4175A'}}
                        />
                      </TouchableOpacity>
                    ) : ( */}
                    <TouchableOpacity
                      onPress={() => setIsSkip(true)}
                      style={{
                        backgroundColor: "#CA6FE4",
                        height: 33,
                        paddingHorizontal: 18,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 25,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: responsiveFontSize(2.5),
                          fontWeight: "400",
                        }}
                      >
                        Skip
                      </Text>
                    </TouchableOpacity>
                    {/* )} */}
                  </View>
                  <View style={{ backgroundColor: "#fff" }}>
                    <View>
                      <TextInput
                        style={[
                          styles.txtinput1,
                          {
                            backgroundColor: "#fff",
                          },
                        ]}
                        placeholder={"Add days description"}
                        multiline={true}
                        numberOfLines={5}
                        value={currentDescription}
                        onChangeText={(description) => {
                          if (description?.length == 0) {
                            setIsDaysVisible(false);
                          }
                          setcurrentDescription(description);
                        }}
                      />

                      {currentDescription?.length > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            setIsDaysVisible(!isDaysVisible);
                            Keyboard.dismiss();
                          }}
                          style={{
                            // backgroundColor: '#CA6FE4',
                            backgroundColor: "#FFF",
                            height: 33,
                            // paddingHorizontal: 18,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 25,
                            position: "absolute",
                            bottom: 5,
                            right: 10,
                          }}
                        >
                          <Image
                            // source={appImages.alert}
                            source={
                              isDaysVisible
                                ? appImages.eye
                                : appImages.eye_close
                            }
                            style={{
                              height: 20,
                              width: 20,
                              tintColor: "#E4175A",
                              resizeMode: "contain",
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {isDaysVisible && (
                      <View style={{ paddingHorizontal: 15 }}>
                        <Text
                          style={{
                            // ...styles.heading,
                            color: "gray",
                            marginTop: 5,
                            marginBottom: 5,
                            fontSize: 16,
                          }}
                        >
                          Add this description in
                          {selectedDay == 1
                            ? " multiple "
                            : " next " + selectedDay + " "}
                          days :
                        </Text>
                        <View
                          style={{
                            height: 40,
                            width: "70%",
                            justifyContent: "space-between",
                            flexDirection: "row",
                          }}
                        >
                          {[7, 21, 30, 40]?.map((item, index) => {
                            return (
                              <TouchableOpacity
                                onPress={() => handleSelectDay(item)}
                                key={index}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 30,
                                  backgroundColor:
                                    selectedDay == item
                                      ? "#E60F4E"
                                      : "transparent",
                                  marginHorizontal: 5,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color:
                                      remainingDay < item
                                        ? "gray"
                                        : selectedDay == item
                                        ? "#fff"
                                        : "#E60F4E",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    style={{
                      width: "40%",
                      height: 50,
                      backgroundColor: "#CA6FE4",
                      paddingHorizontal: responsiveWidth(0),
                      paddingVertical: responsiveHeight(1),
                      alignItems: "center",
                      marginVertical: responsiveHeight(2),
                      borderRadius: responsiveWidth(3),
                      // marginLeft: responsiveHeight(30),
                      alignSelf: "flex-end",
                      borderWidth: 1,
                      borderColor: "#fff",
                    }}
                    onPress={() => {
                      handleAddDay();
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: responsiveFontSize(2.5),
                        fontWeight: "bold",
                      }}
                    >
                      Add Day
                      {/* {emoji} */}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <View
              style={{
                marginTop: isSkip ? responsiveHeight(20) : 10,
                marginBottom: 20,
              }}
            >
              <Button
                loading={loading}
                disabled={loading}
                color={"#fff"}
                style={{
                  backgroundColor: "#CA6FE4",
                  borderRadius: responsiveWidth(3),
                  borderWidth: 1,
                  alignSelf: "center",
                  // borderColor: '#fff',
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,

                  width: "100%",
                  height: 50,
                }}
                onPress={() => {
                  createChnlg();
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontSize: responsiveFontSize(2.5),
                    fontWeight: "bold",
                  }}
                >
                  Create
                </Text>
              </Button>

              <View
                style={{
                  alignSelf: "center",
                  marginTop: 20,
                }}
              >
                <BannerAd
                  unitId={TestIds.BANNER}
                  size={BannerAdSize.BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                  }}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={isVisble}
          onDismiss={() => setIsVisble(false)}
          contentContainerStyle={{
            backgroundColor: "red",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            flex: 1,
            alignContent: "center",
          }}
        >
          <View
            style={{
              padding: 20,
              backgroundColor: "#fff",
              borderRadius: 25,
              // height: 300,
              width: responsiveWidth(90),
              zIndex: 999,
              alignSelf: "center",
            }}
          >
            <TextInput
              style={[
                styles.txtinput1,
                {
                  // height: 50,
                  backgroundColor: "#cdcdcd",
                  marginBottom: 15,
                },
              ]}
              placeholder={"Add days description"}
              multiline={true}
              numberOfLines={5}
              value={currentDescription}
              onChangeText={(description) => setcurrentDescription(description)}
            />

            <View style={styles.textInputView}>
              <Text style={styles.textInputHeading}>
                Select No.of Days to Add :
              </Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonth}
                  mode="dialog"
                  style={{ height: responsiveHeight(6.2) }}
                  itemStyle={{ height: responsiveHeight(6.2) }}
                  onValueChange={(itemValue, itemIndex) => {
                    setSelectedMonth(itemValue);
                    // getMonthRecord(itemValue, currentYear);
                    // getWeekNo('2023', itemValue);
                  }}
                >
                  {monthList?.map((item, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={item?.label}
                        value={item?.value}
                      />
                    );
                  })}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: "80%",
                height: 50,
                backgroundColor: "#CA6FE4",
                paddingHorizontal: responsiveWidth(0),
                paddingVertical: responsiveHeight(1),
                alignItems: "center",
                marginTop: responsiveHeight(2),
                borderRadius: responsiveWidth(3),
                // marginLeft: responsiveHeight(30),
                alignSelf: "center",
                borderWidth: 1,
                borderColor: "#fff",
              }}
              onPress={() => {
                // if (currentDay <= 40) {
                //   // if (currentDescription != '') {
                //   setdayDescription([
                //     ...dayDescription,
                //     {dayno: currentDay, description: currentDescription},
                //   ]);
                //   setcurrentDay(currentDay + 1);
                //   setcurrentDescription('');
                //   // }
                // }
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: responsiveFontSize(2.5),
                  fontWeight: "bold",
                }}
              >
                Add
                {/* {emoji} */}
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}
export default AddChallenge;
const styles = StyleSheet.create({
  textInputView: {
    // marginVertical: 12,
    marginHorizontal: 15,
  },
  textInputHeading: {
    color: "#000000",
    fontSize: 16,
    marginTop: 5,
    marginBottom: responsiveHeight(1),
    fontWeight: "500",
    // fontFamily: "Rubik-Regular",
  },
  pickerContainer: {
    borderRadius: responsiveWidth(2.5),
    borderWidth: 1,
    borderColor: "#CDCDCD",
    width: responsiveWidth(70),
    justifyContent: "center",
  },

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
    alignSelf: "center",
    marginTop: responsiveHeight(3.5),
  },
  txt1: {
    fontSize: responsiveFontSize(2.8),
    color: "#fff",
    fontFamily: fontFamily.Sans_Regular,
  },
  txt2: {
    fontSize: responsiveFontSize(2.4),
    color: "#fff",
    fontFamily: fontFamily.Sans_Regular,
    marginTop: responsiveHeight(2),
  },
  txtemoji: {
    fontSize: responsiveFontSize(3.2),
    color: "#fff",
    fontFamily: fontFamily.Sans_Regular,
  },
  txtemoji2: {
    fontSize: responsiveFontSize(3.7),
    color: "#fff",
    fontFamily: fontFamily.Sans_Regular,
  },
  addiconstyle: {
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    // backgroundColor: 'red',
  },
  iconselector: {
    marginTop: responsiveHeight(3),
    borderBottomColor: "#FFF",
    borderBottomWidth: responsiveWidth(0.1),
    paddingBottom: responsiveHeight(2),
    alignItems: "center",
  },
  txtinput1: {
    borderBottomColor: "#FFF",
    borderBottomWidth: responsiveWidth(0.1),
    fontFamily: fontFamily.Sans_Regular,
    color: "#fff",
    fontSize: responsiveFontSize(2.2),
  },
  desctxt: {
    marginTop: responsiveHeight(2),
    color: "#F8F8F8",
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(1.7),
    lineHeight: responsiveHeight(3.5),
  },
  txtinput2: {
    backgroundColor: "#fff",
    borderRadius: responsiveWidth(5.5),
    marginTop: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2.2),
    fontFamily: fontFamily.Sans_Regular,
  },
  skipview: {
    position: "absolute",
    alignSelf: "flex-end",
    bottom: responsiveHeight(-6),
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveWidth(100),
    zIndex: 1,
  },
  skiptxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: "#fff",
    fontSize: responsiveFontSize(2.2),
  },
  floatingbutton: {
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
    bottom: responsiveHeight(2),
    paddingVertical: responsiveHeight(1.3),
    paddingHorizontal: responsiveWidth(9),
    borderRadius: responsiveWidth(100),
    shadowColor: "#000",
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
    color: "#fff",
    fontSize: responsiveFontSize(2.5),
  },
  drawericonstyle: {
    marginHorizontal: 5,
    marginVertical: 3,
    width: responsiveWidth(5.3),
    height: responsiveWidth(5.3),
  },
  pickerAboveContainer: {
    borderRadius: responsiveWidth(0.5),
    borderWidth: 1,
    borderColor: "#CDCDCD",
    // width: responsiveWidth(70),
    justifyContent: "center",
  },
  emojiButton: {
    padding: 10,
    // borderWidth: 1,
    // borderColor: "#ccc",
    borderRadius: 8,
    // backgroundColor: "#fff",
    alignItems: "center",
  },
  emojiWrapper: {
    alignItems: 'center',
  },
  emojiText: {
    fontSize: 40,
    color: "black",
  },
  emojiStyle: {
    color: "black", // You can customize the color of the emojis
  },
  clearButton: {
   top: '5%',
   right:10,
    position:'absolute',
   
  },
  clearButtonText: {
    color: 'black',
    fontSize: 12,
  },
  editIconContainer: {
    position:'absolute',
     bottom:0,
     right:0
  },
});
