import React, { useEffect, useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  openList,
} from "react-native";
import {
  Picker,
  ScrollView,
  Select,
  FormControl,
  CheckIcon,
  Spacer,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import Toast from "react-native-toast-message";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";

// Define status codes
const codes = [
  { name: "Approved", code: "Approved" },
  { name: "Setel your Balance", code: "Setel your Balance" },
];

const RequestCard = ({ item }) => {
  const [requestStatus, setRequestStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [requestStatusChange, setRequestStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation();

  // Function to update the request
  const updateRequest = async () => {
    // Retrieve token using async storage
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
  
    // Define request configuration
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    // Prepare request data
    const requestData = {
      dateofRequest: item.dateofRequest,
      paidAt: item.paidAt,
      id: item.id,
      requestItems: item.requestItems,
      requestStatus: requestStatusChange,
      totalPrice: item.totalPrice,
      user: item.user,
      document: item.document,
      purpose: item.purpose,
      paymentInfo: item.paymentInfo,
    };
  
    // Make the PUT request to update the request
    try {
      // Check if status is "Approved"
      if (requestStatusChange === "Approved") {
        // Fetch user balances
        const balancesResponse = await axios.get(`${baseURL}balances`);
        const balances = balancesResponse.data;
  
        // Check if any balance exists for the user
        if (balances && balances.length > 0) {
          const studentHasBalance = balances.some((balance) => balance.user._id === item.user._id);
          if (studentHasBalance) {
            Toast.show({
              type: "info",
              text1: `Attention: Student ${item.user.lastname} has a balance.`,
            });
            return;
          }
        }
      }
  
      // Proceed with updating the request if no balance found
      const updatedResponse = await axios.put(`${baseURL}requests/${item.id}`, requestData, config);
  
      if (updatedResponse.status === 200 || updatedResponse.status === 201) {
        Toast.show({
          type: "success",
          text1: "Request Updated Successfully",
        });
        navigation.navigate("CashierProfile");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something Went Wrong",
        text2: "Please Try Again",
      });
      console.error("Update Request Failed:", error);
    }
  };
  
  
  

  useEffect(() => {
    // Set request status and card color based on item status
    if (item.requestStatus === "Approved") {
      setRequestStatus(<TrafficLight Approved />);
      setStatusText("Approved");
      setCardColor("#BABF5E");
    } else if (item.requestStatus === "Declined") {
      setRequestStatus(<TrafficLight Declined />);
      setStatusText("Declined");
      setCardColor("#c6131b");
    } else if (item.requestStatus === "Received") {
      setRequestStatus(<TrafficLight received />);
      setStatusText("Received");
      setCardColor("#006899");
    } else if (item.requestStatus === "Pending Violation") {
      setRequestStatus(<TrafficLight Pending Violation/>);
      setStatusText("Pending Violation");
      setCardColor("#c6131b");
    } else if (item.requestStatus === "Setel your Balance") {
      setRequestStatus(<TrafficLight Setel your Balance/>);
      setStatusText("Setel your Balance");
      setCardColor("#c6131b");
    }

    const getToken = async () => {
      try {
        const res = await AsyncStorage.getItem("jwt");
        if (res !== null) {
          setToken(res);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getToken();

    // Cleanup function
    return () => {
      setRequestStatus(null);
      setStatusText(null);
      setCardColor(null);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View className="p-4 bg-white rounded-lg mb-4">
        <View className="flex flex-col space-y-2 pb-2">
          <View className="flex flex-row">
            <Text>Tracking ID:</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              BLA-{item.id.substring(0, 7)}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Status:</Text>
            <Text className="text-zinc-700 text-right w-10/12 text-base">
              {" "}
              {statusText} {requestStatus}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Email:</Text>
            <Text className="text-zinc-700 text-right w-10/12 text-base">
              {item.user ? item.user.email : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Last Name</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              {item.user ? item.user.lastname : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Grade:</Text>
            <Text className="text-zinc-700 text-right w-10/12 text-base">
              {item.user ? item.user.grade : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Purpose:</Text>
            <Text className="text-zinc-700 text-right w-9/12 text-base">
              {item.user ? item.purpose : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Date of Request</Text>
            <Text className="text-zinc-700 text-right w-7/12 text-base">
              {item.dateofRequest.split("T")[0]}
            </Text>
          </View>
          <Spacer />
          <Text className="font-bold text-xl">Request List</Text>
          <View className="flex flex-col space-y-4">
            {item.requestItems.map((requestItem, index) => (
              <View key={index} className="flex flex-row">
                <Text className="text-base">{requestItem.document?.name}</Text>
              
              </View>
            ))}
          </View>
        </View>
        <View className="flex pt-4">
          <FormControl w="3/4" maxW="300">
            <FormControl.Label>Select Status</FormControl.Label>
            <Select
              minWidth="200"
              accessibilityLabel="Select Status"
              placeholder="Select Status"
              onValueChange={(e) => setRequestStatusChange(e)}
              selectedValue={requestStatusChange}
              _selectedItem={{
                bg: "yellow.300",
                endIcon: <CheckIcon size={5} />,
              }}
              mt="1"
            >
              {codes.map((c) => (
                <Select.Item key={c.code} label={c.name} value={c.code} />
              ))}
            </Select>
          </FormControl>
          <View className="items-center pt-4">
            <TouchableOpacity
             onPress={() => updateRequest()}
              className="py-3 bg-[#FAE500] rounded-xl w-28 h-12"
            >
              <Text className="text-base font-bold text-center text-gray-700">
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 2,
    // Add other styles as needed
  },
});

export default RequestCard;
