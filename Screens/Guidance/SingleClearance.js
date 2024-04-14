import React, { useContext, useState, useCallback, useEffect } from "react";
import { TouchableOpacity, View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";


var { width } = Dimensions.get("window");
const SingleClearance = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  console.log("route params", route.params);


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
              user.clearanceImages && user.clearanceImages.length > 0
                ? { uri: user.clearanceImages[0].url }
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
            }
          />
      </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5,
    width: width,
  },
  item: {
    flexWrap: "wrap",
    margin: 3,
    width: width / 4,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  clearanceImages: {
    borderRadius: 50,
    width: width / 6,
    height: 30,
    margin: 2,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
export default SingleClearance;
