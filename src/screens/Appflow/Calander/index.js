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
import {useFocusEffect} from '@react-navigation/native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {bannerAdID} from '../../../utils/adsKey';

const Calandar = props => {
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
  const [dateapi, setdateapi] = useState('');

  const [selectedDateObj, setSelectedDateObj] = useState('');
  const [toDayDate, setToDayDate] = useState(
    moment(new Date()).format('DD-MM-YYYY'),
  );

  const [formatedDate, setformatedDate] = useState(
    moment(new Date()).format('DD-MM-YYYY'),
  );

  useFocusEffect(
    React.useCallback(() => {
      getSelectedDayEvents(moment(new Date()).format('YYYY-MM-DD'));
    }, []),
  );

  const getSelectedDayEvents = date => {
    setSelectedDateObj(date);
    setformatedDate(moment(date).format('DD-MM-YYYY'));

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
        <MainHeader {...props} headertxt={'Daily Journal'} />
        <ScrollView contentContainerStyle={styles.scrollviewcontainer}>
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
            {formatedDate !== '' ? (
              <>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: fontFamily.Sans_Regular,
                    fontSize: responsiveFontSize(2.3),
                  }}>
                  {textdate}
                </Text>
                {formatedDate == toDayDate && (
                  <TouchableOpacity
                    activeOpacity={0.65}
                    onPress={() =>
                      props.navigation.navigate('WriteNotes', {
                        date: textdate,
                        dateapi: dateapi,
                        formatedDate: formatedDate,
                      })
                    }>
                    <Image
                      source={appImages.whiteeditpencil}
                      style={{
                        width: responsiveWidth(5.5),
                        height: responsiveWidth(5.5),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </>
            ) : null}
          </View>
          <Calendar
            style={{
              width: responsiveWidth(88),
              alignSelf: 'center',
            }}
            enableSwipeMonths
            //   initialDate="2022-04-01"
            onMonthChange={item => {
              console.log('THE MONTHS', item);
            }}
            onVisibleMonthsChange={item => {
              console.log('THE MONTHS VISIBLE', item);
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: isdarkmode ? soliddark : solid,
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: isdarkmode ? soliddark : solid,
              selectedDotColor: '#ffffff',
              arrowColor: 'orange',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: 'blue',
              indicatorColor: 'blue',
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
            markedDates={markedDates}
            onDayPress={day => {
              getSelectedDayEvents(day.dateString);
              setdateapi(day.dateString);
            }}
            hideExtraDays={true}
          />

          <View
            style={{
              alignSelf: 'center',
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
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Calandar;

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
