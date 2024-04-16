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
import { clearCart, removeFromCart } from "../../Redux/Actions/productActions";
import { Text, Box, HStack, VStack, Image } from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import { Toast } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { COLOURS, Item } from "../../assets/database/Database";
import {
  ChevronLeftIcon,
  TruckIcon,
  ChevronRightIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

var { height, width } = Dimensions.get("window");

const ProductCart = (props) => {
  var total = 0;
  const navigation = useNavigation();
  const productItems = useSelector((state) => state.productItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  const { images } = props;

  const order = () => {
    if (context.stateUser.isAuthenticated) {
      navigation.navigate("Payment");
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Purchase",
        text2: "",
      });
    }
  };

  productItems.forEach((cart) => {
    total += cart.price * cart.quantity;
  });

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
              item.images?.url
                ? { uri: item.images?.url }
                : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
            }
          />
          <View className="ml-3">
            <Text className=" text-xl font-bold">{item.name}</Text>
            <Text className="font-normal">$ {item.price}</Text>
          </View>
        </HStack>
      </Box>
    </TouchableHighlight>
  );

  const renderHiddenItem = (productItems) => (
    <TouchableOpacity
      onPress={() => dispatch(removeFromCart(productItems.item))}
    >
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
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: COLOURS.white,
          position: "relative",
        }}
      >
        <ScrollView>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              paddingTop: 16,
              paddingHorizontal: 16,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
                fontWeight: "400",
              }}
            >
              Order Details
            </Text>
            <View></View>
          </View>
          <Text
            style={{
              fontSize: 20,
              color: COLOURS.black,
              fontWeight: "500",
              letterSpacing: 1,
              paddingTop: 20,
              paddingLeft: 16,
              marginBottom: 10,
            }}
          >
            My Orders
          </Text>
          <Text className="text-right pr-8 text-s font-semibold">Delete</Text>
          <View className="flex pr-10 items-end">
            <TrashIcon
              onPress={() => dispatch(clearCart())}
              style={{ fontSize: 22, color: COLOURS.black }}
            />
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            {productItems.length > 0 ? (
              <Box bg="white" safeArea flex="1" width="100%">
                <SwipeListView
                  data={productItems}
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
              }}
            ></View>
            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 40,
                marginBottom: 80,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: COLOURS.black,
                  fontWeight: "500",
                  letterSpacing: 1,
                  marginBottom: 20,
                }}
              >
                Order Info
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 22,
                }}
              ></View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    maxWidth: "80%",
                    color: COLOURS.black,
                    opacity: 0.5,
                  }}
                >
                  Total
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: COLOURS.black,
                  }}
                >
                  ₱ {total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 10,
            height: "8%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => order()}
            style={{
              width: "86%",
              height: "90%",
              backgroundColor: COLOURS.yellow,
              borderRadius: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text className="font-medium text-black tracking-wide">
              ORDER {total.toFixed(2)}
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

export default ProductCart;
