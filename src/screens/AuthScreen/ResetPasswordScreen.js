import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import auth from "@react-native-firebase/auth";
// import Button from "../../components/Button";

import firestore from "@react-native-firebase/firestore";

const ResetPasswordScreen = ({ route }) => {
  const { email, oobCode } = route.params; // oobCode is from the reset link
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      // Reset the password in Firebase Authentication
      await auth().confirmPasswordReset(oobCode, newPassword);
      
      // Update the password in Firestore
      const userRef = firestore.collection('users').doc(email); // Assuming you use email as document ID
      await userRef.update({ password: newPassword }); // Update the password field
      
      console.log('Password updated successfully!');
      // Navigate to a success screen or show a success message
    } catch (error) {
      console.error('Error resetting password: ', error);
      // Handle errors (e.g., show a message to the user)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="Enter New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={styles.input}
      />
      {/* <Button title="Reset Password" onPress={handleResetPassword} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 20, padding: 10 },
});

export default ResetPasswordScreen;
