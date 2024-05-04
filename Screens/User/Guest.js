import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOURS } from "../../assets/database/Database";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Guest = ({ navigation }) => {
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="bg-[#B1A079] ">
          <View className="pt-4">
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
          </View>
          <View
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            className="flex-1 bg-[#FAE500] h-fit px-8 pt-8 "
          >
            <Text className="text-center text-2xl font-semibold">
              Welcome Guest!
            </Text>
            <View className="pt-12">
              <Text className="text-base font-normal text-justify tracking-wide">
                To access our Mobile App, kindly email our Administrator, Ms.
                Jonara, including your full name, school ID, date of graduation,
                and the school year.
              </Text>
              <View className="pt-2 pb-2"></View>
              <Text className="text-base font-normal text-justify tracking-wide">
                Please wait for her response, during which she will provide you
                with the necessary login credentials. This process ensures
                smooth login procedures and enhances security for all users.
                Thank you for your cooperation!
              </Text>
            </View>
            <View className="pt-12 flex-col space-y-4 pb-6">
              <View className="flex-row space-x-2 ">
                <Image
                  source={require("../../assets/gmail.jpg")}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-center items-center">
                  ms.jonara@gmail.com
                </Text>
              </View>
              <View className="flex-row space-x-2 ">
                <Image
                  source={require("../../assets/fb.jpg")}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-center items-center ">
                  Jonara Ana De Jesus
                </Text>
              </View>
              <View className="flex-row space-x-2">
                <Image
                  source={require("../../assets/whatsapp.jpg")}
                  style={{ width: 30, height: 30 }}
                />
                <Text className="text-center items-center">
                  +93 928 365 3020
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Guest;
