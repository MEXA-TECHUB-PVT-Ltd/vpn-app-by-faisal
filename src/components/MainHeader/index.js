import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../assets/utilities';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

import {fontFamily} from '../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import {useSelector} from 'react-redux';
const MainHeader = props => {
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
    <View {...props} style={styles.main}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <TouchableRipple
            onPress={() => {
              props.navigation.goBack();
            }}
            rippleColor="rgba(0, 0, 0, .1)"
            style={styles.drawerview}>
            <FastImage
              source={appImages.backbutton}
              resizeMode="contain"
              style={styles.drawericonstyle}
            />
          </TouchableRipple>
          <Text
            numberOfLines={1}
            style={[
              styles.headertxtstyle,
              {
                color: isdarkmode ? soliddark : solid,

                flex: 1,
              },
            ]}>
            {props.headertxt}
          </Text>
        </View>

        {props.numbercoins == undefined ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[styles.cointxt, {color: isdarkmode ? soliddark : solid}]}>
              {''}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={styles.cointxt}>{props.numbercoins}</Text>
            <Image
              source={appImages.coins}
              style={{
                width: responsiveWidth(5),
                height: responsiveWidth(5),
                marginLeft: responsiveWidth(2),
              }}
            />
          </View>
        )}

        {props?.currentPage != undefined && props?.totalPages != undefined && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={[
                styles.headertxtstyle,
                {
                  color: isdarkmode ? soliddark : solid,
                  fontSize: responsiveFontSize(2.5),
                },
              ]}>
              {props?.currentPage}/{props?.totalPages}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  main: {
    width: responsiveWidth(100),
    backgroundColor: '#fff',
    paddingVertical: responsiveHeight(1.4),
  },
  header: {
    width: responsiveWidth(92),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  drawericonstyle: {
    width: responsiveWidth(4.5),
    height: responsiveWidth(4.5),
  },
  drawerview: {
    // backgroundColor: 'red',
    paddingHorizontal: responsiveWidth(2.5),
    paddingVertical: responsiveHeight(1),
    borderRadius: responsiveWidth(10),
  },
  coinstyle: {
    width: responsiveWidth(7),
    height: responsiveWidth(7),
  },
  cointxt: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: fontFamily.Sans_Regular,
  },
  headertxtstyle: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.7),
    marginLeft: responsiveWidth(2),
  },
});
