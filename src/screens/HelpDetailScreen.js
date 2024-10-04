import React from 'react';
import { View, Text, StyleSheet, ScrollView , TouchableOpacity, Image} from 'react-native';
import CustomHeader from '../components/CustomHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Images from '../constants/Image';


const HelpDetailScreen = ({ route, navigation }) => {
    const { question, answer } = route.params;

    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{backgroundColor:'#6D6C69', borderRadius:30, padding:5}}>
                         <Image source={Images.back}/>
                    </TouchableOpacity>
                }
                middleComponent={<Text style={styles.headerTitle}>Help</Text>}
            />

            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.questionText}>{question}</Text>
                <Text style={styles.answerText}>{answer}</Text>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c161b',
        paddingHorizontal:15,
        paddingVertical:10
    },
    headerTitle: {
        color: 'orange',
        fontSize: 25,
        fontFamily: "Poppins-Bold",
    },
    contentContainer: {
        padding: 2,
    },
    questionText: {
        color: '#DBD6CE',
        fontSize: 20,
        fontFamily: "Poppins-SemiBold",
        marginBottom: 20,
    },
    answerText: {
        color: '#DBD6CE',
        fontSize: 16,
        lineHeight: 24,
        fontFamily: "Poppins-Regular",
    },
});

export default HelpDetailScreen;
