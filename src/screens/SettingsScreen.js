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
            style={{ backgroundColor: "gray", borderRadius: 30, padding: 8 }}
          >
             <Image source={Images.DrawerMenu} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text style={{ color: "orange", fontSize: 30, fontWeight: "700" }}>
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
          <Icon name="keyboard-arrow-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          <Text style={styles.settingText}>Privacy Policy</Text>
          <Icon name="keyboard-arrow-right" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => navigation.navigate("AboutApp")}
        >
          <Text style={styles.settingText}>About App</Text>
          <Icon name="keyboard-arrow-right" size={24} color="white" />
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
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingText: {
    color: "white",
    fontSize: 16,
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
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  changePasswordText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
