import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Select, FormControl, CheckIcon, Spacer } from "native-base";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation} from "@react-navigation/native";

const SingleRequests = ({ navigation, route }) => {
  const [requestData, setRequestData] = useState(null);

  console.log("Request Data", requestData)
  const [requestStatusChange, setRequestStatusChange] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const { requestId } = route.params;
    fetchData(requestId);
  }, []);

  const fetchData = async (requestId) => {
    try {
      const response = await axios.get(`${baseURL}requests/${requestId}`);

      if (response.status === 200) {
        const responseData = response.data;
        setRequestData(responseData);
      } else {
        console.error(
          "Error fetching data: Unexpected status code",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const updateRequest = () => {
    if (!requestData) {
      return;
    }

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));


    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

 
    const request = {
      ...requestData,
      requestStatus: requestStatusChange,
    };

    // Make the PUT request
    axios
      .put(`${baseURL}requests/${requestData.id}`, request, config)
      .then((res) => {
        console.log(request, "HOTDOG");
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Request Edited",
            text2: "",
          });
          setTimeout(() => {
            navigation.navigate("Requests");
          }, 500);
        }
      })
      .catch((error) => {
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  if (!requestData) {
    return null; // Render nothing until data is fetched
  }


  return (
    <SafeAreaView>
      <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View className="p-4 bg-white rounded-lg mb-4">
        <View className="flex flex-col space-y-2 pb-2">
          <View className="flex flex-row">
            <Text>Tracking No:</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              {requestData.id}
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
              {requestData.user ? requestData.user.email : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Last Name</Text>
            <Text className="text-zinc-700 text-right w-9/12 text-base">
              {requestData.user ? requestData.user.lastname : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Grade:</Text>
            <Text className="text-zinc-700 text-right w-10/12 text-base">
              {requestData.user ? requestData.user.grade : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Purpose:</Text>
            <Text className="text-zinc-700 text-right w-9/12 text-base">
              {requestData.user ? requestData.purpose : ""}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Date of Order:</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              {requestData.dateofRequest}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Payment Method:</Text>
            <Text className="text-zinc-700 text-right w-6/12 text-base">
              {requestData.paymentInfo}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Reference Number:</Text>
            <Text className="text-zinc-700 text-right w-40 text-base">
              {requestData.referenceNumber}
            </Text>
          </View>
          <Spacer />
          <Text className="font-bold text-xl">Request List</Text>
          <View className="flex flex-col space-y-4">
            {requestData.requestItems.map((requestItem, index) => (
              <View key={index} className="flex flex-row">
                <Text className="text-base">{requestItem.document?.name}</Text>
                <Text className="text-zinc-700 w-5/12 text-base text-right">
                  {requestItem.document?.price}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex flex-row">
            <Text className="text-lg font-bold">Total:</Text>
            <Text className="text-green-950 text-right w-10/12 text-lg">
              ₱{requestData.totalPrice}.00
            </Text>
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
          <View className="requestDatas-center pt-4">
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 2,
    
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  button: {
    backgroundColor: "#FAE500",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
});

export default SingleRequests;
