import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CustomHeader from "../components/CustomHeader";
import Images from "../constants/Image";

const SettingsScreen = ({ navigation }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] =
    React.useState(false);

  const toggleSwitch = () =>
    setIsNotificationEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <CustomHeader
        leftComponent={
          <TouchableOpacity
            // onPress={() => navigation.openDrawer()}
            onPress={() => navigation.toggleDrawer()} 
            style={{ backgroundColor: "#6D6C69", borderRadius: 30, padding: 8 }}
          >
             <Image source={Images.DrawerMenu} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text style={{ color: "orange", fontSize: 30, fontFamily: "Poppins-Bold", }}>
            Setting
          </Text>
        }
      />

      <View style={styles.content}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notification</Text>
          <Switch
            trackColor={{ false: "#767577", true: "orange" }}
            thumbColor={isNotificationEnabled ? "#fff" : "#f4f3f4"}
            onValueChange={toggleSwitch}
            value={isNotificationEnabled}
          />
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("TermServices")}
        >
          <Text style={styles.settingText}>Term of Service</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#DBD6CE" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <Text style={styles.settingText}>Privacy Policy</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#DBD6CE" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("AboutApp")}
        >
          <Text style={styles.settingText}>About App</Text>
          <Icon name="keyboard-arrow-right" size={24} color="#DBD6CE" />
        </TouchableOpacity>

        {/* <View style={styles.dottedBox}>
              
                </View> */}
      </View>
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={() => navigation.navigate("ChangePasswordScreen")}
        >
          <Text style={styles.changePasswordText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c161b",
    paddingVertical:15,
    paddingHorizontal:15
  },
  content: {
    paddingHorizontal: 5,
    paddingVertical: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingText: {
    color: "#DBD6CE",
    fontSize: 16,
    fontFamily: "Poppins-Medium", 
  },
  dottedBox: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    borderStyle: "dashed",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
  },
  changePasswordButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  changePasswordText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
});

export default SettingsScreen;
