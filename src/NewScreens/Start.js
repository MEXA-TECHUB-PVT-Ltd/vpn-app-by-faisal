import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Dimensions,
  View,
  Image,
  Text,
  TouchableOpacity,
  AppState,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import left from '../NewScreens/Images/left.png';
import right from '../NewScreens/Images/right.png';
import left1 from '../NewScreens/Images/iconforward.png';
import right1 from '../NewScreens/Images/iconfab.png';

import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import Carousel from 'react-native-looped-carousel';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setIsDarkMode,
  setFirst,
  setSecond,
  setSolid,
  setDouble,
} from '../redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useRef} from 'react';
import Loader from '../components/Loader/Loader';

// Generate required css
// import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';

const images = [
  require('../assets/images/splash1.png'),
  require('../assets/images/splash2.png'),
  require('../assets/images/splash3.png'),
];
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const App = ({navigation}) => {
  const dispatch = useDispatch();

  const {double, soliddark, solid, isdarkmode} = useSelector(
    state => state.userReducer,
  );

  const [currentPage, setCurrentPage] = useState(0);

  const carouselRef = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setLoading(true);
    let user = await AsyncStorage.getItem('user');
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');
    isDarkMode = isDarkMode == 'true' ? true : false;
    dispatch(setIsDarkMode(isDarkMode));

    let first = await AsyncStorage.getItem('setFirst');
    let second = await AsyncStorage.getItem('setSecond');
    let solid = await AsyncStorage.getItem('setSolid');
    let double = await AsyncStorage.getItem('setDouble');

    // first: '#E60F4E',
    // second: '#CA6FE4',
    // solid: '#EC1D94',
    // double: ['#E60F4E', '#CA6FE4'],

    if (first == null) {
      dispatch(setFirst('#E60F4E'));
    } else {
      dispatch(setFirst(first));
    }
    if (second == null) {
      dispatch(setSecond('#CA6FE4'));
    } else {
      dispatch(setSecond(second));
    }
    if (solid == null) {
      dispatch(setSolid('#EC1D94'));
    } else {
      dispatch(setSolid(solid));
    }
    if (double == null) {
      dispatch(setDouble(['#E60F4E', '#CA6FE4']));
    } else {
      dispatch(setDouble(JSON.parse(double)));
    }
    let isFirstViewInApp = await AsyncStorage.getItem('isFirstViewInApp');
    if (isFirstViewInApp == null && user == null) {
      setLoading(false);
      // do nothing
    } else if (user == null && isFirstViewInApp != null) {
      setLoading(false);
      navigation?.replace('AuthApp', {screen: 'Introduction'});
    } else {
      // navigation.replace('GoodMorning');
      navigation.replace('App', {screen: 'MyTab'});
      setLoading(false);
    }
  };

  const [imgActive, setimgActive] = useState(0);
  onChange = nativeEvent => {
    if (nativeEvent) {
      const slider = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slider != imgActive) {
        setimgActive(slider);
      }
    }
  };
  const next = () => {
    navigation.replace('Introduction');
  };

  const _onLayoutDidChange = e => {
    const layout = e.nativeEvent.layout;
    // this.setState({size: {width: layout.width, height: layout.height}});
  };

  const handleNext = () => {
    console.log('currentPage  ::::  ', currentPage);
    if (currentPage < 2) {
      // setCurrentPage(currentPage + 1);
      // carouselRef?.current?.animateToPage(currentPage + 1);
      carouselRef?.current?._animateNextPage();
    } else {
      navigation.replace('Introduction');
    }
  };

  const handlePrev = () => {
    // setCurrentPage(currentPage - 1);
    // carouselRef?.current?.animateToPage(currentPage - 1);
    carouselRef?.current?._animatePreviousPage();
  };

  const OnBoarding1 = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginVertical: responsiveHeight(3),
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../assets/images/splash1.png')}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.txt1}>
              Challenge Yourself to a Healthier You with Challenge Final!
            </Text>
            <Text style={styles.txt2}>
              Our 40-Day Challenge App will assist you to get out of your
              comfort zone. You will meet the new disciplined, punctual, and
              persistent “You” within 40 days. Challenge yourself and transform
              your ordinary life patterns into productive hassle and dream life.
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.15,
            width: responsiveWidth(90),
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}>
          {/* <TouchableOpacity style={styles.left}>
            <Icon name="arrow-left" size={20} color={'white'} />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.right} onPress={() => handleNext()}>
            <Icon name="arrow-right" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const OnBoarding2 = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginVertical: responsiveHeight(3),
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../assets/images/splash2.png')}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.txt1}>
              Forty Days of Inspirational Quotes and Books.
            </Text>
            <Text style={styles.txt2}>
              Welcome to the ‘40 Days Challenge’ of Inspirational Quotes and
              Books", your daily dose of motivation and encouragement! Take
              control of your life with our app. Get inspired daily for 40 days.
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.15,
            width: responsiveWidth(90),
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={styles.right} onPress={() => handleNext()}>
            <Icon name="arrow-right" size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.left} onPress={() => handlePrev()}>
            <Icon name="arrow-left" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const OnBoarding3 = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{flex: 1}}>
          <View
            style={{
              marginVertical: responsiveHeight(3),
              alignItems: 'center',
            }}>
            <Image
              resizeMode="contain"
              style={styles.image}
              source={require('../assets/images/splash3.png')}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.txt1}>
              Hit Your Goals Every Time Right on the Target With To-Do-List.
            </Text>
            <Text style={styles.txt2}>
              Are you tired of setting goals but always falling short? Say
              goodbye to frustration and hello to success with our exclusive
              to-do list feature. It helps you stay focused, motivated, and on
              track toward achieving your goals.
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.15,
            width: responsiveWidth(90),
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity style={styles.right} onPress={() => handleNext()}>
            <Icon name="arrow-right" size={20} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.left} onPress={() => handlePrev()}>
            <Icon name="arrow-left" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: isdarkmode ? soliddark : '#fff',
            height: responsiveHeight(100),
            width: responsiveWidth(100),
          }}>
          <Loader color={isdarkmode ? '#fff' : '#E4175A'} />
        </View>
      ) : (
        <View
          style={{flex: 1}}
          // onLayout={_onLayoutDidChange}
        >
          <Carousel
            delay={2000}
            isLooped={false}
            style={{
              width: responsiveWidth(100),
              height: responsiveHeight(100),
            }}
            autoplay={false}
            ref={carouselRef}
            currentPage={currentPage}
            onPageBeingChanged={val => {
              setCurrentPage(val);
            }}
            onAnimateNextPage={p => setCurrentPage(p)}
            bullets
            bulletStyle={{
              backgroundColor: '#fff',
              borderColor: '#707070',
              height: 12,
              width: 12,
            }}
            chosenBulletStyle={{
              backgroundColor: '#707070',
              height: 12,
              width: 12,
            }}>
            <View
              style={[{flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT}]}>
              <OnBoarding1 />
            </View>
            <View
              style={[{flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT}]}>
              <OnBoarding2 />
            </View>
            <View
              style={[{flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT}]}>
              <OnBoarding3 />
            </View>
          </Carousel>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrap: {
    width: 300,
    height: 300,
    left: 13,
    top: 3,
  },
  wrapDot: {
    position: 'absolute',
    // bottom: 0,
    top: 680,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'black',
  },

  dot: {
    margin: 3,
    color: 'white',
  },
  txt1: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 10,
  },
  textContainer: {
    width: responsiveWidth(100),
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 25,
  },
  txt2: {
    color: '#000000',
    alignSelf: 'center',
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 13,
  },
  left: {
    width: 60,
    height: 33,

    backgroundColor: '#E4175A',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    width: 60,
    height: 33,
    backgroundColor: '#E4175A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: responsiveWidth(55),
    height: responsiveHeight(40),
    // left: 13,
    top: responsiveHeight(5),
  },
});
export default App;

// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Dimensions,
//   View,
//   Image,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// // import bg1 from '../NewScreens/Images/a.png'
// // import bg2 from '../NewScreens/Images/b.png'
// // import bg3 from '../NewScreens/Images/c.png'
// import {ScrollView} from 'react-native-gesture-handler';
// import left from '../NewScreens/Images/left.png';
// import right from '../NewScreens/Images/right.png';
// import left1 from '../NewScreens/Images/iconforward.png';
// import right1 from '../NewScreens/Images/iconfab.png';
// // import Icon from 'react-native-vector-icons'
// // import Icon from 'react-native-vector-icons/dist/FontAwesome';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// // import Icon from 'react-native-vector-icons/MaterialIcons'
// // import Icon from 'react-native-vector-icons/FontAwesome'
// import Icon from 'react-native-vector-icons/FontAwesome';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {
//   setIsDarkMode,
//   setFirst,
//   setSecond,
//   setSolid,
//   setDouble,
// } from '../redux/actions';
// import {useDispatch} from 'react-redux';
// import {
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';

// // Generate required css
// // import iconFont from 'react-native-vector-icons/Fonts/FontAwesome.ttf';

// const images = [
//   // { image_url: require("../NewScreens/Images/a.png") },
//   // { image_url: require("../NewScreens/Images/b.png") },
//   // { image_url: require("../NewScreens/Images/c.png") },
//   // 'https://www.classicinformatics.com/hubfs/startup%20mistakes.png',
//   // 'https://www.neoito.com/blog/wp-content/uploads/2021/09/Might-Not-Be-Ready-to-be-a-Business-Owner.png',
//   // 'https://okcredit-blog-images-prod.storage.googleapis.com/2021/03/businessideasforcollegestudents2.jpg',
//   require('../assets/images/splash1.png'),
//   require('../assets/images/splash2.png'),
//   require('../assets/images/splash3.png'),
// ];
// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

// const App = ({navigation}) => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     getUser();
//   }, []);

//   const getUser = async () => {
//     let user = await AsyncStorage.getItem('user');
//     let isDarkMode = await AsyncStorage.getItem('isDarkMode');
//     isDarkMode = isDarkMode == 'true' ? true : false;
//     dispatch(setIsDarkMode(isDarkMode));

//     let first = await AsyncStorage.getItem('setFirst');
//     let second = await AsyncStorage.getItem('setSecond');
//     let solid = await AsyncStorage.getItem('setSolid');
//     let double = await AsyncStorage.getItem('setDouble');

//     // first: '#E60F4E',
//     // second: '#CA6FE4',
//     // solid: '#EC1D94',
//     // double: ['#E60F4E', '#CA6FE4'],

//     if (first == null) {
//       dispatch(setFirst('#E60F4E'));
//     } else {
//       dispatch(setFirst(first));
//     }
//     if (second == null) {
//       dispatch(setSecond('#CA6FE4'));
//     } else {
//       dispatch(setSecond(second));
//     }
//     if (solid == null) {
//       dispatch(setSolid('#EC1D94'));
//     } else {
//       dispatch(setSolid(solid));
//     }
//     if (double == null) {
//       dispatch(setDouble(['#E60F4E', '#CA6FE4']));
//     } else {
//       dispatch(setDouble(JSON.parse(double)));
//     }

//     if (user == null) {
//       // do nothing
//     } else {
//       navigation.replace('GoodMorning');
//     }
//   };

//   const [imgActive, setimgActive] = useState(0);
//   onChange = nativeEvent => {
//     if (nativeEvent) {
//       const slider = Math.ceil(
//         nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
//       );
//       if (slider != imgActive) {
//         setimgActive(slider);
//       }
//     }
//   };
//   const next = () => {
//     navigation.replace('Introduction');
//   };
//   return (
//     <SafeAreaView style={StyleSheet.container}>
//       <View style={styles.wrap}>
//         <View>
//           <ScrollView
//             onScroll={({nativeEvent}) => onChange(nativeEvent)}
//             showsHorizontalScrollIndicator={false}
//             pagingEnabled
//             horizontal
//             style={styles.wrap}>
//             {images.map((e, index) => (
//               <Image
//                 key={e}
//                 resizeMode="contain"
//                 style={{
//                   width: responsiveWidth(90),
//                   height: responsiveHeight(40),
//                   left: 13,
//                   top: 3,
//                 }}
//                 source={e}
//                 // source={{uri: e}}
//               />
//             ))}
//           </ScrollView>
//         </View>
//         <View>
//           <Text style={styles.txt1}>
//             Lorem ipsum dolor sit amet, consetetur sadipscing elitr
//           </Text>
//           <Text style={styles.txt2}>
//             Lorem ipsum dolor sit amet, consetetur sadipscing nonumy magna
//             aliquyam erat, sed diam
//           </Text>
//         </View>

//         <View>
//           <TouchableOpacity style={styles.left}>
//             <Icon name="arrow-left" size={40} color={'white'} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.right} onPress={() => next()}>
//             <Icon name="arrow-right" size={40} color={'white'} />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.wrapDot}>
//           {images.map((e, index) => (
//             <Text
//               key={e}
//               style={imgActive == index ? styles.dotActive : styles.dot}>
//               ●
//             </Text>
//           ))}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   wrap: {
//     width: 300,
//     height: 300,
//     left: 13,
//     top: 3,
//   },
//   wrapDot: {
//     position: 'absolute',
//     // bottom: 0,
//     top: 680,
//     flexDirection: 'row',
//     alignSelf: 'center',
//   },
//   dotActive: {
//     margin: 3,
//     color: 'black',
//   },

//   dot: {
//     margin: 3,
//     color: 'white',
//   },
//   txt1: {
//     top: 30,
//     fontSize: 20,
//     color: '#000000',
//     fontWeight: 'bold',
//     left: 20,
//     alignSelf: 'center',
//     // textAlign: 'center',
//   },
//   txt2: {
//     top: 30,
//     color: '#000000',
//     alignSelf: 'center',
//     textAlign: 'center',
//     opacity: 0.45,

//     left: 20,
//     // backgroundColor: 'red',
//   },
//   left: {
//     width: 80,
//     height: 40,
//     top: 180,
//     backgroundColor: '#cc3366',
//     justifyContent: 'center',
//     // alignSelf:'center',
//     // alignContent:'center',
//     // alignitems: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   right: {
//     width: 80,
//     height: 40,
//     top: 140,
//     left: 250,
//     backgroundColor: '#cc3366',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
// export default App;
