import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  Icon,
  Item,
  Input,
  Text,
  VStack,
  Heading,
  Center,
  HStack,
  Box,
  Image,
} from "native-base";
import {
  Ionicons,
  MaterialIcons,
  SmallCloseIcon,
  Feather,
} from "@expo/vector-icons";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchProduct";
import Banner from "../../Shared/Banner";
import Header from "../../Shared/Header";
import CategoryFilter from "./CategoryFilter";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { COLORS, SIZES } from "../../assets/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ShoppingCartIcon } from "react-native-heroicons/mini";



var { width, height } = Dimensions.get("window");

const ProductContainer = () => {
  const [products, setProducts] = useState([]);
  const [productsFiltered, setProductsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [productsCtg, setProductsCtg] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();


  const searchProduct = (text) => {
    console.log(text);
    setProductsFiltered(
      products.filter((i) => i.productName.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const CartProduct = (cart) => {
    navigation.navigate("ProductCart", { cart });
  };
 
  // console.log(CartProduct, "NAVIGATE BKIT AYAW")
  
  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  const changeCtg = (ctg) => {
    {
      ctg === "all"
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter(
                (i) => i.category !== null && i.category._id === ctg
              ),
              setActive(true)
            ),
          ];
    }
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      // Products
      axios
        .get(`${baseURL}products`)
        .then((res) => {
          setProducts(res.data);
          setProductsFiltered(res.data);
          setProductsCtg(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api call error");
        });

      // Categories
      axios
        .get(`${baseURL}categories`)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((error) => {
          console.log("Api call error");
        });

      return () => {
        setProducts([]);
        setProductsFiltered([]);
        setFocus();
        setCategories([]);
        setActive();
        setInitialState();
      };
    }, [])
  );
  console.log(productsFiltered);

  return (
    <KeyboardAwareScrollView>
      <Header />
      {loading === false ? (
        <Center>
           <View style={styles.searchContainer}>
                  <TouchableOpacity>
                    <Feather
                      name="search"
                      size={25}
                      style={styles.searchIcon}
                    />
                  </TouchableOpacity>
                  <View style={styles.searchWrapper}>
                    <TextInput
                      onFocus={openList}
                      onChangeText={(text) => searchDocument(text)}
                      placeholder="Search"
                    />
                  </View>
                  {focus && (
                    <View className="flex flex-row item-center p-2 space-y-2">
                    <TouchableOpacity onPress={() => setFocus(false)}>
                      <Text className="text-base font-semibold">Cancel</Text>
                    </TouchableOpacity>
                    </View>
                  )}
                </View>
          {focus === true ? (
            <SearchedProduct productsFiltered={productsFiltered} />
          ) : (
            <ScrollView>
              <View class="flex">
                <Box mt={4} mb={2} ml={4}>
                </Box>
              </View>
              <View className="pb-6">
                <CategoryFilter
                  categories={categories}
                  categoryFilter={changeCtg}
                  productsCtg={productsCtg}
                  active={active}
                  setActive={setActive}
                />
              </View>
              {productsCtg.length > 0 ? (
                <View style={styles.listContainer}>
                  {productsCtg.map((item) => {
                    return (
                      <ProductList
                        // navigation={props.navigation}
                        key={item._id.$oid}
                        item={item}
                      />
                    );
                  })}
                </View>
              ) : (
                <View style={[styles.center, { height: height / 2 }]}>
                  <Text>No products found</Text>
                </View>
              )}
            </ScrollView>
          )}
        </Center>
      ) : (
        <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
          <ActivityIndicator size="large" color="red" />
        </Container>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 182,
    height: 240,
    marginEnd: 22,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  Heading: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SIZES.small / 2,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: SIZES.small,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
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

export default ProductContainer;
