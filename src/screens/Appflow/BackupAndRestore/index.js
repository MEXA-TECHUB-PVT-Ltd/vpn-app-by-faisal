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
import {MyButton} from '../../../components/MyButton';

const BackupAndRestore = props => {
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
        <MainHeader {...props} headertxt={'Backup and Restore'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
          <Text
            style={{
              marginVertical: responsiveHeight(2.5),
              color: '#fff',
              fontFamily: fontFamily.Sans_Regular,
              fontSize: responsiveFontSize(2.6),
              width: responsiveWidth(90),
              alignSelf: 'center',
            }}>
            Please select the feature and follow the steps.
          </Text>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              width: responsiveWidth(90),
              alignSelf: 'center',
              borderRadius: responsiveWidth(7),
              paddingVertical: responsiveHeight(2.5),
            }}>
            <Text
              style={{
                color: isdarkmode ? soliddark : solid,
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2.6),
              }}>
              Data Backup
            </Text>
            <View
              style={{
                width: responsiveWidth(34),
                height: responsiveWidth(34),
                margin: responsiveHeight(3),
              }}>
              <Image
                source={appImages.cloudstorage}
                style={{
                  resizeMode: 'contain',
                  width: responsiveWidth(34),
                  height: responsiveWidth(34),
                }}
              />
            </View>

            <MyButton
              title={'Backup'}
              onPress={() => props.navigation.navigate('Backup')}
            />
          </View>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
              width: responsiveWidth(90),
              marginTop: responsiveHeight(4),
              alignSelf: 'center',
              borderRadius: responsiveWidth(7),
              paddingVertical: responsiveHeight(2.5),
              marginBottom: responsiveHeight(3),
            }}>
            <Text
              style={{
                color: isdarkmode ? soliddark : solid,
                fontFamily: fontFamily.Sans_Regular,
                fontSize: responsiveFontSize(2.6),
              }}>
              Data Restore
            </Text>
            <View
              style={{
                width: responsiveWidth(34),
                height: responsiveWidth(34),
                margin: responsiveHeight(3),
              }}>
              <Image
                source={appImages.recovery}
                style={{
                  resizeMode: 'contain',
                  width: responsiveWidth(34),
                  height: responsiveWidth(34),
                }}
              />
            </View>

            <MyButton
              onPress={() => props.navigation.navigate('Backup')}
              title={'Restore'}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default BackupAndRestore;

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
});
