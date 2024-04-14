import React, { useContext, useEffect, useState } from "react";
import { View, Image, Text } from "react-native";
import AuthGlobal from "../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  BellAlertIcon
} from "react-native-heroicons/solid";  

const Header = () => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.isAuthenticated) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [stateUser.isAuthenticated, stateUser.user.userId]);

  return (
    <SafeAreaView>
      {stateUser.isAuthenticated && userProfile ? (
        <View className="p-2 bg-[#B1A079] rounded-bl-3xl rounded-br-3xl">
          <View className="px-2 flex-row items-center space-x-4 pt-4">
            <Image
              className="rounded-full h-16 w-16"
              source={
                userProfile.avatar?.url
                  ? { uri: userProfile.avatar?.url }
                  : require("../assets/logo.png")
              }
            />
            <View className="flex">
              <Text className="text-white font-bold text-sm">Welcome,</Text>
              <Text className="font-semibold text-lg text-white">
                {`${userProfile.firstname} ${userProfile.lastname}`}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center", padding: 4, marginTop: 8, backgroundColor: "#B1A079" }}>
          <View style={{ borderRadius: 100, overflow: "hidden" }}>
            <Image
              style={{ width: 100, height: 100 }}
              source={require("../assets/logo.png")}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Header;
