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
import {useSelector, useDispatch} from 'react-redux';

const Tasks = props => {
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
  const [list, setList] = useState([
    {
      id: 1,
      title: 'Visit app 5 days in row',
    },
    {
      id: 2,
      title: 'Filling Profile',
    },
  ]);

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: responsiveWidth(3),
          alignSelf: 'center',
          width: responsiveWidth(91),
          marginTop: responsiveHeight(3),
          paddingVertical: responsiveHeight(3),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: responsiveWidth(4),
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[styles.txtstyle, {color: '#191919'}]}>2</Text>
          <Image
            source={appImages.coins}
            style={{
              width: responsiveWidth(6),
              height: responsiveWidth(6),
              marginRight: responsiveWidth(2),
              marginLeft: responsiveWidth(2),
            }}
          />
          <Text
            style={[
              styles.txtstyle,
              {
                width: responsiveWidth(51),
                color: isdarkmode ? seconddark : second,
              },
            ]}>
            {item.title}
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.6}>
          <Text
            style={[
              styles.txtstyle,
              {color: isdarkmode ? seconddark : second},
            ]}>
            0/5
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader {...props} headertxt={'Tasks'} numbercoins={'40'} />
        <FlatList
          data={list}
          renderItem={renderItem}
          contentContainerStyle={{padding: responsiveHeight(1.5)}}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Tasks;

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
