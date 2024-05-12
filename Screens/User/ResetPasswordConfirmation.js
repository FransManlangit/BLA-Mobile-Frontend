import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";


const ResetPasswordConfirmation = ({ route, navigation }) => {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");;

  const handleForgotPass = () => {
    navigation.navigate("ForgotPassword");
  };


  const handleResetPassword = async () => {
    try {
      if (!verificationCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
        setError("Verification code and passwords are required.");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
  
      const data = {
        email,
        verificationCode,
        password: newPassword,
      };
  
      const response = await axios.post(`${baseURL}users/resetPasswordConfirm`, data);
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successful',
          text2: 'You can now login with your new password.',
        });
        navigation.navigate("Login");
      } else {
        if (response.data.message === "Invalid verification code.") {
          Toast.show({
            type: 'error',
            text1: 'Invalid Verification Code',
            text2: 'The verification code you entered is invalid.',
          });
        } else {
          setError("There was an issue resetting your password. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while resetting your password.");
      Toast.show({
        type: 'error',
        text1: 'Invalid Verification Code',
        text2: 'An error occurred while resetting your password.',
      });
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
              <Text className="text-2xl font-bold text-center ">
                Reset Password Confirmation
              </Text>
            </View>
            <View className="form space-y-2">
              <Text className="text-gray-700 ml-4">Verification Code</Text>
              <TextInput
                value={verificationCode}
                onChangeText={setVerificationCode}
                placeholder="verification code"
                keyboardType={"numeric"}
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              />
              <Text className="text-gray-700 ml-4">New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholderTextColor={"black"}
                placeholder="new password"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              />
              <Text className="text-gray-700 ml-4">Confrim Password</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={"black"}
                placeholder="confirm password"
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
              />

              <TouchableOpacity
                onPress={handleResetPassword}
                className="py-3 bg-[#FAE500] rounded-xl "
              >
                <Text className="text-xl font-bold text-center text-gray-700">
                  Resset Password
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-4 pb-2">
                <Text className="text-gray-500 font-semibold">Back to </Text>
                <TouchableOpacity onPress={() => handleForgotPass()}>
                  <Text className="font-semibold text-yellow-400">
                    Resset Password
                  </Text>
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
export default ResetPasswordConfirmation;
