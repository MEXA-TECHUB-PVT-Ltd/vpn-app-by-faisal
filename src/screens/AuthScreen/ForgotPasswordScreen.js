import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  TextInput as PaperTextInput,
  Button as PaperButton,
} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import Button from '../../components/Button';
import CustomSnackbar from '../../components/CustomSnackbar';
import firestore from '@react-native-firebase/firestore';
import Images from '../../constants/Image';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarVisible, setsnackbarVisible] = useState(false);
  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
  };
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const handleSendOTP = async () => {
    setErrorMessage('');
    if (!validateEmail(email)) {
      setErrorMessage('Invalid email format');
      return;
    }
    setLoading(true);
    try {
      // Fetch the user from Firestore
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', email)
        .get();
      if (userSnapshot.empty) {
        setErrorMessage('No account found with this email.');
        setLoading(false);
        return;
      }
      console.log('email hai------------', userSnapshot);
      // If email exists, send the password reset email
      await auth().sendPasswordResetEmail(email);
      handleUpdatePassword();
      // Show success message
      //   setErrorMessage("Password reset email sent! Please check your inbox.");
      console.log('otp send');
      setEmail(''); // Clear the email field
      setErrorMessage('');
      // Delay of 3 seconds before navigating back
      setTimeout(() => {
        navigation.goBack();
      }, 3000); // 3000 milliseconds = 3 seconds
      //   navigation.navigate('OTPVerificationScreen');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address format.');
      } else if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with this email.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{alignItems: 'center', paddingBottom: 40}}>
        <Image source={Images.Applogo} style={styles.logo} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email and we will send an OTP code to recover your password
        </Text>

        {/* PaperTextInput from react-native-paper */}
        <PaperTextInput
          label="Email"
          value={email}
          placeholder="Enter Email"
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          textColor="white"
          placeholderTextColor="white"
          mode="outlined"
          theme={{
            colors: {primary: 'orange', placeholder: '#888', text: 'white'},
          }}
          outlineColor="#888"
          activeOutlineColor="orange"
        />
        <View style={{marginBottom: 5}}>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Send"
          onPress={handleSendOTP}
          disabled={!email}
          loading={loading}
          style={{backgroundColor: email ? 'orange' : '#888'}}
        />

        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.signInText}>
            Back to <Text style={styles.linkText}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <CustomSnackbar
        message="Success"
        messageDescription="Password reset email sent! Please check your inbox."
        onDismiss={dismissSnackbar}
        visible={snackbarVisible}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1c161b',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    marginBottom: 15,
    fontSize: 16,
  },
  bottomContainer: {
    paddingVertical: 20,
  },
  button: {
    backgroundColor: 'orange',
  },
  signInText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: 'orange',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -4,
  },
});

export default ForgotPasswordScreen;
