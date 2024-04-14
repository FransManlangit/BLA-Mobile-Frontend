import React, { useContext, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
  Text,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { COLORS, SIZES } from "../../assets/constants";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Shared/Header";
import {
  NativeBaseProvider,
  Box,
  HStack,
  VStack,
  FlatList,
  Heading,
  Avatar,
  Spacer,
  Center,
} from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { InformationCircleIcon } from "react-native-heroicons/mini";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { format } from "date-fns";

const StudentRequest = () => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const [orders, setOrders] = useState([]);
  const navigation = useNavigation();
  const [schedules, setSchedules] = useState([]);
  const dispatch = useDispatch();

  const handleOrderPress = (order) => {
    navigation.navigate("Order Details", { order });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }

      AsyncStorage.getItem("jwt")
        .then((res) => {
          axios

            .get(`${baseURL}users/${context.stateUser.user.userId}`, {
              headers: { Authorization: `Bearer ${res}` },
            })
            .then((user) => setUserProfile(user.data))
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));

      axios
        .get(`${baseURL}orders/orderItems/${context.stateUser.user.userId}`)
        .then((res) => setOrders(res.data))
        .catch((error) => console.log(error));

      axios
        .get(
          `${baseURL}schedules/userSchedule/${context.stateUser.user.userId}`
        )
        .then((res) => setSchedules(res.data))
        .catch((error) => console.log(error));

      return () => {
        setUserProfile("");
        setOrders([]);
        setSchedules([]);
      };
    }, [context.stateUser.isAuthenticated])
  );

  const currentDate = new Date();

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="flex ">
          <View className="flex-row justify-start pt-4">
            <View className="rounded-lg bg-[#B1A079] rounded-bl-3xl rounded-br-3xl  w-screen">
              <View className="flex-row justify-start pt-4">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
                >
                  <ArrowLeftIcon size="20" color="black" />
                </TouchableOpacity>
              </View>
              <Text className="text-3xl font-bold text-center text-[#FFFBF1] pt-6 pb-4">
                Request History
              </Text>
            </View>
          </View>

          <View className="pt-8 p-4">
            <View className="flex pt-16">
              <View className="flex flex-col space-y-2 pb-12">
                <View className="pl-4 flex flex-row space-x-4 items-center">
                  <InformationCircleIcon color={COLORS.versatilegray} />
                  <Text className="text-base">
                    Click the Status below to view more details.
                  </Text>
                </View>
                <View className="pl-4 flex flex-row space-x-4 items-center">
                  <InformationCircleIcon color={COLORS.versatilegray} />
                  <Text className="text-lg">Swipe left to view more</Text>
                </View>
              </View>
              <View className="items-center pb-12">
                <Text className="text-lg">Today's Date</Text>
                <View className="mb-4">
                  <Text className="font-semibold text-base">
                    {format(currentDate, "MMMM dd, yyyy")}
                  </Text>
                </View>
              </View>

              <KeyboardAwareScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-3"
              >
                <View className="flex pt-2 p-2 flex-row space-x-6 items-center">
                  <Text className="text-xl w-24">Order</Text>
                  <Text className="text-xl w-24">Status</Text>
                  <Text className="text-xl w-32">Date for claming</Text>
                  <Text className="text-xl w-24 text-center">Time</Text>
                </View>
              </KeyboardAwareScrollView>
              <KeyboardAwareScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="space-x-3"
              >
                <View className="flex-col space-y-6">
                  {orders && orders.length > 0 ? (
                    orders.map((order, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleOrderPress(order)}
                      >
                        <View className="flex-row space-x-2">
                          <Text className="text-lg w-20 text-center">
                            {" "}
                            {index + 1}
                          </Text>
                          <Text className="text-lg w-28 pl-6">
                            {order.orderStatus}
                          </Text>
                        </View>

                        <Spacer />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <View className="">
                      <Text className="">You have no Orders</Text>
                    </View>
                  )}
                  {schedules &&
                    schedules.length > 0 &&
                    schedules.map((schedule, index) => (
                      <View key={index} className="flex-row space-x-4">
                        <Text className="text-lg">
                          {format(new Date(schedule.DateTime), "MMMM dd, yyyy")}
                        </Text>
                        <Text className="text-lg">
                          {format(new Date(schedule.DateTime), "hh:mm:ss a")}
                        </Text>
                      </View>
                    ))}
                </View>
              </KeyboardAwareScrollView>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default StudentRequest;
