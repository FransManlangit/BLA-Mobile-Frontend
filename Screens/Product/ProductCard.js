import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Container } from "native-base";

import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/productActions";
import { COLORS, SIZES } from "../../assets/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import Banner from "../../Shared/Banner";
import { PlusCircleIcon } from "react-native-heroicons/outline";

var { width } = Dimensions.get("window");

const ProductCard = (props) => {
  const { productName, price, images, description, size, stock } = props;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  // console.log(images, "Request Card");

  return (
    <View className="p-8 pt-4 bg-[#FAFAFA] ">
      <View className="max-w-[150px] justify-center items-center overflow-hidden">
      <Image
            className="w-28 h-28 rounded-xl"
            source={
              images?.url
                ? { uri: images?.url }
                : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
            }
          />
      </View>

      <View className="flex-col space-x-2 pt-2 ">
        <Text className="text-base font-bold text-balance">
          {" "}
          {productName.length > 15 ? productName.substring(0, 15 - 3) + "..." : productName}
        </Text>
        {/* <Text className="text-xs line-clamp-4">{size}</Text> */}
        <TouchableOpacity className="flex flex-row space-x-6 pt-4">
          <Text className="text-s font-semibold p-2">₱{price}</Text>
          <PlusCircleIcon
            onPress={() => {
              dispatch(actions.addToCart({ ...props, quantity: 1 })),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${productName} added to Request`,
                  text2: "Go to your cart to complete Request",
                });
            }}
            size={35}
            padding={6}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width / 2 - 20,
    height: width / 1.7,
    padding: 10,
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 5,
    marginLeft: 10,
    alignItems: "center",
    backgroundColor: COLORS.yellow,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: SIZES.medium,
    overflow: "hidden",
    backgroundColor: COLORS.gray2,
  },

  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  card: {
    padding: SIZES.small,
  },

  title: {
    fontWeight: "regular",
    fontSize: SIZES.medium,
    marginBottom: -3,
    marginLeft: -45,
  },

  price: {
    fontWeight: "bold",
    fontSize: SIZES.small,
    marginLeft: -45,
  },

  addBtn: {
    position: "absolute",
    bottom: SIZES.xSmall,
    right: SIZES.xSmall,
    marginRight: -8,
  },
});

export default ProductCard;
