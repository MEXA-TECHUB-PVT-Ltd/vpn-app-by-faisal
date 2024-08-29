
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient  from 'react-native-linear-gradient'; // Use expo-linear-gradient or react-native-linear-gradient
import { useNavigation } from '@react-navigation/native';
import Images from "../constants/Image";

const CustomDrawer = () => {
    const [showMenu, setShowMenu] = useState(false);
    const moveToRight = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const navigation = useNavigation();

  const toggleMenu = () => {
    Animated.timing(scale, {
      toValue: showMenu ? 1 : 0.7,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(moveToRight, {
      toValue: showMenu ? 0 : 200,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setShowMenu(!showMenu);
  };

  const navigateToScreen = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#f5d002', '#fcb755']}
        style={styles.drawerContainer}
      >
        {/* <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
          <Image source={require('../assets/close.png')} style={styles.closeIcon} />
        </TouchableOpacity> */}
        <Text style={styles.greetingText}>Hello,{"\n"}Thomas K. Wilson</Text>
        <DrawerItem
          title="Home"
          icon={require('../assets/images/Home.png')} // Replace with actual icon source
          onPress={() => navigateToScreen('Home')}
        />
        <DrawerItem
          title="My Account"
          icon={require('../assets/images/UserCircle.png')} // Replace with actual icon source
          onPress={() => navigateToScreen('MyAccount')}
        />
        <DrawerItem
          title="Setting"
          icon={require('../assets/images/Settings.png')} // Replace with actual icon source
          onPress={() => navigateToScreen('Settings')}
        />
        <DrawerItem
          title="Help"
          icon={require('../assets/images/QuestionCircle.png')} // Replace with actual icon source
          onPress={() => navigateToScreen('Help')}
        />
        <TouchableOpacity style={styles.premiumButton}>
          <Text style={styles.premiumButtonText}>Go to Premium</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "white",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          transform: [{ translateX: moveToRight }, { scale: scale }],
          borderRadius: showMenu ? 20 : 0,
        }}
      >
        <View style={{ flexDirection: "row", marginTop: 50 }}>
          <TouchableOpacity
            style={{ marginLeft: 20 }}
            onPress={toggleMenu}
          >
            <Image source={Images.DrawerMenu} />
          </TouchableOpacity>
        </View>
        {/* Main Content goes here */}
      </Animated.View>
    </View>
  );
};

const DrawerItem = ({ title, icon, onPress }) => (
  <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
    <Image source={icon} style={styles.icon} />
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    // justifyContent: 'space-between',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  closeIcon: {
    width: 24,
    height: 24,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 50,
    marginVertical:50
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    color: "white",
  },
  premiumButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 15,
    width:'60%',
    paddingHorizontal: 10,
    alignItems: 'center',
    // marginBottom: 20,
    marginTop:200
  },
  premiumButtonText: {
    color: '#f6ad42',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
