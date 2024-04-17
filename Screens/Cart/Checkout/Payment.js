import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Image, Alert } from "react-native";
import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Payment = (props) => {
  const request = props.route.params;
  const [requestItems, setRequestItems] = useState([]);
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const documentItems = useSelector((state) => state.documentItems);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (!context.stateUser.isAuthenticated) {
      navigation.navigate("User", { screen: "Start" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    } else {
      setUser(context.stateUser.user.userId);
      setEmail(context.stateUser.user.email);
      setRequestItems(documentItems);
    }

    return () => {
      setRequestItems([]); // Clear request items on unmount
    };
  }, [documentItems, context.stateUser.isAuthenticated, navigation]); // Dependencies for useEffect

  const handleCashPayment = () => {
    Alert.alert(
      "Confirm Cash Payment",
      "Are you sure you want to proceed with Cash Payment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handlePayment("Cash");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleGcashPayment = () => {
    Alert.alert(
      "Confirm GCash Payment",
      "Are you sure you want to proceed with GCash Payment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handlePayment("Gcash");
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handlePayment = async (paymentMethod) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate payment delay
      navigation.navigate("Authorization", {
        request: request,
        paymentInfo: paymentMethod,
      });
      console.log("Request Request P", request)
    } catch (error) {
      console.error("Payment Error:", error.message);
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View className="flex p-4 bg-white h-full w-full">
        <View className="pt-6">
          <Text className="text-xl font-bold text-center">
            How would you like to pay?
          </Text>
        </View>
        <View className="pt-6 space-y-4 items-center">
          <TouchableOpacity
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: selected === "Gcash" ? "black" : "#C5C6C7",
              height: 56,
              width: 200,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              backgroundColor: "white",
            }}
            onPress={handleGcashPayment}
          >
            <Image
              source={require("../../../assets/gcash.png")}
              style={{ width: "70%", height: "100%", resizeMode: "contain" }}
            />
          </TouchableOpacity>
        </View>
        <View className="pt-4 items-center">
          <TouchableOpacity
            style={{
              borderRadius: 8,
              borderWidth: 1,
              borderColor: selected === "Cash" ? "black" : "#C5C6C7",
              height: 56,
              width: 200,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              backgroundColor: "white",
            }}
            onPress={handleCashPayment} // Call handleCashPayment function onPress
          >
            <Text className="items-center p-2 font-semibold text-base">
              Cash Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Payment;
