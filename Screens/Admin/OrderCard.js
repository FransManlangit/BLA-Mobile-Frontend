import React, { useEffect, useState, useContext, useRef } from "react";
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
import { Spacer } from "native-base";

const codes = [
  { name: "Approved", code: "Approved" },
  { name: "Declined", code: "Declined" },
  { name: "Received", code: "Received" },
];

const OrderCard = ({ item }) => {
  const [orderStatus, setOrderStatus] = useState();
  const [statusText, setStatusText] = useState();
  const [orderStatusChange, setOrderStatusChange] = useState();
  const [token, setToken] = useState();
  const [cardColor, setCardColor] = useState();
  const navigation = useNavigation();
  const timeoutRef = useRef(null); // Ref for setTimeout

  const updateOrder = () => {
    // Retrieve token using async storage
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    // Define order configuration
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const order = {
      dateOrdered: item.dateOrdered,
      paidAt: item.paidAt,
      id: item.id,
      orderItems: item.orderItems,
      orderStatus: orderStatusChange,
      totalPrice: item.totalPrice,
      user: item.user,
      paymentInfo: item.paymentInfo,
      product: item.product,
      HasPaid: item.HasPaid,
    };

    // Make the PUT order
    axios
      .put(`${baseURL}orders/${item.id}`, order, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log("Order edited successfully");
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Order Edited",
            text2: "",
          });
          setTimeout(() => {
            console.log("Navigating to Orders screen");
            navigation.navigate("Orders");
          }, 500);
        }
      })
      .catch((error) => {
        console.log("Error editing order:", error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong",
          text2: "Please try again",
        });
      });
  };

  useEffect(() => {
    // Set order status and card color based on item status
    if (item.orderStatus === "Approved") {
      setOrderStatus(<TrafficLight Approved />);
      setStatusText("Approved");
      setCardColor("#BABF5E");
    } else if (item.orderStatus === "Declined") {
      setOrderStatus(<TrafficLight Declined />);
      setStatusText("Declined");
      setCardColor("#c6131b");
    } else if (item.orderStatus === "Received") {
      setOrderStatus(<TrafficLight Received />);
      setStatusText("Received");
      setCardColor("#006899");
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
    return () => {
      setOrderStatus(null);
      setStatusText(null);
      setCardColor(null);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View className="p-4 bg-white rounded-lg mb-4">
        <View className="flex flex-col space-y-2 pb-2">
          <View className="flex flex-row">
            <Text>Tracking No:</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              BLA-{item.id.substring(0, 7)}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Status:</Text>
            <Text className="text-zinc-700 text-right w-10/12 text-base">
              {" "}
              {statusText} {orderStatus}
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
            <Text className="text-zinc-700 text-right w-9/12 text-base">
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
            <Text className="text-base">Date of Order:</Text>
            <Text className="text-zinc-700 text-right w-8/12 text-base">
              {item.dateOrdered.split("T")[0]}
            </Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-base">Payment Method:</Text>
            <Text className="text-zinc-700 text-right w-6/12 text-base">
              {item.paymentInfo}
            </Text>
          </View>
          {item && (
            <View className="flex flex-row">
              <Text className="text-base">Payment Status:</Text>
              <Text className="text-zinc-700 text-right w-6/12 text-base">
                {item.HasPaid ? "Paid" : "Not Paid"}
              </Text>
            </View>
          )}
          <Spacer />
          <Text className="font-bold text-xl">Order List</Text>
          <View className="flex flex-col space-y-4">
            {item.orderItems.map((orderItem, index) => (
              <View key={index} className="flex flex-row">
                <Text className="text-base">
                  {orderItem.product?.productName}
                </Text>
                <Text className="text-zinc-700 w-7/12 text-base text-right">
                  {orderItem.product?.price}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex flex-row">
            <Text className="text-lg font-bold">Total:</Text>
            <Text className="text-green-950 text-right w-10/12 text-lg">
              ₱{item.totalPrice}.00
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
              onValueChange={(e) => setOrderStatusChange(e)}
              selectedValue={orderStatusChange}
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
              onPress={() => updateOrder()}
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

export default OrderCard;
