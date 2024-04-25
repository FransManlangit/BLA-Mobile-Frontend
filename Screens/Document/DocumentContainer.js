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
  Pressable,
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
import DocumentList from "./DocumentList";
import SearchedDocument from "./SearchedDocument";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { COLORS, SIZES } from "../../assets/constants";
import Banner from "../../Shared/Banner";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Header from "../../Shared/Header";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { ShoppingBagIcon } from "react-native-heroicons/mini";
// import ProductContainer from "../Product/ProductContainer";

var { width, height } = Dimensions.get("window");

const DocumentContainer = () => {
  const [documents, setDocuments] = useState([]);
  const [documentsFiltered, setDocumentsFiltered] = useState([]);
  const [focus, setFocus] = useState();
  const [active, setActive] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const searchDocument = (text) => {
    console.log(text);
    setDocumentsFiltered(
      documents.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    );
  };

  const ProductOrder = (request) => {
    navigation.navigate("Product", { request });
  };

  const openList = () => {
    setFocus(true);
  };

  const onBlur = () => {
    setFocus(false);
  };

  useFocusEffect(
    useCallback(() => {
      setFocus(false);
      setActive(-1);

      axios
        .get(`${baseURL}documents`)
        .then((res) => {
          setDocuments(res.data);
          setDocumentsFiltered(res.data);
          setInitialState(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Api call error");
        });
    }, [])
  );
  console.log(documentsFiltered);

  return (
    <SafeAreaView>
      <ScrollView>
        <Header />
        <View className="p-4 bg-white">
          {loading === false ? (
            <ScrollView>
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
                  <SearchedDocument documentsFiltered={documentsFiltered} />
                ) : (
                  <ScrollView>
                    <Box mt={4} mb={2} ml={4}>
                      <Text className="font-semibold text-2xl">
                        Announcement
                      </Text>
                    </Box>
                    <View className="pb-8">
                      <Banner/>
                    </View>

                    <View className="mt-2 bg-white">
                      {documents.length > 0 ? (
                        <View style={styles.listContainer}>
                          {documents.map((item) => {
                            return (
                              <DocumentList key={item._id.$oid} item={item} />
                            );
                          })}
                        </View>
                      ) : (
                        <View style={[styles.center, { height: height / 2 }]}>
                          <Text>No documents found</Text>
                        </View>
                      )}
                    </View>
                  </ScrollView>
                )}
              </Center>
            </ScrollView>
          ) : (
            <Container style={[styles.center, { backgroundColor: "#f2f2f2" }]}>
              <ActivityIndicator size="large" color="red" />
            </Container>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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

export default DocumentContainer;
