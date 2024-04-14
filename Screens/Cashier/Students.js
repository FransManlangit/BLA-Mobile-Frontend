import React, { useState, useCallback } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  openList,
} from "react-native";
import { Searchbar } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Box } from "native-base";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import StudentsListView from "./StudetsListView";
import Toast from "react-native-toast-message";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View className="flex pt-2 p-2 flex-row space-x-6 items-center">
      <Text className="text-base w-24">Last Name</Text>
      <Text className="text-base w-28">Grade</Text>
      <Text className="text-base w-28">Role</Text>
      <Text className="text-base w-28">Students Balance</Text>
      <Text className="text-base w-28">Amount</Text>
     
    </View>
  );
};

const Students = (props) => {
  const [balanceList, setbalanceList] = useState([]);
  console.log(balanceList, "fetch the data bro");
  const [userFilter, setUserFilter] = useState([]);

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation(); // Use useNavigation hook to get navigation object

  const searchUser = (text) => {
    if (text === "") {
      setUserFilter(balanceList);
    }
    setUserFilter(
      balanceList.filter((i) =>
        i.lastname.toLowerCase().includes(text.toLowerCase()),
      
      )
    );
  };

  const deleteUserBalance = (id) => {
    axios
      .delete(`${baseURL}balances/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const users = userFilter.filter((item) => item.id !== id);
        setUserFilter(users);
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
          message: "Failed to delete user",
        });
      });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      axios.get(`${baseURL}balances`).then((res) => {
        setbalanceList(res.data);
        setUserFilter(res.data);
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

      axios
        .get(`${baseURL}balances/studentBalance`)
        .then((res) => {
          setbalanceList(res.data);
          setUserFilter(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle error as needed
        });

      return () => {
        setbalanceList();
        setUserFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full pt-12">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex flex-col">
            <View className="flex-row justify-start">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
              >
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>
            <View className="p-4 pt-8 flex-row space-x-60">
            <Text className="text-base font-normal">Swipe Left to View More</Text>
            <Text className="text-base font-normal">Long Press to delete</Text>
            </View>
            {loading ? (
              <View style={styles.spinner}>
                <ActivityIndicator size="large" color="red" />
              </View>
            ) : (
              <FlatList
                data={userFilter}
                ListHeaderComponent={ListHeader}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item, index }) => (
                  <StudentsListView
                    item={item}
                    index={index}
                    deleteUserBalance={deleteUserBalance}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
  buttonContainer: {
    margin: 20,
    alignSelf: "center",
    flexDirection: "row",
  },
  buttonText: {
    marginLeft: 4,
    color: "white",
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

export default Students;
