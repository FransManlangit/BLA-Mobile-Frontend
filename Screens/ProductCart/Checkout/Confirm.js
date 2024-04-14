import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Button,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Text, HStack, VStack, Avatar, Spacer, Center } from "native-base";
import * as actions from "../../../Redux/Actions/productActions";
import Toast from "react-native-toast-message";
import axios from "axios";
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

var { width, height } = Dimensions.get("window");

const Confirm = (props) => {
  const [token, setToken] = useState();
  const finalOrder = props.route.params;
  const dispatch = useDispatch();
  let navigation = useNavigation();

  const truncateWords = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    const truncatedText = text.substr(0, maxLength);
    // Find the last space within the truncated text
    const lastSpaceIndex = truncatedText.lastIndexOf(" ");
    // Remove everything after the last space
    return truncatedText.substr(0, lastSpaceIndex) + "...";
  };

  const confirmOrder = () => {
    const order = finalOrder.order;
    const payment = finalOrder.paymentInfo;
    order.paymentInfo = payment;

    console.log("final order", finalOrder);

    AsyncStorage.getItem("jwt")
      .then((res) => {
        const token = res || "";

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .post(`${baseURL}orders`, order, config)
          .then((res) => {
            if (res.status == 200 || res.status == 201) {
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: "Orders Completed",
                text2:
                  "We'll process your order as soon as possible. Thank you for your purchase.",
              });

              const { checkoutUrl } = res.data;

              if (finalOrder.paymentInfo === "Gcash") {
                Linking.openURL(checkoutUrl);
              } else {
                setTimeout(() => {
                  dispatch(actions.clearCart());
                  navigation.navigate("ProductCart");
                }, 500);
              }
            }
          })
          .catch((error) => {
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
          Confirm Order
        </Text>
        {props.route.params ? (
          <View className="bg-[#FAE500] rounded-lg space-y-4 p-2">
            <View className="rounded-lg bg-zinc-100">
              <View className="p-4 items-start items-center">
                <Text className="text-sm font-medium text-lg">Total Price</Text>
                <Text className="pb-4 tracking-wider font-medium">
                  {finalOrder?.order?.totalPrice || "N/A"}
                </Text>
              </View>
            </View>
            {finalOrder.order.orderItems.map((item) => {
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
                          item.images?.url
                            ? { uri: item.images?.url }
                            : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
                        }
                      />
                    </View>
                    <VStack>
                      <Text className="text-base text-center font-normal">
                        {truncateWords(item.productName, 18)}{" "}
                        {/* Adjust the word length as needed */}
                      </Text>
                    </VStack>
                    <Spacer />
                    <Text className="text-base font-normal">{item.price}</Text>
                  </HStack>
                </View>
              );
            })}
          </View>
        ) : null}
        <View className="items-center mt-4 ">
          <TouchableOpacity
            onPress={() => confirmOrder()}
            className="py-3 bg-[#FAE500] rounded-xl w-56"
          >
            <Text className="tex-xl font-bold text-black text-center">
              Confirm Order
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
