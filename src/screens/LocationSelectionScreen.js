
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CountryFlag from "react-native-country-flag";
 
const locations = [
    { id: 1, country: 'United Kingdom', city: 'London', flag: 'GB', signalStrength: 4 },
    { id: 2, country: 'Canada', city: 'Victoria', flag: 'CA', signalStrength: 3 },
    { id: 3, country: 'Canada', city: 'Ottawa', flag: 'CA', signalStrength: 4 },
    { id: 4, country: 'Germany', city: 'Berlin', flag: 'DE', signalStrength: 4 },
    { id: 5, country: 'Thailand', city: 'Bangkok', flag: 'TH', signalStrength: 3 },
    { id: 6, country: 'Iceland', city: 'Reykjavik', flag: 'IS', signalStrength: 4 },
    { id: 7, country: 'Vietnam', city: 'Ho Chi Minh', flag: 'VN', signalStrength: 3 },
    { id: 8, country: 'Vietnam', city: 'Ha Noi', flag: 'VN', signalStrength: 3 },
    // Add more locations as needed
];
const LocationSelectionScreen = ({ navigation, route }) => {
    const [search, setSearch] = useState('');
    const [filteredLocations, setFilteredLocations] = useState(locations);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const handleSearch = (text) => {
        setSearch(text);
        const filtered = locations.filter((location) => {
            const country = location.country ? location.country.toLowerCase() : '';
            const city = location.city ? location.city.toLowerCase() : '';
            return country.includes(text.toLowerCase()) || city.includes(text.toLowerCase());
        });
        setFilteredLocations(filtered);
    };

    const handleLocationSelect = (location) => {
        console.log('whats i', location)
        setSelectedLocation(location);
        navigation.navigate('HomeScreen', { selectedLocation: location });
    };

    const renderLocationItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.locationItem,
                selectedLocation?.id === item.id && styles.selectedLocationItem,
            ]}
            onPress={() => handleLocationSelect(item)}
        >
            <View style={styles.locationInfo}>
                <CountryFlag isoCode={item.flag} size={32} />
                <View style={styles.locationDetails}>
                    <Text style={styles.locationText}>{item.country}</Text>
                    <Text style={styles.cityText}>{item.city}</Text>
                </View>
            </View>
            <Icon name="signal-cellular-alt" size={24} color="green" />
        </TouchableOpacity>
    );

    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Change Location</Text>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="white" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={handleSearch}
                />
            </View>
            <FlatList
                data={filteredLocations}
                renderItem={renderLocationItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                keyboardShouldPersistTaps='always'
            />
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
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingHorizontal: 10,
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
        color: 'white',
        fontSize: 16,
    },
    cityText: {
        color: '#ccc',
        fontSize: 14,
    },
});

export default LocationSelectionScreen;


//////////////////////////////////////////////////////

// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import CountryFlag from "react-native-country-flag";
//  import Papa from "papaparse";
// import { useIsFocused } from '@react-navigation/native';



// const vpnData = [
//     // Your VPN data array here
// ];

// const LocationSelectionScreen = () => {
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredData, setFilteredData] = useState(vpnServers);

//     const isfocused = useIsFocused();


//   const [vpnServers, setVpnServers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getVPNServers = async () => {
   
//     try {
//       const response = await fetch("http://www.vpngate.net/api/iphone/");
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.text();

//       const parts = data.split("#");
//       if (parts.length < 2) {
//         throw new Error("Unexpected data format");
//       }

//       const csvString = parts[1].split("*").join("");

//       Papa.parse(csvString, {
//         header: false,
//         skipEmptyLines: true,
//         complete: (results) => {
//           const csvList = results.data;
//           const header = csvList[0];
//           const servers = csvList.slice(1).map((row) => {
//             const tempJson = {};
//             for (let j = 0; j < header.length; j++) {
//               tempJson[header[j]] = row[j];
//             }
//             return tempJson;
//           });
//           setVpnServers(servers);
//           console.log('server--',servers)
//           setLoading(false); // Hide loading spinner after fetching
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching or processing data:", error);
//       setLoading(false); // Hide loading spinner on error
//     }
//   };
//   useEffect(() => {
//     getVPNServers();
//   }, [isfocused]);
//   const reloadServers = () => {
//     getVPNServers();
//   };

//   console.log('servers---', vpnServers)









//     const handleSearch = (query) => {
//         setSearchQuery(query);
//         if (query.trim() === '') {
//             setFilteredData(vpnServers);
//         } else {
//             const filtered = vpnServers.filter(item =>
//                 item.CountryLong.toLowerCase().includes(query.toLowerCase()) ||
//                 item.HostName.toLowerCase().includes(query.toLowerCase()) ||
//                 item.IP.toLowerCase().includes(query.toLowerCase())
//             );
//             setFilteredData(filtered);
//         }
//     };



//         const handleLocationSelect = (location) => {
//         console.log('whats i', location)
//         setSelectedLocation(location);
//         navigation.navigate('HomeScreen', { selectedLocation: location });
//     };

//     const renderItem = ({ item }) => (
//         <TouchableOpacity
//             style={[
//                 styles.locationItem,
//                 selectedLocation?.id === item.id && styles.selectedLocationItem,
//             ]}
//             onPress={() => handleLocationSelect(item)}
//         >
//             <View style={styles.locationInfo}>
//                 {/* <CountryFlag isoCode={item.flag} size={32} /> */}
//                 <View style={styles.locationDetails}>
//                     <Text style={styles.locationText}>{item.CountryLong}</Text>
//                     <Text style={styles.cityText}>{item.HostName}</Text>
//                 </View>
//             </View> 
//             <Icon name="signal-cellular-alt" size={24} color="green" />
//         </TouchableOpacity>
//     );

//     // const renderItem = ({ item }) => (
//     //     <View style={styles.itemContainer}>
//     //         <Text style={styles.itemText}>Country: {item.CountryLong}</Text>
//     //         <Text style={styles.itemText}>Host: {item.HostName}</Text>
//     //         <Text style={styles.itemText}>IP: {item.IP}</Text>
//     //     </View>
//     // );

//     return (
//         <View style={styles.container}>
//             <View style={styles.searchContainer}>
//                 <Icon name="search" size={24} color="white" style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.searchInput}
//                     placeholder="Search by Country, Hostname, or IP"
//                     placeholderTextColor="#888"
//                     value={searchQuery}
//                     onChangeText={handleSearch}
//                 />
//             </View>

//             <FlatList
//                 data={vpnServers}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.IP}
//                 contentContainerStyle={styles.listContainer}
//             />
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#1c161b',
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     searchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#333',
//         marginHorizontal: 10,
//         marginVertical: 10,
//         borderRadius: 10,
//         paddingHorizontal: 10,
//     },
//     searchIcon: {
//         marginRight: 10,
//     },
//     searchInput: {
//         flex: 1,
//         color: 'white',
//     },
//     listContainer: {
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     itemContainer: {
//         paddingVertical: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#333',
//     },
//     itemText: {
//         color: 'white',
//         fontSize: 16,
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
