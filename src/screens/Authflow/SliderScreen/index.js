import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FastImage from 'react-native-fast-image';
import {appImages} from '../../../assets/utilities';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {fontFamily} from '../../../constants/fonts';
import {TouchableRipple} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';

const SliderScreen = props => {
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
  const pagination = () => {
    return (
      <Pagination
        dotsLength={carolist.length}
        activeDotIndex={activeSlide}
        containerStyle={{
          //   backgroundColor: 'red',
          paddingVertical: '1%',
        }}
        // animatedDuration={50}
        dotElement={
          <View
            style={{
              width: responsiveWidth(3),
              height: responsiveWidth(3),
              borderRadius: responsiveWidth(100),
              marginHorizontal: '4%',
              backgroundColor: '#444444',
              borderWidth: responsiveWidth(0.1),

              borderColor: '#707070',
            }}></View>
        }
        inactiveDotElement={
          <View
            style={{
              width: responsiveWidth(3),
              height: responsiveWidth(3),
              borderRadius: responsiveWidth(100),
              marginHorizontal: '4%',
              backgroundColor: '#fff',
              borderColor: '#707070',
              borderWidth: responsiveWidth(0.1),
            }}></View>
        }
      />
    );
  };
  const renderItem = ({item}) => {
    return (
      <View>
        <FastImage
          resizeMode="contain"
          source={item.image}
          style={styles.imgstyle}
        />
        <Text style={styles.txt1}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr
        </Text>
        <Text style={styles.txt2}>
          Lorem ipsum dolor sit amet, consetetur sadipscing nonumy magna
          aliquyam erat, sed diam
        </Text>
      </View>
    );
  };
  const [activeSlide, setActiveSlide] = useState(0);
  const isCarousel = useRef();
  const [carolist, setCarolist] = useState([
    {
      id: 1,
      image: appImages.splash1,
    },
    {
      id: 2,
      image: appImages.splash2,
    },
    {
      id: 3,
      image: appImages.splash3,
    },
  ]);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />

      <Carousel
        // currentIndex={2}
        ref={isCarousel}
        // activeSlideAlignment='start'
        layout={'default'}
        data={carolist}
        renderItem={renderItem}
        sliderWidth={responsiveWidth(100)}
        //slider width
        // sliderWidth={200}
        // inside slider item width
        itemWidth={responsiveWidth(100)}
        // slideStyle={{width: Dimensions.get('window').width - 40}}
        //   itemWidth={100}
        pagingEnabled
        containerCustomStyle={{
          marginTop: '4%',
          alignSelf: 'center',
          //backgroundColor: 'red',
          // paddingHorizontal: "5%",
          //   marginHorizontal: '15%'
        }}
        onSnapToItem={index => {
          setActiveSlide(index);
          console.log(index);
        }}
      />

      <View style={styles.fixedfooter}>
        <View
          style={[
            styles.buttonsview,
            {justifyContent: activeSlide === 0 ? 'flex-end' : 'space-between'},
          ]}>
          {activeSlide === 0 ? null : (
            <TouchableRipple
              style={styles.boxcolor}
              onPress={() => isCarousel.current.snapToPrev()}
              rippleColor="rgba(0, 0, 0, .32)">
              <FastImage
                resizeMode="contain"
                source={appImages.prev}
                style={styles.buttonstyle}
              />
            </TouchableRipple>
          )}

          <TouchableRipple
            style={styles.boxcolor}
            onPress={() => {
              if (activeSlide == 2) {
                props.navigation.navigate('IntroduceYourself');
              } else {
                isCarousel.current.snapToNext();
              }
            }}
            rippleColor="rgba(0, 0, 0, .32)">
            <FastImage
              resizeMode="contain"
              source={appImages.next}
              style={styles.buttonstyle}
            />
          </TouchableRipple>
        </View>
        <View
          style={{
            alignSelf: 'center',

            // backgroundColor: 'red',
          }}>
          {pagination()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SliderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  imgstyle: {
    width: responsiveWidth(77.5),
    height: responsiveHeight(37),
    alignSelf: 'center',
    marginTop: responsiveHeight(6),
    // backgroundColor: 'red',
  },
  txt1: {
    marginTop: responsiveHeight(3.5),
    fontFamily: fontFamily.Sans_Regular,
    color: '#000000',
    fontSize: responsiveFontSize(3),
    width: responsiveWidth(77.5),
    alignSelf: 'center',
    textAlign: 'center',
  },
  txt2: {
    marginTop: responsiveHeight(1.5),
    fontFamily: fontFamily.Sans_Regular,
    color: '#000000',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(62),
    alignSelf: 'center',
    // textAlign: 'center',
    opacity: 0.45,
    // backgroundColor: 'red',
  },
  buttonsview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(77.5),
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
  },
  buttonstyle: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
  },
  boxcolor: {
    backgroundColor: '#E60F4E',
    paddingHorizontal: responsiveWidth(8.5),
    paddingVertical: responsiveHeight(1.3),
  },
  fixedfooter: {
    marginBottom: responsiveHeight(2.5),
  },
});
