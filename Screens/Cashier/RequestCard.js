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
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";

// Define status codes
const codes = [
  { name: "Approved by Cashier", code: "Approved by Cashier" },
  { name: "Settle your Balance", code: "Settle your Balance" },
];

const RequestCard = ({ item }) => {
  const [requestStatus, setRequestStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [requestStatusChange, setRequestStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation();

  const updateRequest = async () => {
    try {
      // Retrieve token using async storage
      const token = await AsyncStorage.getItem("jwt");

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

      // Check if the request status is being updated to "Approved by Cashier"
      if (requestStatusChange === "Approved by Cashier") {
        // Fetch user balances
        const balancesResponse = await axios.get(`${baseURL}balances`);
        const balances = balancesResponse.data;

        // Check if any balance exists for the user
        if (balances && balances.length > 0) {
          // Find the user's balance record
          const userBalance = balances.find(
            (balance) => balance.user._id === item.user._id
          );

          // Check if the user has a balance record and the status is "Unsettled"
          if (userBalance && userBalance.status === "Unsettled") {
            // Display a message indicating that the status cannot be updated
            Toast.show({
              type: "info",
              text1: `Cannot update status. Student ${item.user.lastname} has a balance.`,
            });
            return;
          }
        }

        
      }

      // Proceed with updating the request
      const updatedResponse = await axios.put(
        `${baseURL}requests/${item.id}`,
        requestData,
        config
      );

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
    if (item.requestStatus === "Approved by Guidance") {
      setRequestStatus(<TrafficLight Approved by Guidance />);
      setStatusText("Approved by Guidance");
      setCardColor("#BABF5E");
    } else if (item.requestStatus === "Approved by Cashier") {
      setRequestStatus(<TrafficLight Approved by Cashier />);
      setStatusText("Approved by Cashier");
      setCardColor("#BABF5E");
    } else if (item.requestStatus === "Approved") {
      setRequestStatus(<TrafficLight Approved/>);
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
      setRequestStatus(<TrafficLight Pending Violation />);
      setStatusText("Pending Violation");
      setCardColor("#c6131b");
    } else if (item.requestStatus === "Pending Clearance") {
      setRequestStatus(<TrafficLight Pending Clearance />);
      setStatusText("Pending Clearance");
      setCardColor("#c6131b");
    } else if (item.requestStatus === "Settle your Balance") {
      setRequestStatus(<TrafficLight Settle your Balance />);
      setStatusText("Settle your Balance");
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
  }, [item]); // <-- Include 'item' as a dependency

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
