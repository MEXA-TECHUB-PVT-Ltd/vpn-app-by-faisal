import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import RBSheet from "react-native-raw-bottom-sheet";
import CustomHeader from "../components/CustomHeader";
import Button from "../components/Button";

import { useNavigation } from "@react-navigation/native";
import CustomModal from "../components/CustomModal";
import Images from "../constants/Image";
import { useIsFocused } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import CustomSnackbar from "../components/CustomSnackbar";

const MyAccount = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("Thomas K. Wilson");
  const [email, setEmail] = useState("thomas.abc.inc@gmail.com");
  const refRBSheet = useRef();
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [FillFieldData, setFillFieldData] = useState("");
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



useEffect(() => {
  if (userDetail) {
    setFullName(userDetail?.name);
  }
}, [userDetail]);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = auth().currentUser;
      // console.log('current user', user)
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
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
  // Reset shouldUpdate after fetching user details
  if (shouldUpdate) {
    setShouldUpdate(false);
  }
}, [isFocused, shouldUpdate]);

console.log("USER DATA-----------", userDetail);











const dismissSnackbar = () => {
  setsnackbarVisible(false);
};
const handleUpdatePassword = async () => {
  setsnackbarVisible(true);
  setTimeout(() => {
    setsnackbarVisible(false);
  }, 3000);
};
  const handleSave = async () => {
    // Retrieve the current user UID
    const user = auth().currentUser;

    if (!user) {
      // Handle case when no user is signed in
      console.error("No user is currently signed in.");
      return;
    }
    const userId = user.uid;
    setLoading(true);

    try {
      // Update the user's profile details in Firestore
      await firestore().collection("users").doc(userId).update({
        name: fullName,
      });
      setFillFieldData("Profile updated successfully!");
      // Optionally, show a success message or navigate to another screen
      setShouldUpdate(true);
      refRBSheet.current.close();
      handleUpdatePassword();
    } catch (error) {
      console.log("Error updating profile: ", error);
      setFillFieldData("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 



  const openLogoutModal = () => {
    setModalVisible(true);
  };

  const closeLogoutModal = () => {
    setModalVisible(false);
  };

  const handleLogout = async () => {
    // Implement your logout logic here
    console.log("User logged out");
    try {
      await auth().signOut(); // Firebase sign-out
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

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
        middleComponent={<Text style={styles.headerTitle}>My Account</Text>}
        rightComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate("SettingStackNavigator")}
          >
            <Image source={Images.buttonIcon} />
          </TouchableOpacity>
        }
      />

      <CustomModal
        visible={modalVisible}
        onClose={closeLogoutModal}
        image={Images.Logout} // Using the logout image here
        title="Are you sure to logout?"
        description="" // No description needed
        onConfirm={handleLogout} // Log out when "Yes" is pressed
        onCancel={closeLogoutModal} // Close the modal when "Cancel" is pressed
      />

      <View style={styles.accountUserContainer}>
        <View style={styles.userInfoContainer}>
          <View style={{width:'90%',}}>
            <Text style={styles.userName}>{userDetail?.name}</Text>
            <Text style={styles.userEmail}>{userDetail?.email}</Text>
          </View>


          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={{ marginLeft: 6, }}
          >
            <Icon name="edit" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.accountInfoContainer}>
        <View style={styles.accountDetails}>
          <Text  style={styles.detailText}>My ID: AH_289212</Text>
          <Text style={styles.detailText}>My IP: 161.108.85.23</Text>
          <Text style={styles.detailText}>Type: FREE</Text>
        </View>
      </View>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          margin: 20,
        }}
      >
        <TouchableOpacity
          style={styles.premiumButton}
          onPress={() => alert("Go to Premium")}
        >
          <Icon name="star" size={20} color="white" />
          <Text style={styles.premiumText}>Go to Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.premiumButton, { backgroundColor: "gray" }]}
          onPress={openLogoutModal}
        >
          <Image source={Images.Logout} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
message='Success'
messageDescription='Profile updated successfully'
onDismiss={dismissSnackbar} // Make sure this function is defined
visible={snackbarVisible}
/>
      <RBSheet
        ref={refRBSheet}
        height={300}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#1c161b",
            padding: 20,
          },
        }}
      >
        <Text style={styles.sheetTitle}>Change User Information</Text>
        {FillFieldData ? (
          <Text style={styles.errorText}>{FillFieldData}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={userDetail?.email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#888"
          editable={false}
        />
        <Text style={styles.EmailEdit}>You can't edit your email</Text>
        <View style={styles.sheetButtonsContainer}>
          <Button
            title="Cancel"
            onPress={() => refRBSheet.current.close()}
            style={styles.cancelButton}
          />
          <Button title="Save" onPress={handleSave} style={styles.saveButton} />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c161b",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    color: "orange",
    fontSize: 25,
    fontWeight: "bold",
  },
  accountUserContainer: {
    backgroundColor: "orange",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  accountInfoContainer: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  userInfoContainer: {
    marginBottom: 1,
    flexDirection: "row",
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    color: "white",
    fontSize: 16,
  },
  accountDetails: {
    marginTop: 10,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },

  signOutButton: {
    backgroundColor: "#ff4d4d",
    marginBottom: 20,
  },
  sheetTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  EmailEdit: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  sheetButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#888",
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "orange",
    flex: 1,
    marginLeft: 10,
  },
  premiumButton: {
    backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 30,
    // marginHorizontal: 10,
    marginBottom: 30,
  },
  premiumText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutText: {
    color: "#FF6347",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
  },
});

export default MyAccount;
