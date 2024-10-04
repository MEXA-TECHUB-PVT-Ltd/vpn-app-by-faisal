import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import CustomHeader from "../components/CustomHeader";
import Images from "../constants/Image";
import CustomSnackbar from "../components/CustomSnackbar";

const GetPremiumScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [snackbarVisible, setsnackbarVisible] = useState(false);

  const subscriptionPlans = [
    { id: 1, period: "1 Month", price: "$1.99" },
    { id: 2, period: "6 Month", price: "$9.99" },
    { id: 3, period: "1 Year", price: "$16.99" },
    { id: 4, period: "2 Years", price: "$31.99" },
  ];

  const handleGetPremioum = (selectedPlan) => {
    console.log('selectedPlan', selectedPlan)
    handleUpdatePassword();
   
  };
  const handleSelectPlan = (period) => {
    console.log('id selected', period)
    setSelectedPlan(period);
  };

  const dismissSnackbar = () => {
    setsnackbarVisible(false);
  };
  const handleUpdatePassword = async () => {
    setsnackbarVisible(true);
    setTimeout(() => {
      setsnackbarVisible(false);
    }, 3000);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.planContainer,
        selectedPlan === item.period && styles.selectedPlanContainer,
      ]}
      onPress={() => handleSelectPlan(item.period)}
    >
      <View style={styles.planDetails}>
        <Text style={styles.periodText}>{item.period}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
      <View
        style={[
          styles.radioCircle,
          selectedPlan === item.id && styles.selectedRadioCircle,
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <CustomHeader
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ backgroundColor: "#FFFFFF", borderRadius: 30, padding: 5 }}
          >
            <Image source={Images.back} />
          </TouchableOpacity>
        }
        middleComponent={
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 22,
              fontFamily: "Poppins-Bold",
            }}
          >
            Get Premium
          </Text>
        }
      />

      <View style={{ marginTop: 20 }}>
        <Text style={styles.subHeaderText}>Select Your Subscription</Text>

        <FlatList
          data={subscriptionPlans}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
        />
      </View>
      <TouchableOpacity onPress={()=>handleGetPremioum(selectedPlan)}
        style={[
          styles.button,
          {
            backgroundColor: selectedPlan ? "#FFD700" : "#C2990A",
          },
        ]}
      >
        <Text style={styles.buttonText}>Get Premium and Enjoying</Text>
      </TouchableOpacity>
      <CustomSnackbar
          message="Success"
          messageDescription={`Thanks, You have selected ${selectedPlan} Plan`}
          onDismiss={dismissSnackbar} // Make sure this function is defined
          visible={snackbarVisible}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffa500",
    padding: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#FFFFFF",
  },
  subHeaderText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
  list: {
    flexGrow: 0,
  },
  planContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 2,
    borderColor: "#E7E2DA",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  selectedPlanContainer: {
    borderColor: "gray",
    // backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  planDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    marginRight: 6,
  },
  periodText: {
    fontSize: 16,
    color: "#292929",
    fontFamily: "Poppins-SemiBold",
  },
  priceText: {
    fontSize: 16,
    color: "#FFC700",
    fontFamily: "Poppins-SemiBold",
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#DBD6CE",
    alignSelf: "center",
  },
  selectedRadioCircle: {
    borderColor: "#DBD6CE",
    backgroundColor: "#FF9900",
  },
  button: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    bottom: 30,

    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#fff",
  },
});

export default GetPremiumScreen;
