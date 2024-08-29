import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch,Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';

 

const TermServices = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor:'gray', borderRadius:30, padding:5}}>
                         <Image source={Images.back}/>
                    </TouchableOpacity>
                }
                middleComponent={
                    <Text style={{ color: 'orange', fontSize: 22, fontWeight: '700' }}>Term of Service</Text>
                }
            />

            <View style={styles.content}>
                <Text style={styles.settingText}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
    content: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    settingText: {
        color: 'white',
        fontSize: 16,
    },
  
});

export default TermServices;
