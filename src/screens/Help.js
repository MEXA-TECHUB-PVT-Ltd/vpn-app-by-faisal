import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../components/CustomHeader';
import Images from '../constants/Image';

const questions = [
    {
        id: '1',
        question: 'Can I use VPN to access online streaming services?',
        answer: 'Yes, you can use VPN to access online streaming services. VPN allows you to bypass geographical restrictions by connecting to servers in different locations, thereby granting you access to content that may be blocked in your region.',
    },
    {
        id: '2',
        question: 'Is there a way to view my previous VPN connection history?',
        answer: 'Unfortunately, viewing previous VPN connection history is not available at the moment. However, we are working on adding this feature in future updates.',
    },
    {
        id: '3',
        question: 'How do I update the VPN app to the latest version?',
        answer: 'To update the VPN app, visit the app store on your device and check for updates. If an update is available, tap "Update" to install the latest version.',
    },
    {
        id: '4',
        question: 'Can I use one VPN account on multiple devices?',
        answer: 'Yes, you can use one VPN account on multiple devices, as long as it is within the limit specified in your subscription plan.',
    },
    {
        id: '5',
        question: 'I encountered an issue with VPN connection, how do I uninstall and reinstall the app?',
        answer: 'To uninstall the app, go to your device’s settings, find the app, and tap "Uninstall." To reinstall, visit the app store, search for the VPN app, and tap "Install."',
    },
    {
        id: '6',
        question: 'What is the "Kill Switch" feature and how do I activate it?',
        answer: 'The "Kill Switch" feature automatically disconnects your device from the internet if the VPN connection drops, ensuring that your data is not exposed. You can activate it in the app settings under "Security Options."',
    },
    {
        id: '7',
        question: 'I forgot my password, how do I reset it?',
        answer: 'To reset your password, tap "Forgot Password" on the login screen and follow the instructions. You will receive an email with a link to reset your password.',
    },
    {
        id: '8',
        question: 'How do I activate VPN connection on my device?',
        answer: 'To activate the VPN connection, open the app, select a server location, and tap the connect button. Once connected, the VPN icon will appear in your device’s status bar.',
    },
];

const Help = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState(questions);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredQuestions(questions);
        } else {
            const filteredData = questions.filter(item =>
                item.question.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredQuestions(filteredData);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.questionContainer}
            onPress={() => navigation.navigate('HelpDetailScreen', { question: item.question, answer: item.answer })}
        >
            <Text style={styles.questionText}>{item.question}</Text>
            <Icon name="keyboard-arrow-right" size={24} color="white" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <CustomHeader
                leftComponent={
                    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{backgroundColor:'gray', borderRadius:30, padding:5}}>
                        <Image source={Images.DrawerMenu}/>
                    </TouchableOpacity>
                }
                middleComponent={<Text style={styles.headerTitle}>Help</Text>}
            />

            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="white" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            <FlatList
                data={filteredQuestions}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                keyboardShouldPersistTaps='always'
            />

            <TouchableOpacity style={styles.contactButton} onPress={() => alert('Contact Support')}>
                <Icon name="mail-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c161b',
        paddingHorizontal:10,
        paddingVertical:10
    },
    headerTitle: {
        color: 'orange',
        fontSize:  25,
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: 'white',
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    questionText: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
    contactButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'orange',
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Help;
