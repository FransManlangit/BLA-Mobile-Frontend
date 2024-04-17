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
import * as actions from "../../Redux/Actions/documentActions";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { useDispatch } from "react-redux";
import TrafficLight from "../../Shared/StyledComponents/TrafficLight";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const SingleDocument = ({ route, navigation }) => {
  const { name, price, description, image } = route.params.item;
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="pt-12">
          <Image
            className="h-72 w-full"
            source={
              item.image?.url
                ? { uri: item.image?.url }
                : "https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png"
            }
          />
        </View>
        <View className="p-5">
          <View>
            <Heading className="text-2xl text-center">{item.name}</Heading>
            <View className="space-y-6 pt-4 text-start">
              <Text className="text-base font-semibold tracking-wide">
                ₱ {item.price}
              </Text>
              <Text className="tracking-widest">{item.description}</Text>
            </View>
          </View>
        </View>
        <View className="p-2 items-center">
        <TouchableOpacity
          onPress={() => {
            // Pass the entire item to addToCart
            dispatch(actions.addToCartDocument({ ...item, quantity: 1 }));
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: `${item.name} added to Request`,
              text2: "Go to your cart to complete the request",
            });
          }}
          className="py-3 bg-[#FAE500] rounded-xl w-44"
        >
          <Text className="text-base font-semibold text-center text-gray-700">
           Request
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

export default SingleDocument;
