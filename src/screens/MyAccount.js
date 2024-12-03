import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
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
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccount = ({ myId = "AH_282912", myIp = "116.108.85.23" }) => {
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
  const [snackbarVisible1, setsnackbarVisible1] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [copiedValue, setCopiedValue] = useState(''); 
  const [vpnData, setVpnData] = useState(null);

  useEffect(() => {
    if (userDetail) {
      setFullName(userDetail?.name);
    }
  }, [userDetail]);


  const getStoredVpnData = async () => {
    try {
      const storedVpn = await AsyncStorage.getItem('selectedVpndata');
      if (storedVpn !== null) {
        setVpnData(JSON.parse(storedVpn) || ''); // Set the retrieved VPN data
      
        console.log('VPN data retrieved successfully',storedVpn);
      }
    } catch (error) {
      console.error('Error retrieving VPN data', error);
    }
  };
  
  // Call the getStoredVpnData inside useEffect to load stored VPN on component mount
  useEffect(() => {
    getStoredVpnData(); // Retrieve VPN data when component mounts
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

  const copyToClipboard = (value, label) => {
    Clipboard.setString(value); // Set the value to the clipboard
    console.log('value copy ', value, label)
    // Alert.alert(`${label} copied`, `${value} has been copied to clipboard`);
    setCopiedValue(value);
    handleCopy();
   
  };
  const dismissSnackbar1 = () => {
    setsnackbarVisible1(false);
  };
  const handleCopy = async () => {
    setsnackbarVisible1(true);
    setTimeout(() => {
      setsnackbarVisible1(false);
    }, 3000);
  };
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
          <View style={{ width: "90%" }}>
            <Text style={styles.userName}>{userDetail?.name}</Text>
            <Text style={styles.userEmail}>{userDetail?.email}</Text>
          </View>

          <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            style={{ marginLeft: 6 }}
          >
            <Icon name="edit" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.accountInfoContainer}>
      {/* <View style={styles.infoRow}>
        <Text style={styles.detailText}>My ID :</Text>
        <Text style={styles.detailValue}>{myId}</Text>
        <TouchableOpacity onPress={() => copyToClipboard(myId, "ID")}>
        <Image source={Images.Copy} />
     
        </TouchableOpacity>
      </View> */}
      {vpnData ? (
        <>
          <View style={styles.infoRow}>
        <Text style={styles.detailText}>My IP :</Text>
        <Text style={styles.detailValue}>{vpnData.IP}</Text>
        <TouchableOpacity onPress={() => copyToClipboard(vpnData.IP, "IP")}>
        <Image source={Images.Copy} />
       
        </TouchableOpacity>
      </View>
        </>
      ) : (
        <>
          <View style={styles.infoRow}>
        <Text style={styles.detailText}>My IP :</Text>
        
      </View>
        </>
      )}
     
      <View style={styles.infoRow}>
        <Text style={styles.detailText}>Type :</Text>
        <Text style={styles.premiumText}>PREMIUM</Text>
        <Text style={styles.daysLeft}>240 days left</Text>
      </View>
    </View>
      {/* <View style={styles.accountInfoContainer}>
        <View style={styles.accountDetails}>
          <Text style={styles.detailText}>My ID: AH_289212</Text>
          <Text style={styles.detailText}>My IP: 161.108.85.23</Text>
          <Text style={styles.detailText}>Type: FREE</Text>
        </View>
      </View> */}

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
          onPress={() => navigation.navigate('GetPremiumScreen')}
        >
           <Image source={Images.Vector} />
          <Text style={styles.GetpremiumText}>Go to Premium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.premiumButton, { backgroundColor: "#FFFFFF33" }]}
          onPress={openLogoutModal}
        >
          <Image source={Images.Logout} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="Profile updated successfully"
        onDismiss={dismissSnackbar} // Make sure this function is defined
        visible={snackbarVisible}
      />
      <CustomSnackbar
        message="Success" 
        messageDescription={`${copiedValue} has been copied to clipboard`}
        onDismiss={dismissSnackbar1} // Make sure this function is defined
        visible={snackbarVisible1}
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
    fontFamily: "Poppins-Bold",
  },
  accountUserContainer: {
    backgroundColor: "orange",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 20,
    height:hp('12%')
  },
  // accountInfoContainer: {
  //   backgroundColor: "#333",
  //   borderRadius: 10,
  //   padding: 20,
  //   marginVertical: 20,
  // },

  accountInfoContainer: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    
  },
  detailText: {
    color: '#DBD6CE',
    fontSize: 14,
    marginRight: 10,
    fontFamily: "Poppins-Medium",
  },
  detailValue: {
    color: '#DBD6CE',
    fontSize: 14,
    flex: 1, 
    fontFamily: "Poppins-Regular",
  },
  premiumText: {
    color: '#FFC107', // Premium yellow color
    fontSize: 14,
    fontFamily: "Poppins-Bold",
    marginRight: 10,
    paddingTop:4
  },
  daysLeft: {
    color: '#DBD6CE',
    fontSize: 14,
  },
  copyIcon: {
    width: 20,  // Set the width of the copy icon
    height: 20, // Set the height of the copy icon
  },












  userInfoContainer: {
    marginBottom: 1,
    flexDirection: "row",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  userEmail: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  accountDetails: {
    marginTop: 10,
  },
  // detailText: {
  //   color: "#FFFFFF",
  //   fontSize: 16,
  //   marginBottom: 10,
  //   fontFamily: "Poppins-Regular",
  // },

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
    paddingVertical: 10,
    borderRadius: 30,
    // marginHorizontal: 10,
    marginBottom: 30,
  },
  GetpremiumText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 16,
    paddingTop:4,
    fontFamily: "Poppins-Bold",
  },
  logoutText: {
    color: "#FF6347",
    marginLeft: 10,
    fontSize: 16,
    paddingTop:3,
    fontFamily: "Poppins-Bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
  },
});

export default MyAccount;
