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
import React, {useState, useEffect} from 'react';
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
import Pdf from 'react-native-pdf';
import Loader from '../../../components/Loader/Loader';
import {api} from '../../../constants/api';
import Snackbar from 'react-native-snackbar';
import {BASE_URL_IMAGE} from '../../../constants/BASE_URL_IMAGE';
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import {bannerAdID, fullScreenAdId} from '../../../utils/adsKey';
import {useRef} from 'react';

const adUnitId = fullScreenAdId;

const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

const Book_Name_here = props => {
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
  const [markedDates, setMarkedDates] = useState();
  const [selectedDate, setSelectedDate] = useState('');
  const [textdate, setTextdate] = useState('');

  const [name, setName] = useState('');
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const [totalPages, setTotalPages] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    getBookDetail(props?.route?.params?.id);
    return () => {};
  }, [props?.route?.params]);

  const getBookDetail = async id => {
    setLoading(true);
    var headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    await fetch(api.get_book_detail, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        book_id: id,
      }),
    })
      .then(response => response.json())
      .then(async response => {
        if (response[0]?.error == false) {
          setName(response[0]?.data[0]?.book_detail?.name);
          setUrl(
            BASE_URL_IMAGE + '/' + response[0]?.data[0]?.book_detail?.link,
          );
        } else {
          Snackbar.show({
            text: response[0]?.message,
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: 'red',
          });
        }
      })
      .catch(error => {
        console.log('Error catch   :  ', error);
        Snackbar.show({
          text: 'Something went wrong.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: 'red',
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  // __________________________Full Screen Ad ___________________________________________
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
        console.log('ad loaded......');
        interstitial.load();
      },
    );

    // Start loading the interstitial straight away
    interstitial.load();

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);

  // calculate screen time
  const [screenTime, setScreenTime] = useState(0);
  const [isShown, setIsShown] = useState(false);
  let screenTimerRef = null;
  useEffect(() => {
    screenTimerRef = setInterval(() => {
      setScreenTime(prevTime => prevTime + 1);
    }, 1000); // Update screen time every second (1000 milliseconds)

    return () => clearInterval(screenTimerRef); // Clean up the timer when the component unmounts or changes
  }, []);

  useEffect(() => {
    //ad will display after two minutes
    if (screenTime >= 120) {
      // Display the ad when screen time reaches 2 minutes (120 seconds)
      if (isShown == false) {
        setIsShown(true);
        interstitial.show();
        clearInterval(screenTimerRef);
      }
    }
  }, [screenTime]);

  // __________________________Full Screen Ad ___________________________________________

  const getSelectedDayEvents = date => {
    let markedDates = {};
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    let serviceDate = moment(date);
    serviceDate = serviceDate.format('DD.MM.YYYY');
    setSelectedDate(serviceDate);
    setMarkedDates(markedDates);
    setTextdate(moment(date).format('ddd, MMMM YY'));
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.floatingbutton}></View>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}>
        <MainHeader
          {...props}
          headertxt={name}
          currentPage={currentPage}
          totalPages={totalPages}
        />

        <View
          style={{
            flex: 1,
            height: responsiveHeight(100),
            width: responsiveWidth(100),
          }}>
          <Pdf
            trustAllCerts={false}
            horizontal
            enablePaging
            // source={require('../../../assets/pdfFiles/sample.pdf')}
            source={{
              uri: url,
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              setTotalPages(numberOfPages);
              setIsLoaded(true);
            }}
            onPageChanged={(page, numberOfPages) => {
              setCurrentPage(page);
            }}
            onError={error => {
              // if (isLoaded) {
              //   Snackbar.show({
              //     text: 'Something went wrong.Unable to open file',
              //     duration: Snackbar.LENGTH_LONG,
              //     backgroundColor: 'red',
              //   });
              // }
            }}
            onPressLink={uri => {
              console.log(`Link pressed: ${uri}`);
            }}
            renderActivityIndicator={() => {
              return <Loader />;
            }}
            style={{
              flex: 1,
              height: responsiveHeight(100),
              width: responsiveWidth(100),
              backgroundColor: 'transparent',
            }}
          />

          <View
            style={{
              alignSelf: 'center',
              marginTop: 20,
              position: 'absolute',
              bottom: 0,
            }}>
            <BannerAd
              unitId={bannerAdID}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        </View>

        {/* <Text style={{margin: 10, fontSize: 15, color: 'white'}}>
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
          amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
          At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
          kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
          amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
          diLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
          sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
          dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
          et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
          takimata sanctus est Lorem ipsum dolor sit amet. eirmod tempor
          invidunt utvoluptua. At vero eos et accusam et justo duo dolores et ea
          rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
          ipsum dam nonumy eirmod tempor invidunt ut labore et dolore magna
          aliquyam erat, sed diam voluptua
        </Text> */}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Book_Name_here;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollviewcontainer: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradient: {
    flex: 1,
    // alignItems: 'center',
    // paddingHorizontal: responsiveWidth(10),
    // zIndex: 1,
  },
});
