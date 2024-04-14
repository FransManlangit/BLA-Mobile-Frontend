import React, { useContext, useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";


const DateSchedule = () => {
  const context = useContext(AuthGlobal);
  const [requests, setRequests] = useState([]);
  const navigation = useNavigation();

  const handleRequestPress = (request) => {
    navigation.navigate("DateDetail", { request });
  };

  useEffect(() => {
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
          .then((user) => {
            // setUserProfile(user.data);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}schedules/userSchedule/${context.stateUser.user.userId}`)
      .then((res) => setRequests(res.data))
      .catch((error) => console.log(error));

    return () => {
      // setUserProfile("");
      setRequests([]);
    };
  }, [context.stateUser.isAuthenticated]);

  const currentDate = new Date(); // Get current date

  return (
    <SafeAreaView>
      <View className="p-4 bg-white h-full w-full">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
        <View className="pt-8">
          <Text className="text-yellow-900 font-bold text-center tracking-wider text-3xl italic hover:not-italic">
            Date Schedule
          </Text>
          <View className="mt-8 p-4 rounded-lg shadow-md space-y-6">
            <Text className="text-sm">Today's Date</Text>
            <View className="mb-4">
              <Text className="font-semibold">
                {format(currentDate, "MMMM dd, yyyy")}
              </Text>
            </View>
            <View className="flex pt-2 p-2 flex-row space-x-8 items-center">
              <Text className="text-sm w-24">Date</Text>
              <Text className="text-sm w-22">Time</Text>
              <Text className="text-sm w-24">Purpose</Text>
            </View>
            {requests && requests.length > 0 ? (
              requests.map((request, index) => (
                <View>
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRequestPress(request)}
                  >
                    <View className="flex flex-row space-x-4">
                      <Text className="text-sm w-26">
                        {format(new Date(request.DateTime), "MMMM dd, yyyy")}
                      </Text>

                      <Text className="text-sm w-20">
                        {format(new Date(request.DateTime), "hh:mm:ss a")}
                      </Text>
                     
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View>
                <Text className="pt-8 text-center">You have no schedule</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DateSchedule;
