import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

import { useNavigation } from '@react-navigation/native';
import Images from '../../constants/Image';

const Dots = ({ selected }) => {
    let backgroundColor;

    backgroundColor = selected ? 'rgba(255, 165, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor
            }}
        />
    );
}

const Skip = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'orange'}}>Skip</Text>
    </TouchableOpacity>
);

const Next = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'orange'}}>Next</Text>
    </TouchableOpacity>
);

const Done = ({...props}) => (
    <TouchableOpacity
        style={{marginHorizontal: 10}}
        {...props}
    >
        <Text style={{fontSize: 16, color: 'orange'}}>Done</Text>
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
                    title: 'FAST VPN',
                    subtitle: 'Protect your privacy at lightning speed.',
                    subTitleComponent: (
                        <View>
                            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
                                Protect your privacy at lightning speed.
                            </Text>
                            <Text style={{ marginTop: 10, fontSize: 14, color: 'white', textAlign: 'center' }}>
                                Use our VPN to securely connect and protect your data across the internet.
                            </Text>
                        </View>
                    ),
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider2} />,
                    title: 'Many Prestigious Awards',
                    subtitle: 'Trusted by over 4 million users.',
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider3} />,
                    title: 'Safe And Secured',
                    subtitle: 'Military-Grade Encryption.',
                },
                {
                    backgroundColor: '#1c161b',
                    image: <Image source={Images.slider4} />,
                    title: 'Global Server Coverage',
                    subtitle: 'Supports over 1 million servers worldwide.',
                },
            ]}
        />
    );
}

export default OnboardingScreen;
