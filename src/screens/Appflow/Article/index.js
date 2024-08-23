import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import MainHeader from "../../../components/MainHeader";
import LinearGradient from "react-native-linear-gradient";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { fontFamily } from "../../../constants/fonts";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { bannerAdID } from "../../../utils/adsKey";
import { FAB, Button, Card } from "react-native-paper";
import { ScratchCard } from "rn-scratch-card"; // Ensure this is the correct import
const ArticleData = [
  {
    id: 1,
    title:
      "Article 1 This is the description for article 1.This is the description for article 1.This is the description for article 1.",
    description:
      "This is the description for article 1 This is the description for article 1.This is the description for article 1.This is the description for article 1.This is the description for article 1.This is the description for article 1..",
  },
  {
    id: 2,
    title: "Article 2",
    description: "This is the description for article 2.",
  },
  {
    id: 3,
    title: "Article 3",
    description: "This is the description for article 3.",
  },
  {
    id: 4,
    title: "Article 4",
    description: "This is the description for article 3.",
  },
  {
    id: 5,
    title: "Article 5",
    description: "This is the description for article 3.",
  },
];

const Article = (props) => {
  const navigation = useNavigation();
  const { double, doubledark, isdarkmode } = useSelector(
    (state) => state.userReducer
  );

  // const [visible, setVisible] = useState(false);
  // const [textVisible, setTextVisible] = useState(false);
  // const handleOpen = () => setVisible(true);
  // const handleClose = () => setVisible(false);
  // const handleScratch = (scratchPercentage) => {
  //   // Show the text when the scratch percentage exceeds a threshold
  //   if (scratchPercentage > 0) {
  //     setTextVisible(true);
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={isdarkmode ? doubledark : double}
        style={styles.linearGradient}
      >
        <MainHeader {...props} headertxt={"Article"} />

        <View style={styles.FlatListcontainer}>
          <FlatList
            data={ArticleData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ArticleDetail", { article: item })
                }
              >
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Floating Action Button */}
        {/* <FAB style={styles.fab} small icon="gift" onPress={handleOpen} /> */}

        {/* Full-Screen Modal */}
        {/* <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={handleClose}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.cardTitle}>Daily Surprise</Text>
                  <Text style={styles.scratchText}>
                    You have won a surprise gift!
                  </Text>

                  <ScratchCard
                    source={require("../../../assets/images/scratch_foreground.png")} // Adjust the path if needed
                    brushWidth={100}
                    onScratch={handleScratch}
                    style={styles.scratchCard}
                  ></ScratchCard>
                  <Button
                    mode="contained"
                    onPress={handleClose}
                    style={styles.closeButton}
                  >
                    Close
                  </Button>
                </Card.Content>
              </Card>
            </View>
          </View>
        </Modal> */}

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

export default Article;

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
    alignSelf: "center",
    marginTop: responsiveHeight(3.5),
  },
  emptytxt: {
    color: "#CFCFCF",
    fontFamily: fontFamily.Poppins_Regular,
    fontSize: responsiveFontSize(2.5),
  },
  txtstyle: {
    fontFamily: fontFamily.Sans_Regular,
    fontSize: responsiveFontSize(2.3),
  },
  FlatListcontainer: {
    flex: 0.99,
    padding: 10,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 100,
    backgroundColor: "#6200ee",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height: "50%",
  },
  card: {
    // flex: 1,
    padding: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  scratchCard: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  scratchContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scratchText: {
    fontSize: 18,
    textAlign: "center",
    position: "absolute",
    backgroundColor: "transparent",
    alignSelf: "center",
    fontSize: 16,
    top: 150,
  },
  closeButton: {
    marginTop: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background_view: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "transparent",
    alignSelf: "center",
    borderRadius: 16,
  },
});

///////////////////////////////////////////////////////////////
// // Article.js
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Modal, SafeAreaView, Image} from 'react-native';

// import { ScratchCard } from 'rn-scratch-card'
// // import ScratchView from 'rn-scratch-card'; // Ensure this is the correct import

// const Article = () => {
//   const [visible, setVisible] = useState(false);

//   const handleOpen = () => setVisible(true);
//   const handleClose = () => setVisible(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.container}>
//       <Image source={require('../../../assets/images/scratch_background.png')} style={styles.background_view} />
//       <ScratchCard
//         source={require('../../../assets/images/scratch_foreground.png')}
//         brushWidth={50}
//         onScratch={handleScratch}
//         style={styles.scratch_card}
//       />
//     </View>
//     </SafeAreaView>
//   );
//   function handleScratch(scratchPercentage) {
//     console.log(scratchPercentage)
//   }
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 16,
//   },
//   background_view: {
//     position: 'absolute',
//     width: 400,
//     height: 400,
//     backgroundColor: 'transparent',
//     alignSelf: 'center',
//     borderRadius: 16,
//   },
//   scratch_card: {
//     width: 400,
//     height: 400,
//     backgroundColor: 'transparent',
//   },
// });

// export default Article;
