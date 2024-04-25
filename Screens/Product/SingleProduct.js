import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, View, Image, StyleSheet } from "react-native";
import {
  Box,
  HStack,
  Container,
  H1,
  Center,
  Heading,
  Button,
} from "native-base";
import Toast from "react-native-toast-message";
import * as actions from "../../Redux/Actions/productActions";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { useDispatch } from "react-redux";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLOURS, Item } from "../../assets/database/Database";

const SingleProduct = ({ route, navigation }) => {
  const { productName, price, description, images } = route.params.item;
  console.log("Image product", route.params.item);
  const [item, setItem] = useState(route.params.item);
  const [availability, setAvailability] = useState(null);
  const [availabilityText, setAvailabilityText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setAvailabilityText(item.stock === 0 ? "Unavailable" : "Available");
    setAvailability(
      item.stock === 0 ? (
        <TrafficLight unavailable></TrafficLight>
      ) : (
        <TrafficLight available></TrafficLight>
      )
    );
    return () => {
      setAvailability(null);
      setAvailabilityText("");
    };
  }, [item]);

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full p-2">
        <View className="flex-row justify-start pt-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon
              name="chevron-left"
              style={{
                fontSize: 18,
                color: COLOURS.backgroundDark,
                padding: 12,
                backgroundColor: COLOURS.backgroundLight,
                borderRadius: 12,
              }}
            />
          </TouchableOpacity>
        </View>
        <View className="pt-12">
          <Image
            className="h-72 w-full"
            source={
              item.images?.url
                ? { uri: item.images?.url }
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
            }
          />
        </View>
        <View className="p-5">
          <View>
            <Heading className="text-2xl text-center">
              {item.productName}
            </Heading>
            <View className="space-y-6 pt-4 text-start">
              <Text className="text-base font-semibold tracking-wide">
                ₱ {item.price}
              </Text>
              {item.description && (
                <Text className="tracking-widest">{item.description}</Text>
              )}
            </View>
          </View>
        </View>
        <View className="p-2 items-center">
          <TouchableOpacity
            onPress={() => {
              // Pass the entire item to addToCart
              dispatch(actions.addToCart({ ...item, quantity: 1 }));
              Toast.show({
                topOffset: 60,
                type: "success",
                text1: `${item.productName} added to Request`,
                text2: "Go to your cart to complete the request",
              });
            }}
            className="py-3 bg-[#FAE500] rounded-xl w-44"
          >
            <Text className="text-base font-semibold text-center text-gray-700">
              Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },

  contentHeader: {
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textAlignVertical: "center",
  },

  availabilityContainer: {
    marginBottom: 20,
    alignItems: "center",
  },

  availability: {
    flexDirection: "row",
    marginBottom: 10,
  },

  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },

  addBtn: {
    width: SIZES.width * 0.4,
    backgroundColor: COLORS.yellow,
    padding: SIZES.small,
    borderRadius: SIZES.small,
    marginLeft: 8,
  },

  priceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: SIZES.small,
  },

  // description: {
  //   fontFamily: "semibold",
  //   fontSize: SIZES.large,
  // },

  // price: {
  //   fontFamily: "semibold",
  //   fontSize: SIZES.large,
  // },
  addCart: {
    width: 37,
    height: 37,
    borderRadius: 50,
    margin: SIZES.small,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SingleProduct;
