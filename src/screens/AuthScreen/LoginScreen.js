import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../components/Button';

const LoginScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignin = () => {
    console.log('login press');
    navigation.navigate('HomeScreen')
    // Add signup logic here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.checkboxLabel}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Full Name"
          placeholderTextColor="#888"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.checkboxLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
            <TouchableOpacity
            
        onPress={()=>navigation.navigate('ForgotPasswordScreen')}
            >
                  <Text style={styles.forgetPasswordText}>ForgotPassword</Text>
            </TouchableOpacity>
    
      <View style={{flex: 0.5}}></View>
      <Button
        title="Login"
        onPress={handleSignin}
        // disabled={!agreeTerms}
        style={{backgroundColor: agreeTerms ? 'orange' : '#888'}}
      />

      <View style={styles.socialLoginContainer}>
        <Text style={styles.orText}>Or sign in with</Text>
        <Icon
          name="google-plus-circle"
          size={40}
          color="white"
          onPress={() => {}}></Icon>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
        <Text style={styles.signInText}>
          Don’t have an account? <Text style={styles.linkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1c161b',
  },
  title: {
    fontSize: 32,
    color: 'orange',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 12,
    // marginLeft: 10,
  },
  forgetPasswordText: {
    color: 'orange',
    fontSize: 12,
    textAlign:'right'
    // marginLeft: 10,
  },
  linkText: {
    color: 'orange',
    fontWeight: 'bold',
  },
  button: {
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialLoginContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  signInText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default LoginScreen;
