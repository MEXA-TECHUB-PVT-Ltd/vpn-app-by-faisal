import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MainHeader from '../../../components/MainHeader';
import LinearGradient from 'react-native-linear-gradient';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
  } from "react-native-google-mobile-ads";
  import EmojiModal from 'react-native-emoji-modal';
const ArticleDetail = ({ route, navigation }) => {
  const { article } = route.params;

  const {
    double,
    doubledark,
    isdarkmode,
  } = useSelector(state => state.userReducer);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}
      >
        <MainHeader navigation={navigation} headertxt={'Article Details'} />

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{article.title}</Text>

          <View
          style={{
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>

          <Text style={styles.description}>{article.description}</Text>
        </View>
        {/* <EmojiModal onEmojiSelected={(emoji) => {}} /> */}
        <View
          style={{
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  contentContainer: {
    flex: 0.99,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color:'#fff'
  },
  description: {
    fontSize: 16,
    marginTop:20,
    marginBottom: 20,
    textAlign: 'justify',
     color:"#EEEEEE"
  },
});

export default ArticleDetail;
