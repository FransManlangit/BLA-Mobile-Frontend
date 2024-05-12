import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const UpdateBalanceStatus = (props) => {
  const [amount, setAmount] = useState(0);
  const [errors, setErrors] = useState({});
  const [item, setItem] = useState();
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(false);


  const context = useContext(AuthGlobal);

  let navigation = useNavigation();

  useEffect(() => {
    setItem(props.route.params.item);

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {};
  }, []);

  // console.log("Items", props.route.params.item)
  // console.log(context.stateUser.user.userId, "userId");

  const validateForm = () => {
    let errors = {};

    if (!amount) errors.amount = "Amount is required";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const addPayment = async () => {
    if (!validateForm()) {
      return;
    }
  
  
    try {
      setLoading(true);
  
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
  
      const requestData = {
        amount: amount,
        user: item.user._id,
        cashierLastName: context.stateUser.user.lastname,
        cashierRole: context.stateUser.user.role,
      };
  
      const response = await axios.put(
        `${baseURL}balances/update-balance-status/${item.id}`,
        requestData,
        config
      );
  
      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Payment successfully updated",
          text2: "",
        });
        setTimeout(() => {
          navigation.navigate("CashierProfile"); // Navigate to the correct screen
        }, 500);
      }
    } catch (error) {
      console.error("Error adding payment:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Payment failed",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full p-4">
        <View
          className="flex-1 bg-white mt-5"
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <View className="form space-y-3 p-6 mt-5">
            <View>
              <Text className="font-bold text-2xl">Amount of Payment</Text>
            </View>

            <TextInput
              className={
                errors.amount
                  ? "border border-red-500 p-4 bg-gray-100 text-gray-700 rounded-2xl"
                  : "p-4 bg-gray-100 text-gray-700 rounded-2xl"
              }
              placeholder="Enter Amount"
              name="amount"
              id="amount"
              value={amount}
              keyboardType={"numeric"}
              onChangeText={(text) => setAmount(parseInt(text))}
            ></TextInput>

            <View className="">
              {errors.amount ? (
                <Text className="text-sm text-red-500">{errors.amount}</Text>
              ) : null}
            </View>
          </View>
          <View className="px-4 mb-4">
            <TouchableOpacity
              className="bg-[#FAE500] py-4 rounded-xl items-center mt-4"
              onPress={() => {
                addPayment();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="font-xl font-bold text-center text-zinc-700">
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#FAE500] py-4 rounded-xl items-center mt-4"
              onPress={() => navigation.goBack()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="font-xl font-bold text-center text-zinc-700">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateBalanceStatus;
