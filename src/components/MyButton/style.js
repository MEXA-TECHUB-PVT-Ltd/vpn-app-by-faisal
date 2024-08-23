import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
// import {buttonColor, textColor} from '../../constants/colors';
import {fontFamily} from '../../constants/fonts';
// import {fonts} from '../../constants/fonts';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: responsiveHeight(7),
    width: responsiveWidth(35),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(3),
    backgroundColor: '#CA6FE4',
  },
  title: {
    color: '#fff',
    fontSize: responsiveFontSize(2.5),

    fontFamily: fontFamily.Sans_Regular,
    marginBottom: responsiveHeight(0.8),
  },
  IconCon: {
    width: responsiveWidth(10),
  },
  imgstyle: {
    resizeMode: 'contain',
    // backgroundColor: 'red',
    height: responsiveHeight(2),
    width: responsiveWidth(2.5),
  },
});
