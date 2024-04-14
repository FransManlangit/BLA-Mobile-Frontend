import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  TextInput,
} from "react-native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ProductListItem from "./ProductListItem";
import { COLORS, SIZES } from "../../assets/constants";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View className="flex pt-2 p-2 flex-row space-x-6 items-center">
        <Text className="font-bold text-sm w-22">Product Name</Text>
        <Text className="font-bold text-sm w-16">Price</Text>
        <Text className="font-bold text-sm w-16">Category</Text>
        <Text className="font-bold text-sm w-16">Stock</Text>
      </View>
    </ScrollView>
  );
};

const Products = (props) => {
  const [productList, setProductList] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [focus, setFocus] = useState();
  const navigation = useNavigation();

  const openList = () => {
    setFocus(true);
  };

  const searchProduct = (text) => {
    if (text === "") {
      setProductFilter(productList);
    } else {
      setProductFilter(
        productList.filter((i) =>
          i.productName.toLowerCase().includes(text.toLowerCase())
        )
      );
    }
  };

  const deleteProduct = (id) => {
    axios
      .delete(`${baseURL}products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const products = productFilter.filter((item) => item.id !== id);
        setProductFilter(products);
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Successfully Deleted",
          text2: "",
        });
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          type: "error",
          message: "Failed to delete product",
        });
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}products`).then((res) => {
        setProductList(res.data);
        setProductFilter(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      axios.get(`${baseURL}products`).then((res) => {
        setProductList(res.data);
        setProductFilter(res.data);
        setLoading(false);
      });

      return () => {
        setProductList([]);
        setProductFilter([]);
        setLoading(true);
      };
    }, [])
  );

  return (
    <KeyboardAwareScrollView>
    <View className="flex bg-white p-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-3"
      >
        <View className="flex-row gap-4 pt-4 pl-4 pr-4 pb-4">
          <TouchableOpacity onPress={() => navigation.navigate("ProductForm")}>
            <View className="rounded-l-full bg-[#B1A079] w-36 h-10 p-2">
              <Text className="font-semibold text-white text-center">
               Create Products
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
            <View className="rounded-l-full bg-[#B1A079] w-36 h-10 p-2">
              <Text className="font-semibold text-white text-center">
               Student's Orders
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("OrderSchedule")}
          >
            <View className="rounded-l-full bg-[#B1A079] w-42 h-10 p-2">
              <Text className="font-semibold text-white text-center">
                Set Order Schedule
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.searchContainer}>
        <TouchableOpacity>
          <Feather name="search" size={25} style={styles.searchIcon} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <TextInput
            onFocus={openList}
            onChangeText={(text) => searchDocument(text)}
            placeholder="Search"
          />
        </View>
      </View>
      <FlatList
        data={productFilter}
        ListHeaderComponent={ListHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item, index }) => (
          <ProductListItem
            item={item}
            index={index}
            deleteProduct={deleteProduct}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    borderWidth: SIZES.xSmall,
    borderColor: COLORS.brown,
    height: 50,
  },

  searchIcon: {
    marginHorizontal: 10,
    color: COLORS.goldendyellow,
    marginTop: SIZES.small,
  },

  searchWrapper: {
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    borderRadius: SIZES.small,
  },

  SearchInput: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.small,
  },

  searchBtn: {
    width: 50,
    height: "100%",
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
});

export default Products;
