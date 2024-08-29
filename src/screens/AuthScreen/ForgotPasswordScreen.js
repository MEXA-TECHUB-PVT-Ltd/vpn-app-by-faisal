import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import Button from '../../components/Button';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendOTP = () => {
        navigation.navigate('OTPVerificationScreen')
    };
 
    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email and we will send OTP code to recover the password
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.bottomContainer}>
                <Button
                    title="Send OTP"
                    onPress={handleSendOTP}
                    disabled={!email}
                    style={{ backgroundColor: email ? 'orange' : '#888' }}
                />
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.signInText}>
                        Back to <Text style={styles.linkText}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
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
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    bottomContainer: {
        paddingVertical: 20,
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
});

export default ForgotPasswordScreen;
