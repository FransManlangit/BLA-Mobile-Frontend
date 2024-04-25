import React, { useCallback, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  openList,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Select } from "native-base";
import OrderCard from "./OrderCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLOURS } from "../../assets/database/Database";
import { ChevronLeftIcon } from "react-native-heroicons/outline";

const Orders = (props) => {
  const [orders, setOrders] = useState([]);
  const [orderList, setOrderList] = useState();
  const [ordersFiltered, setOrdersFiltered] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const navigation = useNavigation();


  const searchOrders = (text) => {
    setFilteredOrders(
        orders.filter((order) => {
            // Extract the first seven characters from the ID
            const shortId = order.id.substring(0, 7);
            // Construct the tracking ID with 'BLA-' prefix
            const trackingId = `BLA-${shortId}`;
            // Check if the tracking ID contains the search text
            return trackingId.toLowerCase().includes(text.toLowerCase()) ||
              order.user.lastname.toLowerCase().includes(text.toLowerCase());
        })
    );
};

  useFocusEffect(
    useCallback(() => {
      getOrders();
      return () => {
        setOrderList();
        setFilteredOrders
      };
    }, [])
  );

  
  useEffect(() => {

    filterOrdersByStatus();
  }, [selectedStatuses]);

  console.log(`${baseURL}orders`);
  const getOrders = () => {
    axios
      .get(`${baseURL}orders`)
      .then((res) => {
        setOrders(res.data);
        setOrdersFiltered(res.data);
        setOrderList(res.data);
        setFilteredOrders(res.data);
      })
      .catch((error) => console.log(error));
  };


  const filterGrade = (grade) => {
    if (grade === gradeFilter) {
      setFilteredOrders(orderList); 
      setGradeFilter("");
    } else {
      const filtered = orderList.filter(
        (item) => item.user && item.user.grade === grade
      ); // Add null check for item.user
     setFilteredOrders(filtered);
      setGradeFilter(grade);
    }
  };

  const filterOrdersByStatus = () => {
    if (selectedStatuses.length === 0) {
      setFilteredOrders(orderList); 
    } else {
      const filtered = orderList.filter((item) =>
        selectedStatuses.includes(item.orderStatus)
      );
     setFilteredOrders(filtered);
    }
  };

  const fetchAllOrders = () => {
    getOrders();
    setSelectedStatuses([]); 
    setGradeFilter(""); 
  };

  return (
    <KeyboardAwareScrollView>
      <View className="pt-8 pl-4">
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
      <View className="p-3">
      <KeyboardAwareScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          className="space-x-3"
        >
          <View className="flex-row gap-4 pt-4 pl-4 pr-4 pb-4">
          <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-14 h-10 p-2"
              onPress={fetchAllOrders}
            >
              <Text className="font-semibold text-center text-white">All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-24 h-10 p-2"
              onPress={() => filterGrade("7 Philippians")}
            >
              <Text className="font-semibold text-white">7-Philippians</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-24 h-10 p-2"
              onPress={() => filterGrade("8 Colossians")}
            >
              <Text className="font-semibold text-white">8-Colossians</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-28 h-10 p-2"
              onPress={() => filterGrade("9 Thessalonians")}
            >
              <Text className="font-semibold text-white">9-Thessalonians</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-18 h-10 p-2"
              onPress={() => filterGrade("10 Titus")}
            >
              <Text className="font-semibold text-white">10-Titus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-24 h-10 p-2"
              onPress={() => filterGrade("11 Hebrew")}
            >
              <Text className="font-semibold text-white">11-Hebrew</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-l-full bg-[#B1A079] w-28 h-10 p-2"
              onPress={() => filterGrade("12 Revelation")}
            >
              <Text className="font-semibold text-white">12-Revelation</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <View className="flex flex-col">
        <View style={styles.dropdownContainer}>
          <Text className="text-xs font-normal">Select Status</Text>
          <Select
            mode="multiple"
            selectedValue={selectedStatuses}
            onValueChange={(value) => setSelectedStatuses(value)}
            style={styles.dropdown}
          >
            <Select.Item label="Approved" value="Approved" />
            <Select.Item label="Declined" value="Declined" />
            <Select.Item label="Received" value="Received" />
            <Select.Item label="Pending" value="Pending" />
        
          </Select>
        </View>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Feather name="search" size={30} style={styles.searchIcon} />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                onFocus={openList}
                onChangeText={(text) => searchOrders(text)}
                placeholder="Search"
              />
            </View>
         
          </View>
        </View>
        <View className="space-y-4">
        <FlatList
            data={filteredOrders}
            renderItem={({ item }) => (
              <View className="space-y-4">
                <OrderCard item={item} />
                <View style={styles.orderItem}>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()} 
          />
        </View>
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

export default Orders;
