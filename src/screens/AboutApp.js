import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch,Image } from 'react-native';

import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';



const AboutApp = ({ navigation }) => {


    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor:'#6D6C69', borderRadius:30, padding:5}}>
                         <Image source={Images.back}/>
                    </TouchableOpacity>
                }
                middleComponent={
                    <Text style={{ color: 'orange', fontSize: 22, fontFamily: "Poppins-Bold", }}>About App</Text>
                }
            />

<View style={styles.content}>
                <Text style={styles.aboutText}>
                    Welcome to stealthlinkvpnapp, your trusted VPN service that ensures privacy, security, and freedom online. Our app allows you to securely connect to the internet, hide your IP address, and access restricted content from around the world. With a user-friendly interface and high-performance servers, we prioritize your online safety and offer a seamless browsing experience.
                </Text>

                <Text style={styles.aboutText}>
                    Our app is designed with privacy in mind. We do not collect your personal information, and our services operate with a strict no-logs policy. Whether you want to browse the web anonymously or access content without restrictions, [Your VPN App Name] has got you covered.
                </Text>

                <Text style={styles.aboutText}>
                    Our team is dedicated to continually improving the app to provide the best experience. If you have any questions or feedback, feel free to contact our support team through the app or via email.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c161b',
        paddingVertical:10,
        paddingHorizontal:10
    },
    headerText: {
        color: 'orange',
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
    },
    content: {
        paddingHorizontal: 10,
        paddingVertical: 15,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingText: {
        color: '#DBD6CE',
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    aboutText: {
        color: '#DBD6CE',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        lineHeight: 24,
        marginBottom: 15,
    },
  
});

export default AboutApp;
