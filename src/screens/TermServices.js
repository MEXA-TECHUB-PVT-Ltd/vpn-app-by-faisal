import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch,Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';

 

const TermServices = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor:'#6D6C69', borderRadius:30, padding:5}}>
                         <Image source={Images.back}/>
                    </TouchableOpacity>
                }
                middleComponent={
                    <Text style={{ color: 'orange', fontSize: 20, fontFamily: "Poppins-Bold", }}>Term of Service</Text>
                }
            />

            {/* <View style={styles.content}>
                <Text style={styles.settingText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </Text>
            </View> */}
 <ScrollView style={styles.content}>
                <Text style={styles.heading}>1. Acceptance of Terms</Text>
                <Text style={styles.text}>
                    By using stealthlinkvpnapp (the "Service"), you agree to comply with and be bound by these Terms of Service. If you do not agree, you may not use the Service.
                </Text>

                <Text style={styles.heading}>2. Privacy Policy</Text>
                <Text style={styles.text}>
                    Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.
                </Text>

                <Text style={styles.heading}>3. User Responsibilities</Text>
                <Text style={styles.text}>
                    - You are responsible for maintaining the confidentiality of your account information.
                    - You must not use the Service for any unlawful or harmful purposes.
                </Text>

                <Text style={styles.heading}>4. Limitation of Liability</Text>
                <Text style={styles.text}>
                    The Service is provided "as is" and without warranties of any kind. stealthlinkvpnapp will not be liable for any damages arising from the use of the Service.
                </Text>

                <Text style={styles.heading}>5. Changes to Terms</Text>
                <Text style={styles.text}>
                    We may update these Terms from time to time. Continued use of the Service after changes are made constitutes acceptance of the revised Terms.
                </Text>

                <Text style={styles.heading}>6. Contact Us</Text>
                <Text style={styles.text}>
                    If you have any questions about these Terms, please contact us at [support email].
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
    headerText: {
        color: 'orange',
        fontSize: 20,
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

export default TermServices;
