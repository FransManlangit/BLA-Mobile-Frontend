import React, { useContext } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  clearCartDocument,
  removeFromCartDocument,
} from "../../Redux/Actions/documentActions";
import {
  Text,
  Box,
  HStack,
  VStack, 
  Image,
  Toast,
} from "native-base";
import { SwipeListView } from "react-native-swipe-list-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome5";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { COLOURS, Item } from "../../assets/database/Database";
import {
  ChevronLeftIcon,
  TrashIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

var { height, width } = Dimensions.get("window");

const Cart = (props) => {
  var total = 0;
  const navigation = useNavigation();
  const documentItems = useSelector((state) => state.documentItems);
  const dispatch = useDispatch();
  const context = useContext(AuthGlobal);
  
  const request = () => {
    if (context.stateUser.isAuthenticated) {
      if (documentItems.length > 0) {
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

  documentItems.forEach((cart) => {
    return (total += cart.price);
  });

  console.log("cart items list", documentItems);
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
            <Text className="tracking-wider text-sm font-semibold subpixel-antialiased">
              {item.name}
            </Text>
            <Text className="font-normal">{"₱" + new Intl.NumberFormat("en-US").format(item.price)}</Text>
          </View>
        </HStack>
      </Box>
    </TouchableHighlight>
  );

  const renderHiddenItem = (documentItems) => (
    <TouchableOpacity
      onPress={() => dispatch(removeFromCartDocument(documentItems.item))}
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
        <KeyboardAwareScrollView>
          <View className="w-full flex-row pt-4 pl-4  justify-between items-center">
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
              Request Details
            </Text>
            <View></View>
          </View>
          <Text className="text-right pr-8 text-s font-semibold pt-10">Delete</Text>
          <View className="flex pr-10 items-end pb-10">
            <TrashIcon
              onPress={() => dispatch(clearCartDocument())}
              style={{ fontSize: 22, color: COLOURS.black }}
            />
          </View>
          <View className="px-5">
            {documentItems.length > 0 ? (
              <Box bg="white" safeArea flex="1" width="100%">
                <SwipeListView
                  data={documentItems}
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
                Request Info
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
        </KeyboardAwareScrollView>

        <View className="absolute bottom-2.5 h-12 w-full items-center justify-center">
          <TouchableOpacity
            onPress={() => request()}
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
              REQUEST 
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

export default Cart;
