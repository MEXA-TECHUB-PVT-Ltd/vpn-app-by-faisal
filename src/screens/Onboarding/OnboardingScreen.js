import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import Images from "../../constants/Image";

const Dots = ({ selected }) => {
  let backgroundColor = selected ? "rgba(255, 165, 0, 0.8)" : "white";
  let width = selected ? 30 : 10; // Set width based on selection

  return (
    <View
      style={{
        width, // Dynamically set width
        height: 10, // Height remains the same
        marginHorizontal: 3,
        backgroundColor,
        borderRadius: 10, // Rounded corners
      }}
    />
  );
};

const Skip = ({ ...props }) => (
  <TouchableOpacity
    style={{
      marginHorizontal: 10,
      backgroundColor: "#FF9900", // Button background color
      borderRadius: 20, // Rounded corners
      paddingVertical: 8,
      paddingHorizontal: 15,
    }}
    {...props}
  >
    <Text style={styles.NextStyle}>Skip</Text>
  </TouchableOpacity>
);

const Next = ({ ...props }) => (
  <TouchableOpacity
    style={{
      marginHorizontal: 10,
      backgroundColor: "#FF9900", // Button background color
      borderRadius: 20, // Rounded corners
      paddingVertical: 8,
      paddingHorizontal: 15,
    }}
    {...props}
  >
    <Text style={styles.NextStyle}>Next</Text>
  </TouchableOpacity>
);

const Done = ({ ...props }) => (
  <TouchableOpacity
    style={{
      marginHorizontal: 10,
      backgroundColor: "#FF9900", // Button background color
      borderRadius: 20, // Rounded corners
      paddingVertical: 8,
      paddingHorizontal: 15,
    }}
    {...props}
  >
    <Text style={styles.NextStyle}>Done</Text>
  </TouchableOpacity>
);

const OnboardingScreen = () => {
  const navigation = useNavigation();
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("LoginScreen")}
      onDone={() => navigation.replace("LoginScreen")}
      pages={[
        {
          backgroundColor: "#1c161b",
          image: <Image source={Images.slider1} style={styles.imamgestyle} />,
          title: "Many prestigious awards",
          subtitle: "Trusted by over 4 million users.",
          titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
          subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular", fontSize:14,},
        },
        {
          backgroundColor: "#1c161b",
          image: <Image source={Images.slider2}  style={styles.imamgestyle}/>,
          title: "Safe and Secured",
          subtitle: "Military-Grade Encryption.",
          titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
          subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular", fontSize:14, },
        },
        {
          backgroundColor: "#1c161b",
          image: <Image source={Images.slider3}  style={styles.imamgestyle}/>,
          title: "Global Server Coverage",
          subtitle: "Supports over 1 million servers worldwide.",
          titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
          subTitleStyles: { color: "#FFAD33" , fontFamily: "Poppins-Regular", fontSize:14,},
        },
        {
          backgroundColor: "#1c161b",
          image: <Image source={Images.slider4}  style={styles.imamgestyle}/>,
          title: "24/7 Customer Support",
          subtitle: "Caring help whenever you need.",
          titleStyles: { color: "#FF9900", fontFamily: "Poppins-SemiBold", fontSize:18, },
          subTitleStyles: { color: "#FFAD33", fontFamily: "Poppins-Regular" , fontSize:14,},
        },
      ]}
    />
  );
};

export default OnboardingScreen;
const styles = StyleSheet.create({
  NextStyle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    paddingTop: 3,
  },
  imamgestyle:{
    height:hp('32%'), width:wp('65%')
  }
});
