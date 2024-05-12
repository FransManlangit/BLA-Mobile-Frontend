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
import StudentsListView from "./StudentsListView";
import Toast from "react-native-toast-message";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View className="p-5 bg-[#FAE500] rounded-lg ">
       <View className="flex flex-row justify-between ">
       <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black w-20">LastName</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black w-16">Grade</Text>
          </View>
          
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black ">Type</Text>
          </View>
          
          <View className="flex-1 justify-center items-start ">
            <Text className="font-bold text-black">Date</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black">Status</Text>
          </View>
        </View>
    
    </View>
  );
};

const Students = (props) => {
  const [violationList, setviolationList] = useState([]);
  const [userFilter, setUserFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation(); // Use useNavigation hook to get navigation object

  const searchUser = (text) => {
    if (text === "") {
      setUserFilter(violationList);
    }
    setUserFilter(
      violationList.filter((i) =>
        i.lastname.toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const deleteUserViolation = (id) => {
    axios
      .delete(`${baseURL}violations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const violations = userFilter.filter((item) => item.id !== id);
        setUserFilter(violations);
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
      axios.get(`${baseURL}violations`).then((res) => {
        setviolationList(res.data);
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
        .get(`${baseURL}violations/studentViolation`)
        .then((res) => {
          setviolationList(res.data);
          setUserFilter(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle error as needed
        });

      return () => {
        setviolationList();
        setUserFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full pt-6 p-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex flex-col">
            <View className="flex-row ">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
              >
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>
            <View className="p-4 flex-row space-x-60">
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
                    deleteUserViolation={deleteUserViolation}
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
