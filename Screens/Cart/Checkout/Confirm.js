import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";
import * as actions from "../../../Redux/Actions/documentActions";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();
  const finalRequest = props.route.params;
  const dispatch = useDispatch();
  let navigation = useNavigation();

  const confirmRequest = () => {
    AsyncStorage.getItem("jwt")
      .then((res) => {
        const token = res || "";

        const request = finalRequest.request.request.request;
        request.paymentInfo = finalRequest.paymentInfo;

        const formData = new FormData();

        formData.append("user", request.user);
        formData.append("email", request.email);
        formData.append("requestItems", JSON.stringify(request.requestItems));
        formData.append("purpose", request.purpose);
        formData.append("dateofRequest", request.dateofRequest);
        formData.append("paidAt", request.paidAt);
        formData.append("requestStatus", request.requestStatus);
        formData.append("paymentInfo", finalRequest.request.paymentInfo);
        formData.append("totalPrice", request.totalPrice);

        // Check if authorization letter exists
        if (finalRequest.authorizationLetter) {
          const newImageUri =
            "file:///" +
            finalRequest.authorizationLetter.split("file:/").join("");
          formData.append("authorizationImage", {
            uri: newImageUri,
            type: mime.getType(newImageUri),
            name: newImageUri.split("/").pop(),
          });
        }

        console.log("Request Details: ", formData);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .post(`${baseURL}requests`, formData, config)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Your Request is Complete",
                text2:
                  "We'll process your request as soon as possible. Thank you for choosing our service.",
              });

              console.log("response", res);
              const { checkoutUrl } = res.data;

              // Handle payment logic
              if (finalRequest.paymentInfo === "Gcash") {
                Linking.openURL(checkoutUrl);
              }
              
              setTimeout(() => {
                dispatch(actions.clearCartDocument());
                navigation.navigate("Cart");
              }, 500);
            }
          })
          .catch((error) => {
            console.error("Error confirming request:", error);
            Toast.show({
              topOffset: 60,
              type: "error",
              text1: "Something went wrong",
              text2: "Please try again",
            });
          });
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View className="bg-white h-full w-full p-4">
        <Text className="text-center text-2xl font-bold tracking-wider p-6">
          Confirm Request
        </Text>
        {props.route.params ? (
          <View className="bg-[#FAE500] rounded-lg space-y-4 p-2">
            <View className="rounded-lg bg-zinc-100">
              <View className="p-4 items-start items-center">
                <Text className="tracking-wider text-xl text-semibold font-semibold pb-1">
                  Purpose
                </Text>
                <Text className="pb-4 tracking-wider font-medium">
                  {finalRequest.request.request.request.purpose}
                </Text>
                <Text className="text-sm font-medium text-lg">Total Price</Text>
                <Text className="pb-4 tracking-wider font-medium">
                  {finalRequest.request.request.request.totalPrice}
                </Text>
              </View>
            </View>
            {finalRequest.request.request.request.requestItems.map((item) => {
              return (
                <View className="flex flex-row items-center">
                  <HStack
                    space={[2, 3]}
                    justifyContent="space-between"
                    key={item.id}
                  >
                    <View className="px-5 flex-row items-center space-x-4">
                      <Avatar
                        size="48px"
                        source={
                          item.image?.url
                            ? { uri: item.image?.url }
                            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
                        }
                      />
                    </View>
                    <VStack>
                      <Text className="text-sm font-normal text-center">
                        {item.name}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text className="text-base font-normal text-center">
                      {item.price}
                    </Text>
                  </HStack>
                </View>
              );
            })}
          </View>
        ) : null}
        <View className="items-center mt-4 p-2">
          <TouchableOpacity
            onPress={() => confirmRequest()}
            className="py-3 bg-[#FAE500] rounded-xl w-36"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    height: height,
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  title: {
    alignSelf: "center",
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    width: width / 1.2,
  },
  body: {
    margin: 10,
    alignItems: "center",
    flexDirection: "row",
  },
});
export default Confirm;
