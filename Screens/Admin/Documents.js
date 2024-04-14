import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { Input, VStack, Heading, Box } from "native-base";
import { Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import ListItem from "./ListItem";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

var { height, width } = Dimensions.get("window");


const ProductHeader = () => {
  return (
    <View className="flex pt-2 p-2 flex-row space-x-6 items-center">
      <Text className="font-bold text-sm w-28 pl-4">Image</Text>
      <Text className="font-bold text-sm w-28">Document</Text>
      <Text className="font-bold text-sm w-28">Price</Text>
    </View>
  );
};

const Documents = (props) => {
  const [documentList, setDocumentList] = useState();
  const [documentFilter, setDocumentFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [focus, setFocus] = useState();
  const navigation = useNavigation();

  const searchDocument = (text) => {
    if (text === "") {
      setDocumentFilter(documentList);
    }
    setDocumentFilter(
      documentList.filter((i) =>
        i.name.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  const deleteDocument = (id) => {
    axios
      .delete(`${baseURL}documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const documents = documentFilter.filter((item) => item.id !== id);
        setDocumentFilter(documents);
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Document Deleted Succesfully",
          text2: "Please Login into your account",
        });
      })
      .catch((error) => console.log(error));
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}documents`).then((res) => {
        // console.log(res.data)
        setDocumentList(res.data);
        setDocumentFilter(res.data);
        setLoading(false);
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  const openList = () => {
    setFocus(true);
  };

  useFocusEffect(
    useCallback(() => {
      // Get Token
      AsyncStorage.getItem("jwt").then((res) => {
        setToken(res);
      });
      // .catch((error) => console.log(error));

      axios.get(`${baseURL}documents`).then((res) => {
        // console.log(res.data);
        setDocumentList(res.data);
        setDocumentFilter(res.data);
        setLoading(false);
      });

      return () => {
        setDocumentList();
        setDocumentFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <KeyboardAwareScrollView className="flex bg-white p-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-3"
      >
        <View className="flex-row gap-4 pt-4 pl-4 pr-4 pb-4">
        <TouchableOpacity onPress={() => navigation.navigate("Products")}>
            <View className="rounded-l-full bg-[#B1A079] w-24 h-10 p-2">
              <Text className="font-semibold text-white text-center">All Products</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ScheduleForm")}>
            <View className="rounded-l-full bg-[#B1A079] w-40 h-10 p-2">
              <Text className="font-semibold text-white text-center">Set Student's Schedule</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Requests")}>
            <View className="rounded-l-full bg-[#B1A079] w-36 h-10 p-2">
              <Text className="font-semibold text-white text-center">Student's Request</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("DocumentForm")}>
            <View className="rounded-l-full bg-[#B1A079] w-36 text-center h-10 p-2">
              <Text className="font-semibold text-white text-center">Create Documents</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("CreateStudent")}>
            <View className="rounded-l-full bg-[#B1A079] w-32 h-10 p-2">
              <Text className="font-semibold text-white text-center">Add Student's</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Users")}>
            <View className="rounded-l-full bg-[#B1A079] w-24 h-10 p-2">
              <Text className="font-semibold text-white text-center">All User's</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Searchbar
        style="w-2/5 mx-auto my-4 bg-white rounded-full p-2 shadow-md"
        placeholder="Search"
        onChangeText={(text) => searchDocument(text)}
      />

      {loading ? (
        <View style={styles.spinner}>
          <ActivityIndicator size="large" color="red" />
        </View>
      ) : (
        <FlatList
          data={documentFilter}
          ListHeaderComponent={ProductHeader}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <ListItem
              item={item}
              index={index}
              deleteDocument={deleteDocument}
            />
          )}
          keyExtractor={(item) => item.id}
        />
        
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    padding: 5,
    backgroundColor: "gainsboro",
  },
  headerItem: {
    margin: 3,
    width: width / 6,
  },
  spinner: {
    height: height / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginBottom: 160,
    backgroundColor: "white",
  },
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
  },
});

export default Documents;
