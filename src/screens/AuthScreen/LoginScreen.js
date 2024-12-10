// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Button from '../../components/Button';

// const LoginScreen = ({navigation}) => {
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   const handleSignin = () => {
//     console.log('login press');
//     navigation.navigate('HomeScreen')
//     // Add signup logic here
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <View style={styles.inputContainer}>
//         <Text style={styles.checkboxLabel}>Full Name</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Full Name"
//           placeholderTextColor="#888"
//           value={fullName}
//           onChangeText={setFullName}
//         />
//         <Text style={styles.checkboxLabel}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Email"
//           placeholderTextColor="#888"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//         />
//       </View>
//             <TouchableOpacity

//         onPress={()=>navigation.navigate('ForgotPasswordScreen')}
//             >
//                   <Text style={styles.forgetPasswordText}>ForgotPassword</Text>
//             </TouchableOpacity>

//       <View style={{flex: 0.5}}></View>
//       <Button
//         title="Login"
//         onPress={handleSignin}
//         // disabled={!agreeTerms}
//         style={{backgroundColor: agreeTerms ? 'orange' : '#888'}}
//       />

//       <View style={styles.socialLoginContainer}>
//         <Text style={styles.orText}>Or sign in with</Text>
//         <Icon
//           name="google-plus-circle"
//           size={40}
//           color="white"
//           onPress={() => {}}></Icon>
//       </View>
//       <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
//         <Text style={styles.signInText}>
//           Don’t have an account? <Text style={styles.linkText}>Sign Up</Text>
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#1c161b',
//   },
//   title: {
//     fontSize: 32,
//     color: 'orange',
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#333',
//     color: 'white',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 15,
//     fontSize: 16,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   checkbox: {
//     alignSelf: 'center',
//   },
//   checkboxLabel: {
//     color: 'white',
//     fontSize: 12,
//     // marginLeft: 10,
//   },
//   forgetPasswordText: {
//     color: 'orange',
//     fontSize: 12,
//     textAlign:'right'
//     // marginLeft: 10,
//   },
//   linkText: {
//     color: 'orange',
//     fontWeight: 'bold',
//   },
//   button: {
//     padding: 15,
//     borderRadius: 30,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   socialLoginContainer: {
//     marginVertical: 20,
//     alignItems: 'center',
//   },
//   orText: {
//     color: 'white',
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   signInText: {
//     color: 'white',
//     textAlign: 'center',
//     marginTop: 20,
//   },
// });

// export default LoginScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { TextInput as PaperTextInput } from "react-native-paper"; // Import Paper TextInput
import Button from "../../components/Button";
import Images from "../../constants/Image";
import CustomSnackbar from "../../components/CustomSnackbar";
import { useIsFocused } from "@react-navigation/native";
import { firebase } from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import firestore from "@react-native-firebase/firestore";
import DeviceInfo from "react-native-device-info";
// GoogleSignin.configure({
//   webClientId:
//     "69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com",
// }); 

const LoginScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [FillFieldData, setFillFieldData] = useState(null);
  const [PasswordNotMatch, setPasswordNotMatch] = useState(null);
  const [falshMessageData, setFlashMessageData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [GoogleMessageData, setGoogleMessageData] = useState('');
  const isFocused = useIsFocused();

  const [deviceId, setDeviceId] = useState("");
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
        "124123034810-rakb9fpqv8al9l551kpb4sqpo9o5iuva.apps.googleusercontent.com",
    }); 
  },[isFocused])



  const [usersData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userSnapshot = await firestore()
          .collection("users")
          .where("email", "==", email)
          .get();

        if (userSnapshot.empty) {
          throw new Error("No user found with this email.");
        }

        let fetchedUserData = null;
        userSnapshot.forEach((doc) => {
          fetchedUserData = { id: doc.id, ...doc.data() };
        });

        setUserData(fetchedUserData);
      } catch (error) {}
    };

    fetchUserData();
  }, [email]);


  // const googlefunction = () =>{
  //   console.log('call')
  //   GoogleSignin.configure({
  //     webClientId:
  //       "69377085199-1o9q6cmm27hb6l0810oujabd10mepn38.apps.googleusercontent.com",
  //   }); 
  // }
  // const handleSignin = () => {
  //   console.log("login press");
  //   navigation.navigate("MainDrawer");
  //   // Add signup logic here
  // };



  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  //   return () => {
  //     setIsMounted(false); // Set the flag to false on unmount
  //   };
  // }, []);
  useEffect(() => {
 console.log('call')
  }, [isFocused]);
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignin = async () => {
    // Reset error message
    setErrorMessage('');
    setGoogleMessageData('')
    // Validation checks
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      setGoogleMessageData('')
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      setGoogleMessageData('')
      return;
    }

    // Attempt login
    setLoading(true);
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      handleUpdatePassword();
      setGoogleMessageData('')
      console.log('User logged in:', userCredential.user);

      // Update the password in Firestore (ensure usersData.id is available)
      // await firestore().collection("users").doc(usersData.id).update({
      //   password: password,
      // });

    if (usersData?.id) {
      await firestore().collection("users").doc(usersData.id).update({
        password: password, // Updating the password field in Firestore
      });
      console.log('Password updated successfully in Firestore');
    } else {
      console.error('User ID not available to update Firestore');
    }

    } catch (error) {
      console.log('Login error: ', error);

      // Handle Firebase authentication errors
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email.');
      } else if (error.code === 'auth/invalid-login') {
        setErrorMessage('Incorrect credentials. Please try again.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('The email address is not valid.');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Too many attempts. Please try again later.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
      setGoogleMessageData('')
    } finally {
      setLoading(false);
    }
  };


  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
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
  console.log('user idToken haiii-------------', idToken)
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
      <Text style={styles.title}>Sign In</Text>
      <View style={styles.inputContainer}>
        <PaperTextInput
          label="Email"
          mode="outlined"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#FFFFFF" ,fontFamily: "Poppins-Regular",},
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <PaperTextInput
          label="Password"
          mode="outlined"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Toggles password visibility
          theme={{
            colors: { primary: "orange", placeholder: "#888", text: "#FFFFFF",fontFamily: "Poppins-Regular", },
          }}
          style={styles.input}
          outlineColor="#888"
          activeOutlineColor="orange"
          right={
            <PaperTextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)} // Toggle state
            />
          }
        />
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
      >
        <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          
          <View style={{ marginVertical:10}}>
        {GoogleMessageData ? (
          <Text style={styles.errorText}>{GoogleMessageData}</Text>
        ) : null}
      </View>
      <View style={{ paddingTop: 200 }}>
        <Button
          title="Login"
          onPress={handleSignin}
          loading={loading}
          style={{ backgroundColor: agreeTerms ? "orange" : "#888" }}
        />

        <View style={styles.socialLoginContainer}>
          <Text style={styles.orText}>Or sign in with</Text>
          <TouchableOpacity onPress={() => onGoogleButtonPress()}>
          <Image source={Images.Google} />
        </TouchableOpacity>
         
        </View>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Don’t have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignupScreen")}>
            <Text style={styles.linkText}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar
          message='Success'
          messageDescription='User logged in successfully'
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
    marginBottom: 15,
  },
  forgetPasswordText: {
    color: "#FE8C00",
    fontSize: 12,
    textAlign: "right",
    fontFamily: "Poppins-Medium",
  },

  socialLoginContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
  orText: {
    color: "#6D6C69",
    fontSize: 14,
    marginBottom: 10,
    fontFamily: "Poppins-Medium",
  },

  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  signInText: {
    color: "#DBD6CE",
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  linkText: {
    color: "#FE8C00", // Or whatever color you prefer for the link
    textAlign: "center",
    fontFamily: "Poppins-SemiBold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
    fontFamily: "Poppins-Regular",
  },
});

export default LoginScreen;
