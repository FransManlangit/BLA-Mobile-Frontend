import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  Button,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../Redux/Actions/documentActions";
import { COLORS, SIZES } from "../../assets/constants";
import { PlusCircleIcon } from "react-native-heroicons/outline";

var { width } = Dimensions.get("window");

const DocumentCard = (props) => {
  const { name, price, image, item } = props;

  const dispatch = useDispatch();

  return (
    <View className="p-8 pt-4 bg-white">
      <View className="max-w-[150px] justify-center items-center overflow-hidden">
        <View>
          <Image
            className="w-28 h-28 rounded-xl"
            source={
              image?.url
                ? { uri: image?.url }
                : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
            }
          />
        </View>
      </View>
      <View className="flex-col space-x-2 pt-2 ">
        <Text className="text-base font-bold text-balance">
          {" "}
          {name.length > 15 ? name.substring(0, 15 - 3) + "..." : name}
        </Text>

        <TouchableOpacity className="flex flex-row space-x-6 pt-4">
          <Text className="text-s font-semibold p-2">₱{price}</Text>
          <PlusCircleIcon
            onPress={() => {
              dispatch(actions.addToCartDocument({ ...props, quantity: 1 })),
                Toast.show({
                  topOffset: 60,
                  type: "success",
                  text1: `${name} added to Request`,
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

export default DocumentCard;

