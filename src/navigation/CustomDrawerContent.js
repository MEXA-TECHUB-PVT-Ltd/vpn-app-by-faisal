import React,{useEffect,useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

import Ionicons from "react-native-vector-icons/Ionicons";
import Animated from "react-native-reanimated";
import Images from "../constants/Image";
import { useIsFocused } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const CustomDrawerContent = (props) => {
  const isFocused = useIsFocused();
  const [userDetail, setUserDetail] = useState(null);
  const [activeItem, setActiveItem] = useState('MainStackScreen');
  const handlePress = (itemName) => {
    setActiveItem(itemName);
    props.navigation.navigate(itemName);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection("users")
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setUserDetail(userDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

  }, [isFocused]);


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
        <Text style={styles.username}>{userDetail?.name || userDetail?.displayName|| '' } </Text>
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
          onPress={() => handlePress("MainStackScreen")}
          // onPress={() => props.navigation.navigate("MainStackScreen")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === "MainStackScreen" && styles.activeDrawerItem,
          ]}
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
          onPress={() => handlePress("MyAccount")}
          // onPress={() => props.navigation.navigate("MyAccount")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === "MyAccount" && styles.activeDrawerItem,
          ]}
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
          onPress={() => handlePress("SettingStackNavigator")}
          // onPress={() => props.navigation.navigate("SettingStackNavigator")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === "SettingStackNavigator" && styles.activeDrawerItem,
          ]}
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
          onPress={() => handlePress("Help")}
          // onPress={() => props.navigation.navigate("Help")}
          labelStyle={styles.drawerLabel}
          style={[
            styles.drawerItem,
            activeItem === "Help" && styles.activeDrawerItem,
          ]}
        />
      </View>

      {/* Get Premium Button */}
      <View style={styles.premiumButtonSection}>
        <TouchableOpacity
          style={styles.premiumButton}
          onPress={() => props.navigation.navigate('GetPremiumScreen')}
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
    // marginTop: 20,
    marginLeft: 20,
    marginBottom:60
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  username: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  drawerItemsSection: {
    flex: 1,
    paddingTop: 20,
  },
  drawerLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    paddingTop:2,
    fontFamily: "Poppins-SemiBold",
  },
  drawerItem: {
    backgroundColor: "transparent", // Default background
    borderLeftWidth: 0, // Default border
  },
  activeDrawerItem: {
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Light white background for active item
    borderLeftWidth: 4, // Add a white left border for active item
    borderLeftColor: "#FFFFFF",
  },

  premiumButtonSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems:'center',
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
