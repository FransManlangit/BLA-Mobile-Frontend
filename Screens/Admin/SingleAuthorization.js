import React from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

var { width } = Dimensions.get("window");

const SingleAuthorization = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  console.log("User data:", user);

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full p-2">
        <View className="flex-row justify-start pt-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="items-center pt-24 ">
          <Image
            className="h-80 w-full"
            source={
              user.authorizationLetter && user.authorizationLetter.url
                ? { uri: user.authorizationLetter.url }
                : require("../../assets/logo.png") // Provide a default image source when authorizationLetter.url is undefined
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backButton: {
    backgroundColor: "#FAE500",
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authorizationLetter: {
    width: width,
    height: width,
  },
});

export default SingleAuthorization;
