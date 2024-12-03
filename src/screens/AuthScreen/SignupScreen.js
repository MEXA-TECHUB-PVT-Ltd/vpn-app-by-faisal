// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Button from '../../components/Button';

// const SignupScreen = ({ navigation }) => {
//     const [fullName, setFullName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [agreeTerms, setAgreeTerms] = useState(false);

//     const handleSignup = () => {
//         console.log('signup press')
//         // Add signup logic here
//     };

//     return (
//         <ScrollView contentContainerStyle={styles.container}>
//             <Text style={styles.title}>Sign Up</Text>
//             <View style={styles.inputContainer}>
//                 <Text style={styles.checkboxLabel}>Full Name</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Full Name"
//                     placeholderTextColor="#888"
//                     value={fullName}
//                     onChangeText={setFullName}
//                 />
//                 <Text style={styles.checkboxLabel}>Email</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Email"
//                     placeholderTextColor="#888"
//                     value={email}
//                     onChangeText={setEmail}
//                     keyboardType="email-address"
//                 />
//                 <Text style={styles.checkboxLabel}>Password</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Enter Password"
//                     placeholderTextColor="#888"
//                     value={password}
//                     onChangeText={setPassword}
//                     secureTextEntry
//                 />
//                  <Text style={styles.checkboxLabel}>Confirm Password</Text>
//                 <TextInput
//                     style={styles.input}
//                     placeholder="Confirm Password"
//                     placeholderTextColor="#888"
//                     value={confirmPassword}
//                     onChangeText={setConfirmPassword}
//                     secureTextEntry
//                 />
//             </View>
//             <View style={styles.checkboxContainer}>
//                 <CheckBox
//                     value={agreeTerms}
//                     onValueChange={setAgreeTerms}
//                     boxType="square"
//                     tintColors={{ true: 'orange', false: '#888' }}
//                     style={styles.checkbox}
//                 />
//                 <Text style={styles.checkboxLabel}>
//                     I agree with <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
//                 </Text>
//             </View>
//             <Button
//                 title="Register"
//                 onPress={handleSignup}
//                 disabled={!agreeTerms}
//                 style={{ backgroundColor: agreeTerms ? 'orange' : '#888' }}
//             />
//             {/* <TouchableOpacity
//                 style={[styles.button, { backgroundColor: agreeTerms ? 'orange' : '#888' }]}
//                 onPress={handleSignup}
//                 disabled={!agreeTerms}
//             >
//                 <Text style={styles.buttonText}>Register</Text>
//             </TouchableOpacity> */}
//             <View style={styles.socialLoginContainer}>
//                 <Text style={styles.orText}>Or sign up with</Text>
//                 <Icon
//                     name="google-plus-circle"

//                     size={40}
//                     color='white'

//                     onPress={() => {}}
//                 >

//                 </Icon>
//             </View>
//             <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
//                 <Text style={styles.signInText}>
//                 Have an account? <Text style={styles.linkText}>Sign In</Text>
//                 </Text>
//             </TouchableOpacity>
//         </ScrollView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flexGrow: 1,
//         padding: 20,
//         backgroundColor: '#1c161b',
//     },
//     title: {
//         fontSize: 32,
//         color: 'orange',
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     inputContainer: {
//         marginBottom: 20,
//     },
//     input: {
//         backgroundColor: '#333',
//         color: 'white',
//         padding: 10,
//         borderRadius: 10,
//         marginBottom: 15,
//         fontSize: 16,
//     },
//     checkboxContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     checkbox: {
//         alignSelf: 'center',
//     },
//     checkboxLabel: {
//         color: 'white',
//         fontSize: 12,
//         // marginLeft: 10,
//     },
//     linkText: {
//         color: 'orange',
//         fontWeight: 'bold',
//     },
//     button: {
//         padding: 15,
//         borderRadius: 30,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     socialLoginContainer: {
//         marginVertical: 20,
//         alignItems: 'center',
//     },
//     orText: {
//         color: 'white',
//         fontSize: 14,
//         marginBottom: 10,
//     },
//     signInText: {
//         color: 'white',
//         textAlign: 'center',
//         marginTop: 20,
//     },
// });

// export default SignupScreen;

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { TextInput as PaperTextInput } from "react-native-paper";
import Button from "../../components/Button";
import Images from "../../constants/Image";
import DeviceInfo from "react-native-device-info";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";
import { firebase } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import CustomSnackbar from "../../components/CustomSnackbar";
import { useIsFocused } from "@react-navigation/native";


const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [falshMessage, setFlashMessage] = useState(false);
  const [FillFieldData, setFillFieldData] = useState(null);
  const [PasswordNotMatch, setPasswordNotMatch] = useState(null);
  const [falshMessageData, setFlashMessageData] = useState(null);
  const [GoogleMessageData, setGoogleMessageData] = useState(null);
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [deviceId, setDeviceId] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        // Fetch the device ID
        const id = await DeviceInfo.getUniqueId();
        // Check if id is an object and extract the value
        if (id && typeof id === "object" && "_j" in id) {
          setDeviceId(id._j); // Extract the device ID
        } else {
          setDeviceId(id); // If it's a plain string, set it directly
        }
        console.log("Device ID fetched:", id);
      } catch (error) {
        console.error("Failed to fetch device ID:", error);
      }
    };

    fetchDeviceId();
  }, []); // Dependency array


  useEffect(()=>{
    console.log('test')
    GoogleSignin.configure({
      webClientId:
        "69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com",
    }); 
  },[isFocused])



  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
  };

  // /ye final thi for register and store in firestore with local sotrage
  const handleSignup = async () => {
    console.log("signup press");
    if (email === "" || password === "" || confirmPassword === "") {
      setFillFieldData("Please Fill All the Fields");
      console.log("Please Fill All the Fields!");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordNotMatch("Passwords do not match.");
      console.log("Passwords do not match.");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const userDetail = userCredential.user; // assuming user details are in userCredential.user
      const userId = userDetail.uid;

      await firestore().collection("users").doc(userId).set({
        name: fullName,
        email: email,
        password: password,
        deviceId: deviceId,
        image: "",
        purchasedServersList: [],
      });

      console.log("User account created & signed in!");
      handleUpdatePassword();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        console.log("That email address is already in use!");
        setFlashMessageData("That email address is already in use!");
      } else if (error.code === "auth/invalid-email") {
        console.log("That email address is invalid!");
        setFlashMessageData("That email address is invalid!");
      } else {
        console.log("An error occurred. Please try again.");
        setFlashMessageData("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onGoogleButtonPress = async () => {
    setLoading(true);
    try {
      // Configure Google Sign-In
      // GoogleSignin.configure({
      //   webClientId: '69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com',
      // });
  
      // Sign out of any previous Google account
      await GoogleSignin.signOut();
  
      // Check if the device supports Google Play services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
  
      // Attempt to sign in and get user information
      const userInfo = await GoogleSignin.signIn();
      console.log('Google Sign-In successful. User Info:', userInfo);
  
      // Extract the idToken
      const { idToken } = userInfo.data; // Updated to access idToken correctly
  
      // Check if the idToken is available
      if (!idToken) {
        throw new Error('Google Sign-In failed: No idToken returned.');
      }
  
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      // console.log("You have successfully signed in with Google!", userCredential);
  
      // Get user details
      setErrorMessage('');
      const userDetail = userCredential.user.toJSON();
      console.log('user detail haiiiiiiiiiiii', userDetail)
      const userId = userDetail.uid;
      const email = userDetail.email;
      const fullName = userDetail.displayName;
  
      // Check if user already exists in Firestore
      const userRef = firestore().collection("users").doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        // If user doesn't exist, create a new record
        await userRef.set({
          name: fullName || "",
          email: email,
          password: "", // Google sign-in does not provide the password
          deviceId: deviceId,
          image: "",
          purchasedServersList: [],
        });
  
        console.log("You have successfully signed up with Google!");
        setGoogleMessageData("You have successfully signed up with Google!");
      } else {
        console.log("You have successfully logged in with Google!");
        setGoogleMessageData("You have successfully logged in with Google!");
      }
    } catch (error) {
      console.log("Login error: ", error);
      let message = "An error occurred. Please try again.";
  
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        message = "Sign-in was cancelled by the user.";
      } else if (error.code === statusCodes.IN_PROGRESS) {
        message = "Sign-in is in progress.";
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        message = "Google Play Services is not available.";
      } else {
        message = `Error: you have cancle the Google auth`;
      }
  
      setGoogleMessageData(message);
      setErrorMessage('');
    } finally {
      setLoading(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <PaperTextInput
          label="Full Name"
          mode="outlined"
          placeholder="Enter Full Name"
          value={fullName}
          onChangeText={setFullName}
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#DBD6CE", fontFamily: "Poppins-Regular", },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />

        <PaperTextInput
          label="Email"
          mode="outlined"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#DBD6CE", fontFamily: "Poppins-Regular", },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <View style={{ marginBottom: 5, marginTop: -6 }}>
          {falshMessageData ? (
            <Text style={styles.errorText}>{falshMessageData}</Text>
          ) : null}
        </View>

        <PaperTextInput
          label="Password"
          mode="outlined"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          right={
            <PaperTextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#DBD6CE" ,fontFamily: "Poppins-Regular",},
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <View style={{ marginBottom: 5, marginTop: -6 }}>
          {PasswordNotMatch ? (
            <Text style={styles.errorText}>{PasswordNotMatch}</Text>
          ) : null}
        </View>

        <PaperTextInput
          label="Confirm Password"
          mode="outlined"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          right={
            <PaperTextInput.Icon
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#DBD6CE" ,fontFamily: "Poppins-Regular", },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <View style={{ marginBottom: 5, marginTop: -6 }}>
          {PasswordNotMatch ? (
            <Text style={styles.errorText}>{PasswordNotMatch}</Text>
          ) : null}
        </View>
      </View>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={agreeTerms}
          onValueChange={setAgreeTerms}
          tintColors={{ true: "orange", false: "#888" }}
          style={styles.checkbox}
        />

        <Text style={styles.checkboxLabel}>
          I agree with{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("TermServices")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("PrivacyPolicy")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
      <View style={{ marginBottom: 5, marginTop: -6 }}>
        {FillFieldData ? (
          <Text style={styles.errorText}>{FillFieldData}</Text>
        ) : null}
      </View>

      
      {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          
          <View style={{ marginVertical:10}}>
        {GoogleMessageData ? (
          <Text style={styles.errorText}>{GoogleMessageData}</Text>
        ) : null}
      </View>
      <View style={{ paddingTop: 70 }}></View>
      <Button
        title="Register"
        onPress={handleSignup}
        disabled={!agreeTerms}
        loading={loading}
        style={{ backgroundColor: agreeTerms ? "orange" : "#888" }}
      />
      <View style={styles.socialLoginContainer}>
        <Text style={styles.orText}>Or sign up with</Text>
        <TouchableOpacity onPress={() => onGoogleButtonPress()}>
          <Image source={Images.Google} />
        </TouchableOpacity>
      </View>
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.linkText}> Sign In</Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="User account created & signed in!"
        onDismiss={dismissSnackbar} // Make sure this function is defined
        visible={snackbarVisible}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#1c161b",
  },
  title: {
    fontSize: 32,
    color: "#FE8C00",
    fontFamily: "Poppins-Bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#333",
    color: "white",
    marginBottom: 15,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  checkboxLabel: {
    color: "white",
    fontSize: 12,
  },

  socialLoginContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  orText: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
  // signInText: {
  //   color: "white",
  //   textAlign: "center",
  //   marginTop: 20,
  // },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    fontFamily: "Poppins-Medium",
  },
  signInText: {
    color: "#DBD6CE",
    textAlign: "center",
  },
  linkText: {
    color: "#FF9900", // Or whatever color you prefer for the link
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
    paddingTop:3
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    fontFamily: "Poppins-Regular",
  },
});

export default SignupScreen;
