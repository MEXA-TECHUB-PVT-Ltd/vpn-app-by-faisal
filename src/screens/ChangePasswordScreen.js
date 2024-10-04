 import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "../components/Button";
import { TextInput as PaperTextInput } from "react-native-paper";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import CustomSnackbar from "../components/CustomSnackbar";

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const isFocused = useIsFocused();
  const [errorMessage, setErrorMessage] = useState("");
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // Get the current user
      const user = auth().currentUser;

      if (!user) {
        throw new Error("No user is currently signed in.");
      }

      // Update password in Firebase Authentication
      await user.updatePassword(password);

      // Update password in Firestore
      await firestore().collection("users").doc(user.uid).update({
        password: password,
      });

      // Show success message
      handleUpdatePassword();
      setPassword("");
      setConfirmPassword("");
      setErrorMessage("");
      //   setErrorMessage("Password updated successfully!");
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");

      if (error.code === "auth/weak-password") {
        setErrorMessage(
          "The new password is too weak. Please choose a stronger password."
        );
      } else if (error.code === "auth/requires-recent-login") {
        setErrorMessage("You need to log in again to perform this operation.");
        // errorMessage = "You need to log in again to perform this operation.";
      }

      //   console.error("Password change error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>
        Regularly changing passwords boosts security
      </Text>

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
          colors: { primary: "orange", placeholder: "#888", text: "white" },
        }}
        style={styles.input}
        outlineColor="#888"
        activeOutlineColor="orange"
      />

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
          colors: { primary: "orange", placeholder: "#888", text: "white" },
        }}
        style={styles.input}
        outlineColor="#888"
        activeOutlineColor="orange"
      />

      <View style={{ marginBottom: 5 }}>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
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
        <Button
          title="Save"
          onPress={handleSave}
          loading={loading}
          disabled={
            !password || !confirmPassword || password !== confirmPassword
          }
          style={{
            backgroundColor:
              password && confirmPassword && password === confirmPassword
                ? "orange"
                : "#888",
          }}
        />
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="Password updated successfully"
        onDismiss={dismissSnackbar} // Make sure this function is defined
        visible={snackbarVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#1c161b",
  },
  title: {
    fontSize: 22,
    color: "orange",
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#888",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  // input: {
  //     flex: 1,
  //     color: 'white',
  //     paddingVertical: 10,
  //     fontSize: 16,
  // },
  input: {
    backgroundColor: "#333",
    color: "white",
    marginBottom: 15,
    fontSize: 16,
  },
  iconContainer: {
    padding: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -4,
  },
});

export default ChangePasswordScreen;
