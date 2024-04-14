import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Error from "../../Shared/Error";
import baseURL from "../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import Toast from "react-native-toast-message";

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    try {
      if (!email.trim()) {
        setError("Email is required.");
        return;
      }
  
      const response = await axios.post(`${baseURL}users/resetPassword`, { email });
      if (response.data.success) {
        navigation.navigate("ResetPass", { email });
      } else {
        setError("There was an issue resetting your password. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while resetting your password.");
    }
  };

 

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="flex-1 bg-[#B1A079]">
          <SafeAreaView className="flex ">
            <View className="flex-row justify-start">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
              >
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-center pb-4">
              <Image
                source={require("../../assets/new-logo.png")}
                style={{ width: 190, height: 190 }}
              />
            </View>
          </SafeAreaView>
          <View
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            className="flex-1 bg-white px-8 pt-8"
          >
            <View className="flex-col flex p-4 items-center space-y-8">
              <Text className="text-2xl font-bold">Forgot Password</Text>
              <Text className="text-sm text-center font-normal tracking-wider">
                Enter your email Address below to reset your password.
              </Text>
            </View>
            <View className="form space-y-2">
              <Text className="text-gray-700 ml-4">Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              />

              <TouchableOpacity
                onPress={() => handleResetPassword()}
                className="py-3 bg-[#FAE500] rounded-xl "
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Resset Password
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-4 pb-2">
                <Text className="text-gray-500 font-semibold">Back to</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text className="font-semibold text-yellow-400"> Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-center mt-4 pb-2"></View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default ForgotPassword;
