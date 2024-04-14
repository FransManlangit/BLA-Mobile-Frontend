
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Text, Radio, CheckIcon } from "native-base";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../../assets/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowUpTrayIcon } from "react-native-heroicons/solid";
import { ScrollView } from "react-native-gesture-handler";

const Authorization = (props) => {
  const request = props.route.params;
  const [token, setToken] = useState();
  const [authorizationLetter, setAuthorizationLetter] = useState(null);
  // const [authorizationLetter, setAuthorizationLetter] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log(result.assets);
      setAuthorizationLetter(result.assets[0].uri);
    }
  };

  const addAuthorization = async () => {
    try {
      // Simulate a delay (replace this with your actual logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to the confirmation screen with payment details
      navigation.navigate("Confirm", {
        request: request,
        authorizationLetter: authorizationLetter,
      });

    } catch (error) {

      console.error("Payment Error:", error.message);
   
    }
  };
  return (
    <ScrollView>
      <View className="flex bg-white h-full w-full items-center p-2">
        <View className="pt-12 items-center">
          <Text className="text-xl text-black font-bold tracking-wide">
            Upload Authorization Letter
          </Text>
        </View>
        <TouchableOpacity className="items-center pt-12">
          <ArrowUpTrayIcon
            onPress={() => pickImage()}
            name="upload"
            size={40}
            color={COLORS.brown}
          />
        </TouchableOpacity>
        <View className="pt-16 p-2">
          {authorizationLetter !== null ? (
            <Image
              className="h-72 w-96"
              source={{ uri: authorizationLetter }}
            />
          ) : null}
        </View>
        <View className="pt-12">
          <Text className="text-sm font-normal text-black tracking-wide text-justify">
            Please note that if you authorize someone else to collect your
            requested documents, an authorization letter will be required.
          </Text>
          <Text></Text>
        </View>
        <View className="pt-12 flex flex-row space-x-4 p-2">
          <TouchableOpacity
            onPress={() => addAuthorization()} // Call handlePayment instead of addAuthorization
            className="py-3 bg-[#FAE500] rounded-xl w-40"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Confirm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addAuthorization()}
            className="py-3 bg-[#FAE500] rounded-xl w-40"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Proceed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Authorization;