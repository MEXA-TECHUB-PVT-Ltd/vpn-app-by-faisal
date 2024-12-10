import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import CountDown from 'react-native-countdown-component';
import Button from '../../components/Button';

const OTPVerificationScreen = ({ navigation }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [resendAvailable, setResendAvailable] = useState(false);

    const handleOtpChange = (code) => { 
        setOtp(code);
        setError(''); // Clear error when user is typing
    };

    const handleVerifyOtp = () => {
        // Replace with actual OTP verification logic
        if (otp === '1234') { // Example correct OTP
            Alert.alert('OTP Verified', 'Your OTP is verified successfully!');
            navigation.navigate('NextScreen'); // Replace with your next screen
        } else {
            setError('Code Invalid');
        }
    };

    const handleResendCode = () => {
        setResendAvailable(false);
        setOtp(''); // Clear the OTP input
        // Logic to resend OTP goes here
        Alert.alert('OTP Resent', 'A new OTP has been sent to your email.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.subtitle}>
                Enter the verification code we sent you on{"\n"}thomas*****@gmail.com
            </Text>

            <OTPTextInput
                handleTextChange={handleOtpChange}
                inputCount={4}
                containerStyle={styles.otpContainer}
                textInputStyle={[
                    styles.otpInput,
                    error ? styles.otpInputError : {},
                ]}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive a code?</Text>
                <CountDown
                    until={45}
                    size={15}
                    onFinish={() => setResendAvailable(true)}
                    digitStyle={{ backgroundColor: '#1c161b' }}
                    digitTxtStyle={{ color: 'white' }}
                    timeToShow={['S']}
                    timeLabels={{ s: null }}
                />
                <TouchableOpacity
                    disabled={!resendAvailable}
                    onPress={handleResendCode}
                >
                    <Text
                        style={[
                            styles.resendLink,
                            { color: resendAvailable ? 'orange' : '#888' },
                        ]}
                    >
                        Resend Code
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomContainer}>
            <Button
                title="Send OTP"
                onPress={handleVerifyOtp}
                disabled={otp.length !== 4}
                style={{ backgroundColor: otp.length === 4 ? 'orange' : '#888' }}
            />

            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.signInText}>
                    Back to <Text style={styles.linkText}>Sign In</Text>
                </Text>
            </TouchableOpacity>
            </View>
        </View>
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    otpInput: {
        backgroundColor: '#333',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        fontSize: 24,
        textAlign: 'center',
        width: 45,
        height: 55,
    },
    otpInputError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        color: '#ccc',
        marginRight: 5,
    },
    resendLink: {
        fontWeight: 'bold',
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
    bottomContainer: {
        paddingVertical: 20,
    },
});

export default OTPVerificationScreen;
