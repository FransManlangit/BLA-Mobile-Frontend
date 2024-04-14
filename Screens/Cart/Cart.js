import React, { useEffect, useState, useContext } from "react";

import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  Pressable,
  ScrollView,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { clearCart, removeFromCart } from "../../Redux/Actions/cartActions";
import {
  Container,
  Text,
  Box,
  HStack,
  Avatar,
  VStack,
  Spacer,
  Divider,
  Center,
  Button,
  Heading,
  Image,
  Toast
} from "native-base";

import { SwipeListView } from "react-native-swipe-list-view";

import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Shared/Header";
import Icon from "react-native-vector-icons/FontAwesome5";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import {COLOURS, Item} from "../../assets/database/Database";
import {
ChevronLeftIcon,
TruckIcon,
ChevronRightIcon,
TrashIcon,
 
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

var { height, width } = Dimensions.get("window");

const Cart = (props) => {
  var total = 0;
  const navigation = useNavigation();
  const cartItems = useSelector((state) => state.cartItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const { image } = props;

  // const calculateTotal = () => {
  //   let total = 0;
  //   cartItems.forEach((cart) => {
  //     total += cart.price * cart.quantity;
  //   });
  //   return total.toFixed(2);
  // };
  const request = () => {
    if (context.stateUser.isAuthenticated) {
      if (cartItems.length > 0) {
        navigation.navigate("Checkout");
      } else {
      
        Toast.show({
          topOffset: 60,
          type: "warning",
          text1: "Your cart is empty",
          text2: "Please add items to your cart before requesting.",
        });
      }
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Request",
        text2: "",
      });
    }
  };


  cartItems.forEach((cart) => {
    return (total += cart.price);
  });

  console.log("cart items list", cartItems)
  const renderItem = ({ item, index }) => (
    <TouchableHighlight
      onPress={() => console.log("You touched me")}
      _dark={{
        bg: "coolGray.800",
      }}
      _light={{
        bg: "white",
      }}
    >
      <Box pl="5" pr="5" py="2" bg="#FFFFFF">
        <HStack alignItems="center" space={2}>
          <Image
            key="size"
            size="sm"
            resizeMode="cover"
            source={
              item.image?.url
                ? { uri: item.image?.url }
                : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
            }
          />
          <View className="ml-3">
            <Text className="tracking-wider text-lg font-semibold subpixel-antialiased">{item.name}</Text>
          </View>
        </HStack>
      </Box>
    </TouchableHighlight>
  );

  const renderHiddenItem = (cartItems) => (
    <TouchableOpacity onPress={() => dispatch(removeFromCart(cartItems.item))}>
      <VStack alignItems="center" style={styles.hiddenButton}>
        <View>
          <Icon name="trash" color={"white"} size={30} bg="red" />
          <Text color="white" fontSize="xs" fontWeight="bold">
            Delete
          </Text>
        </View>
      </VStack>
    </TouchableOpacity>
  );

  return (
    <View>
    <View className="bg-white h-full w-full">
    <ScrollView>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingTop: 16,
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
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
        <Text
          style={{
            fontSize: 14,
            color: COLOURS.black,
            fontWeight: '400',
          }}>
          Request Details
        </Text>
        <View></View>
      </View>
      <Text
        style={{
          fontSize: 20,
          color: COLOURS.black,
          fontWeight: '500',
          letterSpacing: 1,
          paddingTop: 20,
          paddingLeft: 16,
          marginBottom: 10,
        }}>
        My Request
      </Text>
      <Text className="text-right pr-8 text-s font-semibold">Delete</Text>
     <View className="flex pr-10 items-end">
      <TrashIcon
      onPress={() => dispatch(clearCart())}
      style={{fontSize: 22, color: COLOURS.black}}
      />
      </View>
      <View style={{paddingHorizontal: 16}}>
      {cartItems.length > 0 ? (
        <Box bg="white" safeArea flex="1" width="100%">
          <SwipeListView
            data={cartItems}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            disableRightSwipe={true}
            leftOpenValue={75}
            rightOpenValue={-150}
            previewOpenValue={-100}
            previewOpenDelay={3000}
          />
        </Box>
      ) : (
        <Box style={styles.emptyContainer}>
          <Text>No items in cart</Text>
        </Box>
      )}
       
      </View>
      <View>
        <View
          style={{
            paddingHorizontal: 16,
            marginVertical: 10,
          }}>
          
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 40,
            marginBottom: 80,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: COLOURS.black,
              fontWeight: '500',
              letterSpacing: 1,
              marginBottom: 20,
            }}>
            Request Info
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>     
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 22,
            }}>
           
           
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '400',
                maxWidth: '80%',
                color: COLOURS.black,
                opacity: 0.5,
              }}>
              Total
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: COLOURS.black,
              }}>
            ₱ {total.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>

    <View
      style={{
        position: 'absolute',
        bottom: 10,
        height: '8%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => request()}
        style={{
          width: '86%',
          height: '90%',
          backgroundColor: COLOURS.yellow,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text className="font-medium text-black tracking-wide">
       
          REQUEST {total.toFixed(2)}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
  </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: height,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "white",
    elevation: 20,
  },
  price: {
    fontSize: 18,
    margin: 20,
    color: "red",
  },
  hiddenContainer: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    // width: 'lg'
  },
  hiddenButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 25,
    height: 70,
    width: width / 1.2,
  },
});

export default Cart;
