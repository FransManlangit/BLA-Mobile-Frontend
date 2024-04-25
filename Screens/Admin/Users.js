import React, { useState, useCallback } from "react";
import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";
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
import UserListView from "./UserListView";
import Toast from "react-native-toast-message";
import { COLORS, SIZES } from "../../assets/constants";
import { COLOURS, Item } from "../../assets/database/Database";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

var { height, width } = Dimensions.get("window");

const ListHeader = () => {
  return (
    <View className="flex-row gap-4 pt-4 pl-4 pr-4 pb-4 text-lg">
      <Text className="font-semibold">Last Name</Text>
      <Text className="font-semibold">Grade and Section</Text>
      <Text className="font-semibold">School Year</Text>
      <Text className="font-semibold">Role</Text>
    </View>
  );
};

const Users = (props) => {
  const [userList, setUserList] = useState();
  console.log(userList, "fetch the data bro");
  const [userFilter, setUserFilter] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState();
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation(); // Use useNavigation hook to get navigation object

  const searchUser = (text) => {
    if (text === "") {
      setUserFilter(userList);
    }
    setUserFilter(
      userList.filter((i) =>
        i.lastname.toLowerCase().includes(text.toLowerCase())
      )
    );
  };
  
    
  const deleteUser = (id) => {
    axios
      .delete(`${baseURL}users/${id}`, {
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
      axios.get(`${baseURL}users`).then((res) => {
        setUserList(res.data);
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

      axios.get(`${baseURL}users`).then((res) => {
        setUserList(res.data);
        setUserFilter(res.data);
        setLoading(false);
      });

      return () => {
        setUserList();
        setUserFilter();
        setLoading(true);
      };
    }, [])
  );

  return (
    <View className="flex-col pt-6"> 
    <View className="pl-4">
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
          </View>
       <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Feather name="search" size={25} style={styles.searchIcon} />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                onFocus={openList}
                onChangeText={(text) => searchUser(text)}
                placeholder="Search"
              />
            </View>
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
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item, index }) => (
            <UserListView item={item} index={index} deleteUser={deleteUser} />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
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

export default Users;
