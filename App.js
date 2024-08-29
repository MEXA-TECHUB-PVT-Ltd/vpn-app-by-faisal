// // // // import App from './src/routes';

// // // // export default App;
// // // // adding comniy
// // // // sdsfsdf

// ///////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  NativeModules,
  NativeEventEmitter,
  DeviceEventEmitter,
} from "react-native";

import Papa from "papaparse";
import { useIsFocused } from "@react-navigation/native";
const { VpnServiceModule, MainActivity } = NativeModules;
import { Buffer } from "buffer"; // Make sure to install buffer with `npm install buffer`

const decodeBase64 = (base64String) => {
  const buffer = Buffer.from(base64String, "base64");
  return buffer.toString("utf-8");
};

const App = () => {
  const [vpnState, setVpnState] = useState("disconnected");
  const [vpnList, setVpnList] = useState([]);
  const [selectedVpn, setSelectedVpn] = useState(null);
  const [vpnStatus, setVpnStatus] = useState("");
  const [vpnServers, setVpnServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getVPNServers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://www.vpngate.net/api/iphone/");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.text();

      const parts = data.split("#");
      if (parts.length < 2) {
        throw new Error("Unexpected data format");
      }

      const csvString = parts[1].split("*").join("");

      Papa.parse(csvString, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const csvList = results.data;
          const header = csvList[0];
          const servers = csvList.slice(1).map((row) => {
            const tempJson = {};
            for (let j = 0; j < header.length; j++) {
              tempJson[header[j]] = row[j];
            }
            return tempJson;
          });
          setVpnServers(servers);
          setLoading(false); // Hide loading spinner after fetching
        },
      });
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      setLoading(false); // Hide loading spinner on error
    }
  };
  useEffect(() => {
    getVPNServers();
  }, []);
  const reloadServers = () => {
    getVPNServers();
  };

  useEffect(() => {
    // Initialize VPNs
    initVpn();
    const vpnStateListener = DeviceEventEmitter.addListener(
      "VpnStage",
      (stage) => {
        setVpnState(stage.stage.toLowerCase());
      }
    );
    const vpnStatusSubscription = DeviceEventEmitter.addListener(
      "VpnStatus",
      (event) => {
        setVpnStatus(`${event.byte_in || ""}, ${event.byte_out || ""}`);
      }
    );

    return () => {
      vpnStateListener.remove();
      vpnStatusSubscription.remove();
    };
  }, []);

  const initVpn = async () => {
    const vpnList = [
      {
        country: "Japan",
        username: "vpn",
        password: "vpn",
        // config: await fetchConfigFile('japan.ovpn'),
      },
      // {
      //   country: 'Thailand',
      //   username: 'vpn',
      //   password: 'vpn',
      //   config: await fetchConfigFile(),
      // },
    ];
    setVpnList(vpnList);
    // setSelectedVpn(vpnList[0]);
  };




  const startVpn = async () => {
    if (selectedVpn == null) return;
    const config = decodeBase64(selectedVpn.OpenVPN_ConfigData_Base64);
    console.log("-----------", config);
    // if (selectedVpn) {
    if (vpnState === "disconnected") {
      VpnServiceModule.startVpn(
        config,
        selectedVpn.CountryLong,
        // 'japan',
        "vpn",
        "vpn",
        null,
        null
        // []
      );
    } else {
      VpnServiceModule.stopVpn();
      setVpnState("disconnected");
      setVpnStatus("Disconnected from VPN");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MTech VPN</Text>
      <TouchableOpacity style={styles.button} onPress={startVpn}>
        <Text style={styles.buttonText}>
          {vpnState === "disconnected" ? "Connect VPN" : vpnState.toUpperCase()}
        </Text>
      </TouchableOpacity>
      <Text style={styles.status}>{vpnStatus}</Text>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <FlatList
          data={vpnServers}
          keyExtractor={(item) => item.HostName}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setSelectedVpn(item)}
            >
            <View>
               <Text style={styles.listText}>{item.CountryLong}</Text>
               <Text style={styles.listText}>{item.CountryShort}</Text>
            </View>
              
              
              <View
                style={[
                  styles.indicator,
                  selectedVpn === item ? styles.selected : styles.unselected,
                ]}
              />
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.reloadButton} onPress={reloadServers}>
        <Text style={styles.buttonText}>Reload</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  status: {
    textAlign: "center",
    marginBottom: 20,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  listText: {
    fontSize: 18,
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: "green",
  },
  unselected: {
    backgroundColor: "gray",
  },
  reloadButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default App;


// App.js
// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import HomeScreen from './src/screens/HomeScreen';
// import SettingsScreen from './src/screens/SettingsScreen';
// import LoginScreen from './src/screens/AuthScreen/LoginScreen';
// import SignupScreen from './src/screens/AuthScreen/SignupScreen';
// import ForgotPasswordScreen from './src/screens/AuthScreen/ForgotPasswordScreen';
// import OTPVerificationScreen from './src/screens/AuthScreen/OTPVerificationScreen';
// import LocationSelectionScreen from './src/screens/LocationSelectionScreen';
// import MyAccount from './src/screens/MyAccount';
// import TermServices from './src/screens/TermServices';
// import PrivacyPolicy from './src/screens/PrivacyPolicy';
// import AboutApp from './src/screens/AboutApp';
// import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
// import Help from './src/screens/Help';
// import HelpDetailScreen from './src/screens/HelpDetailScreen';
// import OnboardingScreen from './src/screens/Onboarding/OnboardingScreen';
// import CustomDrawer from './src/screens/CustomDrawer';



// const Stack = createNativeStackNavigator();
// const App = () => {
//   return (
//     <NavigationContainer  >
//       <Stack.Navigator  screenOptions={{
//       headerShown:false,
    
      
//   }}>

//       {/* <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} /> */}

//       {/* <Stack.Screen name="CustomDrawer" component={CustomDrawer} /> */}
//       <Stack.Screen name="LoginScreen" component={LoginScreen} />
//       <Stack.Screen name="SignupScreen" component={SignupScreen} />
//       <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
//       <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
      
//         <Stack.Screen name="HomeScreen" component={HomeScreen} />
//         <Stack.Screen name="LocationSelectionScreen" component={LocationSelectionScreen} />
//         <Stack.Screen name="MyAccount" component={MyAccount} />
//         <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
//         <Stack.Screen name="TermServices" component={TermServices} />
//         <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
//         <Stack.Screen name="AboutApp" component={AboutApp} />
//         <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
//         <Stack.Screen name="Help" component={Help} />
//         <Stack.Screen name="HelpDetailScreen" component={HelpDetailScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

