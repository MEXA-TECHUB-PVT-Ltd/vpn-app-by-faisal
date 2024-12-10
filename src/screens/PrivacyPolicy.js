import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';
import { ScrollView } from 'react-native-gesture-handler';



const PrivacyPolicy = ({ navigation }) => {


    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor:'#6D6C69', borderRadius:30, padding:5}}>
                         <Image source={Images.back}/>
                    </TouchableOpacity>
                }
                middleComponent={
                    <Text style={{ color: 'orange', fontSize: 22, fontFamily: "Poppins-Bold", }}>Privacy Policy</Text>
                }
            />

<ScrollView style={styles.content}>
                <Text style={styles.heading}>1. Introduction</Text>
                <Text style={styles.text}>
                    Welcome to stealthlinkvpnapp. This Privacy Policy outlines the types of personal information that we collect, use, and share when you use our services.
                </Text>

                <Text style={styles.heading}>2. Information Collection</Text>
                <Text style={styles.text}>
                    We collect personal information, such as your name, email address, and device information, to provide you with a better experience. We may also collect usage data to improve our services.
                </Text>

                <Text style={styles.heading}>3. How We Use Your Information</Text>
                <Text style={styles.text}>
                    We use your information to improve our services, respond to support requests, and to ensure the proper functionality of the app. We do not share your information with third parties without your consent.
                </Text>

                <Text style={styles.heading}>4. Data Protection</Text>
                <Text style={styles.text}>
                    We take the protection of your data seriously and implement security measures to safeguard your personal information. However, no method of transmission over the internet is 100% secure.
                </Text>

                <Text style={styles.heading}>5. Cookies and Tracking Technologies</Text>
                <Text style={styles.text}>
                    Our app may use cookies and similar tracking technologies to improve the user experience and analyze usage patterns. You can control cookie settings through your device.
                </Text>

                <Text style={styles.heading}>6. Data Retention</Text>
                <Text style={styles.text}>
                    We retain your information as long as necessary to provide you with our services or as required by law. You can request to delete your account at any time.
                </Text>

                <Text style={styles.heading}>7. Changes to This Policy</Text>
                <Text style={styles.text}>
                    We may update this Privacy Policy from time to time. Any changes will be posted on this page, and you are encouraged to review the policy periodically.
                </Text>

                <Text style={styles.heading}>8. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about this Privacy Policy, please contact us at mtech@gmail.com.
                </Text>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c161b',
        paddingVertical:15,
        paddingHorizontal:15
    },
    content: {
        paddingHorizontal: 10,
        // paddingVertical: 5,
       
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
    headerText: {
        color: 'orange',
        fontSize: 22,
        fontFamily: 'Poppins-Bold',
    },
    heading: {
        color: 'orange',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginTop: 20,
        marginBottom: 10,
    },
    text: {
        color: '#DBD6CE',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        lineHeight: 24,
    },
});

export default PrivacyPolicy;
