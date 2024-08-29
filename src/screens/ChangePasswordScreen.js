import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Button from '../components/Button';

 
const ChangePasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = () => {
        // Implement the logic to handle password change
        if (password === confirmPassword) {
            console.log('Password changed successfully');
        } else {
            console.log('Passwords do not match');
        }
    };

    return (
        <View style={styles.container}>
            
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>Regularly changing passwords boosts security</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Icon name={showPassword ? "visibility" : "visibility-off"} size={24} color="#888" />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#888"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                    <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="#888" />
                </TouchableOpacity>
            </View>

<View style={{position:'absolute', bottom:0, left:0, right:0, margin:20
}}>


            <Button
                title="Save"
                onPress={handleSave}
                disabled={!password || !confirmPassword || password !== confirmPassword}
                style={{ backgroundColor: password && confirmPassword && password === confirmPassword ? 'orange' : '#888' }}
            />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: '#1c161b',
    },
    title: {
        fontSize: 24,
        color: 'orange',
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderColor: '#333',
    },
    input: {
        flex: 1,
        color: 'white',
        paddingVertical: 10,
        fontSize: 16,
    },
    iconContainer: {
        padding: 10,
    },
});

export default ChangePasswordScreen;
