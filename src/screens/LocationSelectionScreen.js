
// import React, { useState } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import CountryFlag from "react-native-country-flag";
 
// const locations = [
//     { id: 1, country: 'United Kingdom', city: 'London', flag: 'GB', signalStrength: 4 },
//     { id: 2, country: 'Canada', city: 'Victoria', flag: 'CA', signalStrength: 3 },
//     { id: 3, country: 'Canada', city: 'Ottawa', flag: 'CA', signalStrength: 4 },
//     { id: 4, country: 'Germany', city: 'Berlin', flag: 'DE', signalStrength: 4 },
//     { id: 5, country: 'Thailand', city: 'Bangkok', flag: 'TH', signalStrength: 3 },
//     { id: 6, country: 'Iceland', city: 'Reykjavik', flag: 'IS', signalStrength: 4 },
//     { id: 7, country: 'Vietnam', city: 'Ho Chi Minh', flag: 'VN', signalStrength: 3 },
//     { id: 8, country: 'Vietnam', city: 'Ha Noi', flag: 'VN', signalStrength: 3 },
//     // Add more locations as needed
// ];
// const LocationSelectionScreen = ({ navigation, route }) => {
//     const [search, setSearch] = useState('');
//     const [filteredLocations, setFilteredLocations] = useState(locations);
//     const [selectedLocation, setSelectedLocation] = useState(null);

//     const handleSearch = (text) => {
//         setSearch(text);
//         const filtered = locations.filter((location) => {
//             const country = location.country ? location.country.toLowerCase() : '';
//             const city = location.city ? location.city.toLowerCase() : '';
//             return country.includes(text.toLowerCase()) || city.includes(text.toLowerCase());
//         });
//         setFilteredLocations(filtered);
//     };

//     const handleLocationSelect = (location) => {
//         console.log('whats i', location)
//         setSelectedLocation(location);
//         navigation.navigate('HomeScreen', { selectedLocation: location });
//     };

//     const renderLocationItem = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.locationItem,
//                 selectedLocation?.id === item.id && styles.selectedLocationItem,
//             ]}
//             onPress={() => handleLocationSelect(item)}
//         >
//             <View style={styles.locationInfo}>
//                 <CountryFlag isoCode={item.flag} size={32} />
//                 <View style={styles.locationDetails}>
//                     <Text style={styles.locationText}>{item.country}</Text>
//                     <Text style={styles.cityText}>{item.city}</Text>
//                 </View>
//             </View>
//             <Icon name="signal-cellular-alt" size={24} color="green" />
//         </TouchableOpacity>
//     );

    
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Change Location</Text>
//             <View style={styles.searchContainer}>
//                 <Icon name="search" size={24} color="white" style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search"
//                     placeholderTextColor="#888"
//                     value={search}
//                     onChangeText={handleSearch}
//                 />
//             </View>
//             <FlatList
//                 data={filteredLocations}
//                 renderItem={renderLocationItem}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={styles.listContainer}
//                 keyboardShouldPersistTaps='always'
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#1c161b',
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//     },
//     title: {
//         fontSize: 20,
//         color: 'orange',
//         fontWeight: 'bold',
//         marginBottom: 20,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#333',
//         borderRadius: 10,
//         paddingHorizontal: 10,
//         marginBottom: 20,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         color: 'white',
//     },
//     listContainer: {
//         paddingBottom: 20,
//     },
//     locationItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#333',
//         paddingHorizontal: 10,
//     },
//     selectedLocationItem: {
//         backgroundColor: 'orange',
//     },
//     locationInfo: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     locationDetails: {
//         marginLeft: 10,
//     },
//     locationText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     cityText: {
//         color: '#ccc',
//         fontSize: 14,
//     },
// });

// export default LocationSelectionScreen;


// //////////////////////////////////////////////////////

// // import React, { useState, useEffect } from 'react';
// // import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import CountryFlag from "react-native-country-flag";
// //  import Papa from "papaparse";
// // import { useIsFocused } from '@react-navigation/native';



// // const vpnData = [
// //     // Your VPN data array here
// // ];

// // const LocationSelectionScreen = () => {
// //     const [searchQuery, setSearchQuery] = useState('');
// //     const [filteredData, setFilteredData] = useState(vpnServers);

// //     const isfocused = useIsFocused();


// //   const [vpnServers, setVpnServers] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   const getVPNServers = async () => {
   
// //     try {
// //       const response = await fetch("http://www.vpngate.net/api/iphone/");
// //       if (!response.ok) throw new Error("Network response was not ok");
// //       const data = await response.text();

// //       const parts = data.split("#");
// //       if (parts.length < 2) {
// //         throw new Error("Unexpected data format");
// //       }

// //       const csvString = parts[1].split("*").join("");

// //       Papa.parse(csvString, {
// //         header: false,
// //         skipEmptyLines: true,
// //         complete: (results) => {
// //           const csvList = results.data;
// //           const header = csvList[0];
// //           const servers = csvList.slice(1).map((row) => {
// //             const tempJson = {};
// //             for (let j = 0; j < header.length; j++) {
// //               tempJson[header[j]] = row[j];
// //             }
// //             return tempJson;
// //           });
// //           setVpnServers(servers);
// //           console.log('server--',servers)
// //           setLoading(false); // Hide loading spinner after fetching
// //         },
// //       });
// //     } catch (error) {
// //       console.error("Error fetching or processing data:", error);
// //       setLoading(false); // Hide loading spinner on error
// //     }
// //   };
// //   useEffect(() => {
// //     getVPNServers();
// //   }, [isfocused]);
// //   const reloadServers = () => {
// //     getVPNServers();
// //   };

// //   console.log('servers---', vpnServers)









// //     const handleSearch = (query) => {
// //         setSearchQuery(query);
// //         if (query.trim() === '') {
// //             setFilteredData(vpnServers);
// //         } else {
// //             const filtered = vpnServers.filter(item =>
// //                 item.CountryLong.toLowerCase().includes(query.toLowerCase()) ||
// //                 item.HostName.toLowerCase().includes(query.toLowerCase()) ||
// //                 item.IP.toLowerCase().includes(query.toLowerCase())
// //             );
// //             setFilteredData(filtered);
// //         }
// //     };



// //         const handleLocationSelect = (location) => {
// //         console.log('whats i', location)
// //         setSelectedLocation(location);
// //         navigation.navigate('HomeScreen', { selectedLocation: location });
// //     };

// //     const renderItem = ({ item }) => (
// //         <TouchableOpacity
// //             style={[
// //                 styles.locationItem,
// //                 selectedLocation?.id === item.id && styles.selectedLocationItem,
// //             ]}
// //             onPress={() => handleLocationSelect(item)}
// //         >
// //             <View style={styles.locationInfo}>
// //                 {/* <CountryFlag isoCode={item.flag} size={32} /> */}
// //                 <View style={styles.locationDetails}>
// //                     <Text style={styles.locationText}>{item.CountryLong}</Text>
// //                     <Text style={styles.cityText}>{item.HostName}</Text>
// //                 </View>
// //             </View> 
// //             <Icon name="signal-cellular-alt" size={24} color="green" />
// //         </TouchableOpacity>
// //     );

// //     // const renderItem = ({ item }) => (
// //     //     <View style={styles.itemContainer}>
// //     //         <Text style={styles.itemText}>Country: {item.CountryLong}</Text>
// //     //         <Text style={styles.itemText}>Host: {item.HostName}</Text>
// //     //         <Text style={styles.itemText}>IP: {item.IP}</Text>
// //     //     </View>
// //     // );

// //     return (
// //         <View style={styles.container}>
// //             <View style={styles.searchContainer}>
// //                 <Icon name="search" size={24} color="white" style={styles.searchIcon} />
// //                 <TextInput
// //                     style={styles.searchInput}
// //                     placeholder="Search by Country, Hostname, or IP"
// //                     placeholderTextColor="#888"
// //                     value={searchQuery}
// //                     onChangeText={handleSearch}
// //                 />
// //             </View>

// //             <FlatList
// //                 data={vpnServers}
// //                 renderItem={renderItem}
// //                 keyExtractor={item => item.IP}
// //                 contentContainerStyle={styles.listContainer}
// //             />
// //         </View>
// //     );
// // };

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#1c161b',
// //         paddingHorizontal: 10,
// //         paddingVertical: 10,
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         backgroundColor: '#333',
// //         marginHorizontal: 10,
// //         marginVertical: 10,
// //         borderRadius: 10,
// //         paddingHorizontal: 10,
// //     },
// //     searchIcon: {
// //         marginRight: 10,
// //     },
// //     searchInput: {
// //         flex: 1,
// //         color: 'white',
// //     },
// //     listContainer: {
// //         paddingHorizontal: 10,
// //         paddingVertical: 10,
// //     },
// //     itemContainer: {
// //         paddingVertical: 15,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#333',
// //     },
// //     itemText: {
// //         color: 'white',
// //         fontSize: 16,
// //     },










// //     title: {
// //         fontSize: 20,
// //         color: 'orange',
// //         fontWeight: 'bold',
// //         marginBottom: 20,
// //     },
// //     searchContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         backgroundColor: '#333',
// //         borderRadius: 10,
// //         paddingHorizontal: 10,
// //         marginBottom: 20,
// //     },
// //     searchIcon: {
// //         marginRight: 10,
// //     },
// //     searchInput: {
// //         flex: 1,
// //         color: 'white',
// //     },
// //     listContainer: {
// //         paddingBottom: 20,
// //     },
// //     locationItem: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingVertical: 15,
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#333',
// //         paddingHorizontal: 10,
// //     },
// //     selectedLocationItem: {
// //         backgroundColor: 'orange',
// //     },
// //     locationInfo: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     locationDetails: {
// //         marginLeft: 10,
// //     },
// //     locationText: {
// //         color: 'white',
// //         fontSize: 16,
// //     },
// //     cityText: {
// //         color: '#ccc',
// //         fontSize: 14,
// //     },
// // });

// // export default LocationSelectionScreen;



import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator , Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryFlag from 'react-native-country-flag';
import Papa from 'papaparse';
import Images from '../constants/Image';

import Ionicons from 'react-native-vector-icons/Ionicons';
const LocationSelectionScreen = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [vpnServers, setVpnServers] = useState([]);
    const [filteredVpnServers, setFilteredVpnServers] = useState([]);
    const [selectedVpn, setSelectedVpn] = useState(null);
    const [loading, setLoading] = useState(true);

    // const getVPNServers = async () => {
    //     console.log('call')
    //     setLoading(true);
    //     try {
    //         const response = await fetch('http://www.vpngate.net/api/iphone/');
    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const data = await response.text();

    //         const parts = data.split('#');
    //         if (parts.length < 2) {
    //             throw new Error('Unexpected data format');
    //         }

    //         const csvString = parts[1].split('*').join('');
    //         Papa.parse(csvString, {
    //             header: false,
    //             skipEmptyLines: true,
    //             complete: (results) => {
    //                 const csvList = results.data;
    //                 const header = csvList[0];
    //                 const servers = csvList.slice(1).map((row) => {
    //                     const tempJson = {};
    //                     for (let j = 0; j < header.length; j++) {
    //                         tempJson[header[j]] = row[j];
    //                     }
    //                     return tempJson;
    //                 });
    //                 // setVpnServers(servers);
    //                 // console.log('----------servers', servers)
    //                 setFilteredVpnServers(servers);
    //                 setLoading(false); // Hide loading spinner after fetching
    //             },
    //         });
    //     } catch (error) {
    //         console.error('Error fetching or processing data:', error);
    //         setLoading(false); // Hide loading spinner on error
    //     }
    // };



    // const getVPNServers = async () => {
    //     console.log('call');
    //     setLoading(true);
    //     try {
    //         const response = await fetch('http://www.vpngate.net/api/iphone/');
    //         if (!response.ok) throw new Error('Network response was not ok');
    //         const data = await response.text();
    
    //         const parts = data.split('#');
    //         if (parts.length < 2) {
    //             throw new Error('Unexpected data format');
    //         }
    
    //         const csvString = parts[1].split('*').join('');
    //         Papa.parse(csvString, {
    //             header: false,
    //             skipEmptyLines: true,
    //             complete: async (results) => {
    //                 const csvList = results.data;
    //                 const header = csvList[0];
    //                 const servers = csvList.slice(1).map((row) => {
    //                     const tempJson = {};
    //                     for (let j = 0; j < header.length; j++) {
    //                         tempJson[header[j]] = row[j];
    //                     }
    //                     return tempJson;
    //                 });
    
    //                 // Fetch region data for each server based on IP
    //                 const serversWithRegion = await Promise.all(
    //                     servers.map(async (server) => {
    //                         const ip = server.IP; // Extract IP from server
    //                         if (ip) {
    //                             // const regionResponse = await fetch(`https://ipinfo.io/${ip}/json`);
    //                             const regionResponse = await fetch(`https://ipwhois.app/json/${ip}`);
    //                             const regionData = await regionResponse.json();
    //                             // Combine the original server data with the region data
    //                             return { ...server, region: regionData.region };
    //                         }
    //                         return server; // Return the server as-is if no IP
    //                     })
    //                 );
    //                 // console.log('SERVER-----------------', serversWithRegion)
    //                 setFilteredVpnServers(serversWithRegion);
    //                 setLoading(false); // Hide loading spinner after fetching
    //             },
    //         });
    //     } catch (error) {
    //         console.error('Error fetching or processing data:', error);
    //         setLoading(false); // Hide loading spinner on error
    //     }
    // };
    

    const getVPNServers = async () => {
      console.log('call');
      setLoading(true);
      
      try {
          // Check if VPN servers are already stored in AsyncStorage
          const cachedData = await AsyncStorage.getItem('vpnServers');
          if (cachedData) {
              // Use cached data
              const parsedServers = JSON.parse(cachedData);
              setFilteredVpnServers(parsedServers);
              setLoading(false); // Stop loading as the data is already available
              return;
          }
          console.log('storage data hai????', cachedData)
          // If no cached data, call the API
          const response = await fetch('http://www.vpngate.net/api/iphone/');
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.text();
  
          const parts = data.split('#');
          if (parts.length < 2) {
              throw new Error('Unexpected data format');
          }
  
          const csvString = parts[1].split('*').join('');
          Papa.parse(csvString, {
              header: false,
              skipEmptyLines: true,
              complete: async (results) => {
                  const csvList = results.data;
                  const header = csvList[0];
                  const servers = csvList.slice(1).map((row) => {
                      const tempJson = {};
                      for (let j = 0; j < header.length; j++) {
                          tempJson[header[j]] = row[j];
                      }
                      return tempJson;
                  });
  
                  // Fetch region data for each server based on IP
                  const serversWithRegion = await Promise.all(
                      servers.map(async (server) => {
                          const ip = server.IP; // Extract IP from server
                          if (ip) {
                              const regionResponse = await fetch(`https://ipwhois.app/json/${ip}`);
                              const regionData = await regionResponse.json();
                              // Combine the original server data with the region data
                              return { ...server, region: regionData.region };
                          }
                          return server; // Return the server as-is if no IP
                      })
                  );
  
                  // Store the fetched servers with region data in AsyncStorage
                  await AsyncStorage.setItem('vpnServers', JSON.stringify(serversWithRegion));
  
                  // Set the state with the fetched data
                  setFilteredVpnServers(serversWithRegion);
                  setLoading(false); // Hide loading spinner after fetching
              },
          });
      } catch (error) {
          // console.error('Error fetching or processing data:', error);
          setLoading(false); // Hide loading spinner on error
      }
  };


    useEffect(() => {
        getVPNServers();
    }, []);


  const reloadServers = () => {
    getVPNServers();
  };


  const [vpnList, setVpnList] = useState([]);
   useEffect(() => {
    // Initialize VPNs
    initVpn();
  

  
  }, []);

  const initVpn = async () => {
    const vpnList = [
      {
        country: "Japan",
        username: "vpn",
        password: "vpn",
        config: await fetchConfigFile(),
      },
 
    ];
    setVpnList(vpnList);
    // setSelectedVpn(vpnList[0]);
  };






  // Utility to determine signal strength based on speed
  const getSignalStrength = (speed) => {
    if (speed > 100000000) {
      return 4; // Strong signal
    } else if (speed > 50000000) { 
      return 3; // Good signal
    } else if (speed > 10000000) {
      return 2; // Moderate signal
    } else {
      return 1; // Weak signal
    }
  };

  // Dynamically calculate signal strength
  const signalStrength = filteredVpnServers ? getSignalStrength(filteredVpnServers.Speed) : 1;

  // Function to render signal bars based on signal strength
  const renderSignalBars = (signalStrength) => {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      bars.push(
        <View
          key={i}
          style={[
            styles.signalBar,
            { height: 10 * i },
            // { opacity: i <= signalStrength ? 1 : 0.1 } // Dim the bars based on signal strength
            i <= signalStrength ? styles.activeBar : styles.inactiveBar,
        ]}
        />
      );
    }
    return bars;
  };
  






  const fetchConfigFile = async () => {
    return configFile;
    // return JAPAN_OVPN_CONFIG;
  };
  const configFile = `###############################################################################
# OpenVPN 2.0 Sample Configuration File
# for PacketiX VPN / SoftEther VPN Server
# 
# !!! AUTO-GENERATED BY SOFTETHER VPN SERVER MANAGEMENT TOOL !!!
# 
# !!! YOU HAVE TO REVIEW IT BEFORE USE AND MODIFY IT AS NECESSARY !!!
# 
# This configuration file is auto-generated. You might use this config file
# in order to connect to the PacketiX VPN / SoftEther VPN Server.
# However, before you try it, you should review the descriptions of the file
# to determine the necessity to modify to suitable for your real environment.
# If necessary, you have to modify a little adequately on the file.
# For example, the IP address or the hostname as a destination VPN Server
# should be confirmed.
# 
# Note that to use OpenVPN 2.0, you have to put the certification file of
# the destination VPN Server on the OpenVPN Client computer when you use this
# config file. Please refer the below descriptions carefully.


###############################################################################
# Specify the type of the layer of the VPN connection.
# 
# To connect to the VPN Server as a "Remote-Access VPN Client PC",
#  specify 'dev tun'. (Layer-3 IP Routing Mode)
#
# To connect to the VPN Server as a bridging equipment of "Site-to-Site VPN",
#  specify 'dev tap'. (Layer-2 Ethernet Bridgine Mode)

dev tun


###############################################################################
# Specify the underlying protocol beyond the Internet.
# Note that this setting must be correspond with the listening setting on
# the VPN Server.
# 
# Specify either 'proto tcp' or 'proto udp'.

proto tcp


###############################################################################
# The destination hostname / IP address, and port number of
# the target VPN Server.
# 
# You have to specify as 'remote <HOSTNAME> <PORT>'. You can also
# specify the IP address instead of the hostname.
# 
# Note that the auto-generated below hostname are a "auto-detected
# IP address" of the VPN Server. You have to confirm the correctness
# beforehand.
# 
# When you want to connect to the VPN Server by using TCP protocol,
# the port number of the destination TCP port should be same as one of
# the available TCP listeners on the VPN Server.
# 
# When you use UDP protocol, the port number must same as the configuration
# setting of "OpenVPN Server Compatible Function" on the VPN Server.

remote 219.100.37.169 443


###############################################################################
# The HTTP/HTTPS proxy setting.
# 
# Only if you have to use the Internet via a proxy, uncomment the below
# two lines and specify the proxy address and the port number.
# In the case of using proxy-authentication, refer the OpenVPN manual.

;http-proxy-retry
;http-proxy [proxy server] [proxy port]


###############################################################################
# The encryption and authentication algorithm.
# 
# Default setting is good. Modify it as you prefer.
# When you specify an unsupported algorithm, the error will occur.
# 
# The supported algorithms are as follows:
#  cipher: [NULL-CIPHER] NULL AES-128-CBC AES-192-CBC AES-256-CBC BF-CBC
#          CAST-CBC CAST5-CBC DES-CBC DES-EDE-CBC DES-EDE3-CBC DESX-CBC
#          RC2-40-CBC RC2-64-CBC RC2-CBC
#  auth:   SHA SHA1 MD5 MD4 RMD160

cipher AES-128-CBC
auth SHA1


###############################################################################
# Other parameters necessary to connect to the VPN Server.
# 
# It is not recommended to modify it unless you have a particular need.

resolv-retry infinite
nobind
persist-key
persist-tun
client
verb 3
#auth-user-pass


###############################################################################
# The certificate file of the destination VPN Server.
# 
# The CA certificate file is embedded in the inline format.
# You can replace this CA contents if necessary.
# Please note that if the server certificate is not a self-signed, you have to
# specify the signer's root certificate (CA) here.

<ca>
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----

</ca>


###############################################################################
# The client certificate file (dummy).
# 
# In some implementations of OpenVPN Client software
# (for example: OpenVPN Client for iOS),
# a pair of client certificate and private key must be included on the
# configuration file due to the limitation of the client.
# So this sample configuration file has a dummy pair of client certificate
# and private key as follows.

<cert>
-----BEGIN CERTIFICATE-----
MIICxjCCAa4CAQAwDQYJKoZIhvcNAQEFBQAwKTEaMBgGA1UEAxMRVlBOR2F0ZUNs
aWVudENlcnQxCzAJBgNVBAYTAkpQMB4XDTEzMDIxMTAzNDk0OVoXDTM3MDExOTAz
MTQwN1owKTEaMBgGA1UEAxMRVlBOR2F0ZUNsaWVudENlcnQxCzAJBgNVBAYTAkpQ
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5h2lgQQYUjwoKYJbzVZA
5VcIGd5otPc/qZRMt0KItCFA0s9RwReNVa9fDRFLRBhcITOlv3FBcW3E8h1Us7RD
4W8GmJe8zapJnLsD39OSMRCzZJnczW4OCH1PZRZWKqDtjlNca9AF8a65jTmlDxCQ
CjntLIWk5OLLVkFt9/tScc1GDtci55ofhaNAYMPiH7V8+1g66pGHXAoWK6AQVH67
XCKJnGB5nlQ+HsMYPV/O49Ld91ZN/2tHkcaLLyNtywxVPRSsRh480jju0fcCsv6h
p/0yXnTB//mWutBGpdUlIbwiITbAmrsbYnjigRvnPqX1RNJUbi9Fp6C2c/HIFJGD
ywIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQChO5hgcw/4oWfoEFLu9kBa1B//kxH8
hQkChVNn8BRC7Y0URQitPl3DKEed9URBDdg2KOAz77bb6ENPiliD+a38UJHIRMqe
UBHhllOHIzvDhHFbaovALBQceeBzdkQxsKQESKmQmR832950UCovoyRB61UyAV7h
+mZhYPGRKXKSJI6s0Egg/Cri+Cwk4bjJfrb5hVse11yh4D9MHhwSfCOH+0z4hPUT
Fku7dGavURO5SVxMn/sL6En5D+oSeXkadHpDs+Airym2YHh15h0+jPSOoR6yiVp/
6zZeZkrN43kuS73KpKDFjfFPh8t4r1gOIjttkNcQqBccusnplQ7HJpsk
-----END CERTIFICATE-----

</cert>

<key>
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA5h2lgQQYUjwoKYJbzVZA5VcIGd5otPc/qZRMt0KItCFA0s9R
wReNVa9fDRFLRBhcITOlv3FBcW3E8h1Us7RD4W8GmJe8zapJnLsD39OSMRCzZJnc
zW4OCH1PZRZWKqDtjlNca9AF8a65jTmlDxCQCjntLIWk5OLLVkFt9/tScc1GDtci
55ofhaNAYMPiH7V8+1g66pGHXAoWK6AQVH67XCKJnGB5nlQ+HsMYPV/O49Ld91ZN
/2tHkcaLLyNtywxVPRSsRh480jju0fcCsv6hp/0yXnTB//mWutBGpdUlIbwiITbA
mrsbYnjigRvnPqX1RNJUbi9Fp6C2c/HIFJGDywIDAQABAoIBAERV7X5AvxA8uRiK
k8SIpsD0dX1pJOMIwakUVyvc4EfN0DhKRNb4rYoSiEGTLyzLpyBc/A28Dlkm5eOY
fjzXfYkGtYi/Ftxkg3O9vcrMQ4+6i+uGHaIL2rL+s4MrfO8v1xv6+Wky33EEGCou
QiwVGRFQXnRoQ62NBCFbUNLhmXwdj1akZzLU4p5R4zA3QhdxwEIatVLt0+7owLQ3
lP8sfXhppPOXjTqMD4QkYwzPAa8/zF7acn4kryrUP7Q6PAfd0zEVqNy9ZCZ9ffho
zXedFj486IFoc5gnTp2N6jsnVj4LCGIhlVHlYGozKKFqJcQVGsHCqq1oz2zjW6LS
oRYIHgECgYEA8zZrkCwNYSXJuODJ3m/hOLVxcxgJuwXoiErWd0E42vPanjjVMhnt
KY5l8qGMJ6FhK9LYx2qCrf/E0XtUAZ2wVq3ORTyGnsMWre9tLYs55X+ZN10Tc75z
4hacbU0hqKN1HiDmsMRY3/2NaZHoy7MKnwJJBaG48l9CCTlVwMHocIECgYEA8jby
dGjxTH+6XHWNizb5SRbZxAnyEeJeRwTMh0gGzwGPpH/sZYGzyu0SySXWCnZh3Rgq
5uLlNxtrXrljZlyi2nQdQgsq2YrWUs0+zgU+22uQsZpSAftmhVrtvet6MjVjbByY
DADciEVUdJYIXk+qnFUJyeroLIkTj7WYKZ6RjksCgYBoCFIwRDeg42oK89RFmnOr
LymNAq4+2oMhsWlVb4ejWIWeAk9nc+GXUfrXszRhS01mUnU5r5ygUvRcarV/T3U7
TnMZ+I7Y4DgWRIDd51znhxIBtYV5j/C/t85HjqOkH+8b6RTkbchaX3mau7fpUfds
Fq0nhIq42fhEO8srfYYwgQKBgQCyhi1N/8taRwpk+3/IDEzQwjbfdzUkWWSDk9Xs
H/pkuRHWfTMP3flWqEYgW/LW40peW2HDq5imdV8+AgZxe/XMbaji9Lgwf1RY005n
KxaZQz7yqHupWlLGF68DPHxkZVVSagDnV/sztWX6SFsCqFVnxIXifXGC4cW5Nm9g
va8q4QKBgQCEhLVeUfdwKvkZ94g/GFz731Z2hrdVhgMZaU/u6t0V95+YezPNCQZB
wmE9Mmlbq1emDeROivjCfoGhR3kZXW1pTKlLh6ZMUQUOpptdXva8XxfoqQwa3enA
M7muBbF0XN7VO80iJPv+PmIZdEIAkpwKfi201YB+BafCIuGxIF50Vg==
-----END RSA PRIVATE KEY-----

</key>

`





    const handleSearch = (text) => {
        
        setSearch(text);
        const filtered = filteredVpnServers.filter((vpn) => {
            const country = vpn.CountryLong ? vpn.CountryLong.toLowerCase() : '';
            const ip = vpn.IP ? vpn.IP.toLowerCase() : '';
            return country.includes(text.toLowerCase()) || ip.includes(text.toLowerCase());
        });
        setFilteredVpnServers(filtered);
    };

    const handleLocationSelect = (location) => {
        
        setSelectedVpn(location);
        navigation.navigate('HomeScreen', { selectedVpn: location });
    };

    // const renderVpnItem = ({ item }) => (
    //     <TouchableOpacity
    //         style={[styles.locationItem, selectedVpn?.HostName === item.HostName && styles.selectedLocationItem]}
    //         onPress={() => handleLocationSelect(item)}
    //     >
    //         <View style={styles.locationInfo}>
    //             <CountryFlag isoCode={item.CountryShort} size={32} />
    //             <View style={styles.locationDetails}>
    //                 <Text style={styles.locationText}>{item.CountryLong}</Text>
    //                 <Text style={styles.cityText}>{item.HostName}</Text>
    //             </View>
    //         </View>
    //         <Image source={Images.InternetWaves} />
          
    //     </TouchableOpacity>
    // );


    const renderVpnItem = ({ item }) => {
        // Calculate the signal strength for the current item
        const signalStrength = item ? getSignalStrength(item.Speed) : 1;
      
        return (
          <TouchableOpacity
            style={[
              styles.locationItem,
              selectedVpn?.HostName === item.HostName && styles.selectedLocationItem
            ]}
            onPress={() => handleLocationSelect(item)}
          >
            <View style={styles.locationInfo}>
              <CountryFlag isoCode={item.CountryShort} size={34 } />
              <View style={styles.locationDetails}>
                <Text style={styles.locationText}>{item.CountryLong}</Text>
                <Text style={styles.cityText}>{item.region}</Text>
              </View>
            </View>
            {/* Render the signal bars based on signal strength */}
            <View style={styles.signalBarsContainer}>
              {renderSignalBars(signalStrength)}
            </View>
          </TouchableOpacity>
        );
      };
      
      
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Location</Text>
            <View style={styles.searchContainer}>
            <Image source={Images.Search} />
          
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            {/* <FlatList
                    data={vpnList}
                    keyExtractor={(item) => item.HostName}
                    renderItem={renderVpnItem}
                    contentContainerStyle={styles.listContainer}
                /> */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="orange" />
                </View>
            ) : (
                <FlatList
                    data={filteredVpnServers}
                    keyExtractor={(item) => item.HostName}
                    renderItem={renderVpnItem}
                    contentContainerStyle={styles.listContainer}
                />
            )}
             <TouchableOpacity style={styles.reloadButton} onPress={reloadServers}>
        {/* <Text style={styles.buttonText}>Reload</Text> */}
        
        <Ionicons name="reload-circle" color={'orange'} size={60} />
      </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c161b',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 20,
        color: 'orange',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: 'white',
    },
    listContainer: {
        paddingBottom: 20,
    },
    locationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: '#333',
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF1A',
        borderRadius:8, 
        marginBottom:10
    },
    selectedLocationItem: {
        backgroundColor: 'orange',
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
      
    },
    locationDetails: {
        marginLeft: 10,
    },
    locationText: {
        color: '#DBD6CE',
        fontSize: 16,
        fontFamily: "Poppins-Medium",
    },
    cityText: {
        color: '#DBD6CE',
        fontSize: 14,
        fontFamily: "Poppins-Light",
    },
      reloadButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    // backgroundColor: "orange",
    borderRadius: 40,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },




   // Container for the signal bars
   signalBarsContainer: {
    flexDirection: 'row',

    alignItems: 'flex-end',
    marginTop: 1,
  },
  // Single signal bar style
  signalBar: {
    width: 6,
    // height: 20,
    backgroundColor: '#00ff00', // Green bars
    marginHorizontal: 2,
  },

  activeBar: {
    backgroundColor: 'green',
  },
  inactiveBar: {
    backgroundColor: '#ccc',
  },
});

export default LocationSelectionScreen;
