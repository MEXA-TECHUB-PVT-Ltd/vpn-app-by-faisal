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
import React, {useState} from 'react';
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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import moment from 'moment';
import {LocaleConfig} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

// import {
//   ColorPicker,
//   TriangleColorPicker,
//   fromHsv,
// } from 'react-native-color-picker';

import ColorPicker from 'react-native-wheel-color-picker';
import {useRef} from 'react';

import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../components/Loader/Loader';

const WriteNotes = props => {
  const {date, dateapi, formatedDate} = props?.route.params;
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
  const [note, setnote] = useState('');
  const [userid, setuserid] = useState();

  const colorPicker = useRef();

  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const [loading, setLoading] = useState(false);

  // setuserid(global.user_id)
  const addDailyJournal = async () => {
    console.log(note + '-------' + dateapi + '------' + global.user_id);
    var InsertAPIURL = global.url + 'api/journals/addJournal';
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    await fetch(InsertAPIURL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        note: note,
        date: dateapi,
        userId: global._id,
      }),
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        navigation.goBack();
      })
      .catch(error => {
        alert('this is error' + error);
      });
  };
  const navigation = useNavigation();
  let count = 0;
  const handleColorChange = color => {
    setSelectedColor(color);
    if (count > 0) {
      //not want to hide modal on first render
      setIsColorPickerVisible(false);
    }
    count++;
  };

  const handleSaveJournal = async () => {
    if (note?.length == 0) {
      Snackbar.show({
        text: 'Please Enter Text to save.',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    } else {
      setLoading(true);
      let user_id = await AsyncStorage.getItem('user_id');
      var headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      let obj = {
        user_id: user_id,
        note: note,
        date: formatedDate,
        color: selectedColor,
      };
      await fetch(api.create_journal, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(obj),
      })
        .then(response => response.json())
        .then(async response => {
          if (response[0]?.error == false || response[0]?.error == false) {
            Snackbar.show({
              text: 'Journal added successfully',
              duration: Snackbar.LENGTH_LONG,
              backgroundColor: 'green',
            });
            navigation?.replace('DailyJournal');
          } else {
            Snackbar.show({
              // text: response[0]?.message,
              text: 'You already added a journal for today.',
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
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Daily Journal'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          {loading && <Loader color={isdarkmode ? soliddark : solid} />}

          {/* {isColorPickerVisible && (
            <TriangleColorPicker
              hideSliders={true} //holo picker only
              hideControls={true}
              onColorSelected={color =>
                console.log('selected color  :::  ', color)
              }
              onColorChange={color => {
                setTimeout(() => {
                  let colorCode = fromHsv(color);
                  setSelectedColor(colorCode);
                  setIsColorPickerVisible(false);
                }, 1000);
              }}
              style={{
                // height: 200,
                position: 'absolute',
                zIndex: 10,
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
              }}
            />
          )} */}
          {isColorPickerVisible && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
              }}>
              <ColorPicker
                ref={colorPicker}
                color={selectedColor}
                // swatchesOnly={this.state.swatchesOnly}
                // onColorChange={color => console.log('color ::  ', color)}
                onColorChangeComplete={color => {
                  handleColorChange(color);
                }}
                thumbSize={40}
                sliderSize={100}
                sliderHidden={true}
                swatches={false}
                noSnap={true}
                row={true}

                // swatchesLast={this.state.swatchesLast}
                // swatches={this.state.swatchesEnabled}
                // discrete={this.state.disc}
              />
            </View>
          )}

          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: fontFamily.Sans_Regular,
              fontSize: responsiveFontSize(2.3),
              marginLeft: responsiveWidth(5),
              marginTop: responsiveHeight(5),
              marginBottom: responsiveHeight(6),
            }}>
            {date}
          </Text>
          <View
            style={{
              width: responsiveWidth(88),
              alignSelf: 'center',
              backgroundColor: isdarkmode ? soliddark : solid,
              paddingVertical: responsiveHeight(3),
              paddingHorizontal: responsiveWidth(4),
              borderTopLeftRadius: responsiveWidth(3),
              borderTopRightRadius: responsiveWidth(3),
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2.3),
              }}>
              Write Notes
            </Text>
            <TouchableOpacity
              activeOpacity={0.65}
              onPress={() => setIsColorPickerVisible(!isColorPickerVisible)}>
              <Image
                source={appImages.writenotes}
                style={{
                  width: responsiveWidth(6),
                  height: responsiveWidth(6),
                  tintColor: selectedColor ? selectedColor : '#FFF',
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: responsiveHeight(50),
              backgroundColor: '#fff',
              width: responsiveWidth(86),
              alignSelf: 'center',
            }}>
            <TextInput
              style={{
                width: responsiveWidth(78),
                alignSelf: 'center',
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2),
                color: '#000',
              }}
              onChangeText={note => setnote(note)}
              multiline
              placeholder={'Type Here'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
            />
            <View
              style={{
                width: responsiveWidth(78),
                alignSelf: 'center',
                height: responsiveHeight(0.2),
                backgroundColor: 'lightgray',
              }}></View>
          </View>

          {/* <View
            style={{
              width: responsiveWidth(78),
              alignSelf: 'center',
              height: responsiveHeight(0.2),
              backgroundColor: 'red',
            }}></View> */}

          <View
            style={{
              marginTop: responsiveHeight(3),
              width: responsiveWidth(86),
              alignItems: 'flex-end',
              alignSelf: 'center',
            }}>
            <TouchableOpacity
              // onPress={() => addDailyJournal()}
              onPress={() => handleSaveJournal()}
              style={{
                backgroundColor: isdarkmode ? seconddark : second,
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(1),
                borderRadius: responsiveWidth(100),
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,

                elevation: 6,
              }}
              activeOpacity={0.6}>
              <Text
                style={{
                  color: '#fff',
                  fontFamily: fontFamily.Sans_Regular,
                  fontSize: responsiveFontSize(2.1),
                }}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default WriteNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    // zIndex: 1,
  },
});
