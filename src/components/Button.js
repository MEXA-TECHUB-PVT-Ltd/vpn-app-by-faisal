// components/Button.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, disabled = false, style = {}, textStyle = {} }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                style,
                { backgroundColor: disabled ? '#888' : 'orange' }
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Button;
