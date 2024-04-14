import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  Select,
  Box,
  Item,
  Picker,
  Toast,
  CheckIcon,
  ScrollView,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import FormContainer from "../../../Shared/Form/FormContainer";
import Input from "../../../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AuthGlobal from "../../../Context/Store/AuthGlobal";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronLeftIcon,
  TruckIcon,
  ChevronRightIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { COLOURS } from "../../../assets/database/Database";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

const Checkout = (props) => {
  const [requestItems, setRequestItems] = useState([]);
  const [purpose, setPurpose] = useState("");
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [user, setUser] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");

  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const context = useContext(AuthGlobal);

  const validateForm = () => {
    let errors = {};
    if (!purpose) errors.purpose = "Purpose is Required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalPrice(total);
    setRequestItems(cartItems);

    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
      setEmail(context.stateUser.user.email);
    } else {
      navigation.navigate("User", { screen: "Start" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
        text2: "",
      });
    }

    return () => {
      setRequestItems([]);
    };
  }, [cartItems, context.stateUser.isAuthenticated, navigation]);

  const checkOut = () => {
    if (!validateForm()) {
      return;
    }
    let total = 0;
    requestItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    console.log(email, "User Email");
    let request = {
      email,
      dateofRequest: Date.now(),
      paidAt: Date.now(),
      requestItems,
      purpose,
      requestStatus: "Pending",
      user,
      totalPrice: total,
    };
    console.log("Request List C", request);
    navigation.navigate("Payment", { request: request });
  };

  const data = [
    { label: "Scholarship Applications", value: "Scholarship Applications" },
    { label: "Transfer Requests", value: "Transfer Requests" },
    { label: "Internship Applications", value: "Internship Applications" },
    { label: "Graduation Requirements", value: "Graduation Requirements" },
    {
      label: "Visa and Immigration Processes",
      value: "Visa and Immigration Processes",
    },
    { label: "Verification of Education", value: "Verification of Education" },
  ];

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>Select</Text>
      );
    }
    return null;
  };

  return (
    <View className="flex bg-white h-full w-full">
      <View className="bg-white pt-12 p-4">
        <Text className="text-center text-xl italic text-black font-semibold">
          Select a purpose{" "}
        </Text>
        <Text className="text-center text-xl italic text-black font-semibold">
          {" "}
          to process your request{" "}
        </Text>
      </View>
      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select Purpose" : "..."}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
            setPurpose(item.label); // Set purpose based on selected value
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? "blue" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />
        <View className="p-2 items-center pt-72">
          <TouchableOpacity
            className="py-3 w-48 
      bg-[#FAE500] rounded-xl "
            onPress={() => {
              checkOut();
              Alert.alert(`You have selected\nPurpose: ${purpose}`);
            }}
          >
            <Text className="text-base font-semibold text-center text-black">
              Request
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default Checkout;
