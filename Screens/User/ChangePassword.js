import React, { useState } from "react";
import {View, Text, Image, TextInput, TouchableOpacity} from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import Input from "../../Shared/Form/Input";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useNavigation } from "@react-navigation/native";


const ChangePassword = (props) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation();

  const changePassword = () => {
    console.log("Attempting to update password...");
    const id = props.route.params.userProfile._id;
    const data = { currentPassword, newPassword };

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Passwords do not match",
        text2: "Please make sure the passwords match",
      });
      return;
    }

    axios
      .put(`${baseURL}users/changePassword/${id}`, data)
      .then((res) => {
        console.log("Password updated successfully");
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Password updated successfully",
          text2: "",
        });
        navigation.navigate("User Profile");
      })
      .catch((error) => {
        console.log("Error updating password", error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Incorrect Password",
          text2: "Make sure that your caps lock key is turned off and try again",
        });
      });
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
                Change Password
              </Text>
            </View>
            <View className="form space-y-2">
              <Text className="text-gray-700 ml-4">Set Current Password</Text>
              <TextInput
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
                placeholder="Enter current password"
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

              <View className="justify-center mt-4 pb-2">
                <TouchableOpacity
                  onPress={() => changePassword()}
                  className="py-3 bg-[#FAE500] rounded-xl "
                >
                  <Text className="text-base font-semibold text-center text-gray-700">
                    Change Password
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

export default ChangePassword;
