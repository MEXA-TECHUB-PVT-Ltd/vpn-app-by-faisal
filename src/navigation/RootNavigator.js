// src/navigation/RootNavigator.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import MainNavigator from './MainNavigator';
// import { onAuthStateChanged } from 'firebase/auth'; // Replace with your auth library

const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       setIsAuthenticated(!!user);
//     });

//     return () => unsubscribe();
//   }, []);

  return (
    <NavigationContainer>
      
      {/* {isAuthenticated ? <AuthNavigator/> : <MainNavigator />} */}
      {isAuthenticated ? <AppNavigator /> : <AppNavigator />}
    </NavigationContainer>
  );
};

export default RootNavigator;
