import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import Images from "../constants/Image";

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1, paddingTop: 40 }}
    >
      {/* Close Icon */}
      <View style={styles.closeIconContainer}>
        <Ionicons
          name="close"
          size={30}
          color="white"
          onPress={() => props.navigation.closeDrawer()}
        />
      </View>

      {/* User's Name */}
      <View style={styles.userInfoSection}>
        <Text style={styles.greeting}>Hello,</Text>
        <Text style={styles.username}>Thomas K. Wilson</Text>
      </View>

      {/* Drawer Items */}
      <View style={styles.drawerItemsSection}>
        <DrawerItem
          label="Home"
          icon={() => (
            <Image
              source={Images.home} // Path to your image
              style={{ width: 24, height: 24 }} // Adjust size according to your needs
              resizeMode="contain"
            />
          )}
          onPress={() => props.navigation.navigate("MainStackScreen")}
          labelStyle={styles.drawerLabel}
        />

        <DrawerItem
          label="My Account"
          icon={() => (
            <Image
              source={Images.User} // Path to your image
              style={{ width: 24, height: 24 }} // Adjust size according to your needs
              resizeMode="contain"
            />
          )}
          onPress={() => props.navigation.navigate("MyAccount")}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Setting"
          icon={() => (
            <Image
              source={Images.Settings} // Path to your image
              style={{ width: 24, height: 24 }} // Adjust size according to your needs
              resizeMode="contain"
            />
          )}
          onPress={() => props.navigation.navigate("SettingStackNavigator")}
          labelStyle={styles.drawerLabel}
        />
        <DrawerItem
          label="Help"
          icon={() => (
            <Image
            source={Images.QuestionCircle} // Path to your image
            style={{ width: 24, height: 24 }} // Adjust size according to your needs
            resizeMode="contain"
          />
          )}
          onPress={() => props.navigation.navigate("Help")}
          labelStyle={styles.drawerLabel}
        />
      </View>

      {/* Get Premium Button */}
      <View style={styles.premiumButtonSection}>
        <TouchableOpacity
          style={styles.premiumButton}
          onPress={() => alert("Go to Premium clicked!")}
        > 
          <Image
              source={Images.CrownLine} // Path to your image
              
            />
          <Text style={styles.premiumButtonText}>Go to Premium</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  closeIconContainer: {
    marginTop: 50,
    marginLeft: 20,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: "white",
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  drawerItemsSection: {
    flex: 1,
    paddingTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    color: "white",
  },
  premiumButtonSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems:'center',
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 35,
  },
  premiumButtonText: {
    color: "#ffcc00",
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "900",
  },
});

export default CustomDrawerContent;
