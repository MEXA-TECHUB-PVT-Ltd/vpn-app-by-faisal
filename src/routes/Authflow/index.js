import {Splash, SliderScreen, IntroduceYourself} from '../../screens';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Introduction from '../../NewScreens/Introduction';
import Start from '../../NewScreens/Start';

const AuthStack = createStackNavigator();
const AuthApp = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Start'}>
      <AuthStack.Screen
        name="Start"
        component={Start}
        options={{
          headerTitleStyle: {fontWeight: 'bold'},
          headerShown: false,
        }}
      />
      <AuthStack.Screen name={'Splash'} component={Splash} />
      <AuthStack.Screen name={'SliderScreen'} component={SliderScreen} />
      <AuthStack.Screen
        name={'IntroduceYourself'}
        component={IntroduceYourself}
      />

      <AuthStack.Screen
        name="Introduction"
        component={Introduction}
        options={{
          // headerTitleStyle: {fontWeight: 'bold',},
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

export default AuthApp;
