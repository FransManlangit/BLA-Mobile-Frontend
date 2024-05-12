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
              item.images[0]?.url
                ? { uri: item.images[0]?.url }
                : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
            }
          />
          <View className="ml-3">
            <Text className="tracking-wider text-sm font-semibold subpixel-antialiased">
              {item.productName}
            </Text>
            <Text className="font-normal">{"₱" + new Intl.NumberFormat("en-US").format(item.price)}</Text>
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
    <SafeAreaView>
      <View className="bg-white h-full w-full pt-4">
        <ScrollView>
          <View className="w-full flex-row pt-4 pl-4 justify-between items-center">
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
            <Text className="text-xl font-bold text-black text-center">
              Order Details
            </Text>
            <View></View>
          </View>
          <Text className="text-right pr-8 text-s font-semibold pt-10">Delete</Text>
          <View className="flex pr-10 items-end pb-10">
            <TrashIcon
              onPress={() => dispatch(clearCart())}
              style={{ fontSize: 22, color: COLOURS.black }}
            />
          </View>
          <View className="px-5">
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
              <Box className="items-center justify-center h-80">
                <Text>No items in cart</Text>
              </Box>
            )}
          </View>
          <View>
            <View className="px-8 my-8"></View>
            <View className="px-8 mt-10 mb-20">
              <Text className="text-base text-black font-medium tracking-widest mb-5">
                Order Info
              </Text>
              <View className="flex-row items-center justify-between mb-2"></View>
              <View className="flex-row items-center justify-between mb-6"></View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-normal max-w-6 text-black opacity-50">
                  Total
                </Text>
                <Text className="text-lg font-medium text-black">
                {'₱' + new Intl.NumberFormat('en-US').format(total.toFixed(2))}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-2.5 h-12 w-full items-center justify-center">
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
              ORDER
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
