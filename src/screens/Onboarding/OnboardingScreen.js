import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { useNavigation } from '@react-navigation/native';
import Images from '../../constants/Image';

const Dots = ({ selected }) => {
    let backgroundColor = selected ? 'rgba(255, 165, 0, 0.8)' : 'white';
    let width = selected ? 30 : 10; // Set width based on selection

    return (
        <View
            style={{
                width, // Dynamically set width
                height: 10, // Height remains the same
                marginHorizontal: 3,
                backgroundColor,
                borderRadius: 10, // Rounded corners
            }}
        />
    );
};

const Skip = ({...props}) => (
    <TouchableOpacity
        style={{
            marginHorizontal: 10,
            backgroundColor: '#FF9900', // Button background color
            borderRadius: 20, // Rounded corners
            paddingVertical: 10,
            paddingHorizontal: 20,
        }}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({...props}) => (
    <TouchableOpacity
        style={{
            marginHorizontal: 10,
            backgroundColor: '#FF9900', // Button background color
            borderRadius: 20, // Rounded corners
            paddingVertical: 10,
            paddingHorizontal: 20,
        }}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>Next</Text>
    </TouchableOpacity>
);

const Done = ({...props}) => (
    <TouchableOpacity
        style={{
            marginHorizontal: 10,
            backgroundColor: '#FF9900', // Button background color
            borderRadius: 20, // Rounded corners
            paddingVertical: 10,
            paddingHorizontal: 20,
        }}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'white', fontWeight: 'bold'}}>Done</Text>
    </TouchableOpacity>
);


const OnboardingScreen = () => {
    const navigation = useNavigation();
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            DotComponent={Dots}
            onSkip={() => navigation.replace("LoginScreen")}
            onDone={() => navigation.replace("LoginScreen")}
            pages={[
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider1} />,
                    title: 'Many prestigious awards',
                    subtitle: 'Trusted by over 4 million users.',
                    titleStyles: { color: '#FF9900', fontWeight:'600',  },  
                    subTitleStyles: { color: '#FFAD33' },
              
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider2} />,
                    title: 'Safe and Secured',
                    subtitle: 'Military-Grade Encryption.',
                    titleStyles: { color: '#FF9900' , fontWeight:'600', },  
                    subTitleStyles: { color: '#FFAD33' },
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider3} />,
                    title: 'Global Server Coverage',
                    subtitle: 'Supports over 1 million servers worldwide.',
                    titleStyles: { color: '#FF9900' , fontWeight:'600', },  
                    subTitleStyles: { color: '#FFAD33' },
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider4} />,
                    title: '24/7 Customer Support',
                    subtitle: 'Caring help whenever you need.',
                    titleStyles: { color: '#FF9900', fontWeight:'600',  }, 
                    subTitleStyles: { color: '#FFAD33' },
                },
            ]}
        />
    );
}

export default OnboardingScreen;
