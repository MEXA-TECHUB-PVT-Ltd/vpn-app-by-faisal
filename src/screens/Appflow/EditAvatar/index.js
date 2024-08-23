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
import {appImages} from '../../../assets/utilities';
import {useSelector, useDispatch} from 'react-redux';
import {Modal} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {Button} from 'react-native-paper';
import Snackbar from 'react-native-snackbar';

const EditAvatar = props => {
  const [modalvisible, setModalVisible] = useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const [selectedavatar, setSelectedAvatar] = useState(appImages.avatar);

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
  const [data, setData] = useState([
    {
      id: 1,
      img: appImages.avatar1,
      status: 'unlocked',
    },
    {
      id: 2,
      img: appImages.avatar2,
      status: 'unlocked',
    },
    {
      id: 3,
      img: appImages.avatar3,
      status: 'unlocked',
    },
    {
      id: 4,
      img: appImages.avatar4,
      status: 'unlocked',
    },
    {
      id: 5,
      img: appImages.avatar5,
      status: 'unlocked',
    },
    {
      id: 6,
      img: appImages.avatar6,
      status: 'unlocked',
    },
    {
      id: 7,
      img: appImages.avatar7,
      status: 'unlocked',
    },
    {
      id: 8,
      img: appImages.avatar8,
      status: 'unlocked',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    getUser();
  }, [isFocused]);

  const getUser = async () => {
    let user_image = await AsyncStorage.getItem('user_image');
    if (user_image) {
      let parse = JSON.parse(user_image);
      setSelectedAvatar(parse);
    }
  };

  const handleSelectImage = async item => {
    setSelectedAvatar(item?.img);
    // await AsyncStorage.setItem('user_imsage', JSON.stringify(item?.img));
  };

  const handleApply = async () => {
    try {
      await AsyncStorage.setItem('user_image', JSON.stringify(selectedavatar));
      Snackbar.show({
        text: 'Avatar updated successfully',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'green',
      });
      props?.navigation?.goBack();
    } catch (error) {
      Snackbar.show({
        text: 'Something went wrong',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={{
          borderRadius: responsiveWidth(100),
          width: responsiveWidth(18),
          height: responsiveWidth(18),
          marginBottom: responsiveHeight(3),
        }}
        onPress={() => {
          handleSelectImage(item);
        }}>
        <Image
          source={item?.img}
          style={{
            resizeMode: 'contain',
            borderRadius: responsiveWidth(100),
            width: responsiveWidth(18),
            height: responsiveWidth(18),
          }}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Avatar'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          <Image
            source={selectedavatar}
            style={{
              resizeMode: 'contain',
              width: responsiveWidth(35),
              height: responsiveWidth(35),
              borderRadius: responsiveWidth(100),
              alignSelf: 'center',
              marginTop: responsiveHeight(7),
              backgroundColor: '#fff',
            }}
          />
          <FlatList
            // contentContainerStyle={{backgroundColor: 'red', height: 200}}
            data={data}
            renderItem={renderItem}
            numColumns={4}
            contentContainerStyle={{
              marginTop: responsiveHeight(6),
            }}
            columnWrapperStyle={{
              justifyContent: 'space-between',
            }}
            ListFooterComponent={() => {
              return (
                <Button
                  loading={loading}
                  disabled={loading}
                  color={'#fff'}
                  style={styles.btn}
                  onPress={() => {
                    handleApply();
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: responsiveFontSize(2.5),
                      fontWeight: 'bold',
                    }}>
                    Apply
                  </Text>
                </Button>
              );
            }}
          />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EditAvatar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    paddingHorizontal: responsiveWidth(5),
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
  btn: {
    backgroundColor: '#CA6FE4',
    borderRadius: responsiveWidth(3),
    borderWidth: 1,
    alignSelf: 'center',
    // borderColor: '#fff',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: responsiveWidth(5),
    // elevation: 5,
    width: '100%',
    height: 50,
    marginTop: responsiveHeight(5),
  },
});
