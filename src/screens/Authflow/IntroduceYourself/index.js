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
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily} from '../../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector, useDispatch} from 'react-redux';

const IntroduceYourself = props => {
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
  const [gender, setGender] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollview}>
        <StatusBar hidden={true} />
        <FastImage
          style={styles.toprightstyle}
          source={appImages.topleft}
          resizeMode="cover"
        />
        <FastImage
          style={styles.topleftstyle}
          source={appImages.topleft}
          resizeMode="cover"
        />
        <FastImage
          style={styles.bottomrightstyle}
          source={appImages.bottomright}
          resizeMode="cover"
        />
        <FastImage
          style={styles.bottomleftstyle}
          source={appImages.bottomleft}
          resizeMode="cover"
        />
        <LinearGradient
          colors={isdarkmode ? doubledark : double}
          style={styles.linearGradient}>
          <View
            style={{
              zIndex: 1,
            }}>
            <FastImage
              source={appImages.allcolors}
              resizeMode="contain"
              style={styles.imgstyle}
            />
            <Text style={styles.txt1}>Introduce Yourself</Text>

            <Text style={styles.txt2}>Enter name</Text>
            <TextInput style={styles.txtinputstyle} />
            <Text style={styles.txt2}>Gender</Text>
            <View style={styles.gendercontainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    backgroundColor: gender === 'male' ? 'lightgray' : '#fff',
                  },
                ]}
                onPress={() => setGender('male')}>
                <FastImage
                  source={appImages.male}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      marginRight: responsiveWidth(0.4),
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    backgroundColor: gender === 'female' ? 'lightgray' : '#fff',
                  },
                ]}
                onPress={() => setGender('female')}>
                <FastImage
                  source={appImages.female}
                  resizeMode={'contain'}
                  style={[
                    styles.genderimg,
                    {
                      marginLeft: responsiveWidth(0.4),
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.genderview,
                  {
                    backgroundColor:
                      gender === 'thirdgender' ? 'lightgray' : '#fff',
                  },
                ]}
                onPress={() => setGender('thirdgender')}>
                <FastImage
                  source={appImages.thirdgender}
                  resizeMode={'contain'}
                  style={styles.genderimg}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('App')}
              style={styles.nextview}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.nexttxt,
                  {color: isdarkmode ? soliddark : solid},
                ]}>
                Next
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroduceYourself;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flexGrow: 1,
  },
  linearGradient: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveWidth(10),
  },
  imgstyle: {
    width: responsiveWidth(37),
    height: responsiveWidth(37),
    // backgroundColor: 'red',
    alignSelf: 'center',
  },

  toprightstyle: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    right: responsiveWidth(-40),
    top: responsiveHeight(-12),
  },
  bottomleftstyle: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    left: responsiveWidth(-48),
    bottom: responsiveHeight(-32),
  },
  topleftstyle: {
    width: responsiveWidth(100),
    height: responsiveWidth(100),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    left: responsiveWidth(-58),
    top: responsiveHeight(-12),
  },
  bottomrightstyle: {
    width: responsiveWidth(110),
    height: responsiveWidth(110),
    // backgroundColor: 'black',
    position: 'absolute',
    zIndex: 1,
    right: responsiveWidth(-42),
    bottom: responsiveHeight(-32),
  },
  txt1: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.7),
    marginTop: responsiveHeight(2),
    alignSelf: 'center',
  },
  txt2: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
    marginTop: responsiveHeight(2),
  },
  secondview: {
    width: responsiveWidth(80),
  },
  txtinputstyle: {
    borderBottomWidth: responsiveWidth(0.1),
    borderColor: '#fff',
    paddingVertical: responsiveHeight(0.2),
    width: responsiveWidth(78),

    marginTop: responsiveHeight(0.5),
    alignSelf: 'flex-end',
    // backgroundColor: 'red',

    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.1),
  },
  gendercontainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: responsiveWidth(65),
    alignSelf: 'center',
    marginTop: responsiveHeight(3),
  },
  genderimg: {
    width: responsiveWidth(12),
    height: responsiveHeight(9),
    // backgroundColor: 'red',
    // borderRadius: responsiveWidth(100),
  },
  genderview: {
    width: responsiveWidth(17),
    height: responsiveWidth(17),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(100),

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
  },
  nexttxt: {
    fontFamily: fontFamily.Sans_Regular,
    color: '#fff',
    fontSize: responsiveFontSize(2.3),
  },
  nextview: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
    marginTop: responsiveHeight(8),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveHeight(1.3),
    borderRadius: responsiveWidth(2),
  },
});
