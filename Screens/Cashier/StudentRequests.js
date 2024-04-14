import React, { useCallback, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  openList,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import baseURL from "../../assets/common/baseUrl";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import RequestCard from "./RequestCard";
import { COLORS, SIZES } from "../../assets/constants";
import { Select } from "native-base";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";



const StudentRequests = (props) => {
  const [requests, setRequets] = useState([]);
  const [requestsFiltered, setRequestsFiltered] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigation = useNavigation();

 
  const searchRequests = (text) => {
    setFilteredRequests(
        requests.filter((request) => {
            // Extract the first seven characters from the ID
            const shortId = request.id.substring(0, 7);
            // Construct the tracking ID with 'BLA-' prefix
            const trackingId = `BLA-${shortId}`;
            // Check if the tracking ID contains the search text
            return trackingId.toLowerCase().includes(text.toLowerCase()) ||
                request.user.lastname.toLowerCase().includes(text.toLowerCase());
        })
    );
};
  
 
  useFocusEffect(
    useCallback(() => {
      getRequests();
      return () => {
        setRequestList([]);
        setFilteredRequests([]);
      };
    }, [])
  );

  useEffect(() => {
    // Filter requests when selected statuses change
    filterRequestsByStatus();
  }, [selectedStatuses]);

  const getRequests = () => {
    axios
      .get(`${baseURL}requests`)
      .then((res) => {
        setRequets(res.data);
        setRequestsFiltered(res.data);
        console.log("Response:", res.data);
        setRequestList(res.data);
        setFilteredRequests(res.data); // Initialize filtered requests with all requests
      })
      .catch((error) => console.log(error));
  };

  // Function to filter requests based on grade
  const filterGrade = (grade) => {
    if (grade === gradeFilter) {
      setFilteredRequests(requestList); // Reset to show all requests if the same grade filter is clicked again
      setGradeFilter("");
    } else {
      const filtered = requestList.filter(
        (item) => item.user && item.user.grade === grade
      ); // Add null check for item.user
      setFilteredRequests(filtered);
      setGradeFilter(grade);
    }
  };

  // Function to filter requests based on selected statuses
  const filterRequestsByStatus = () => {
    if (selectedStatuses.length === 0) {
      setFilteredRequests(requestList); // Reset to show all requests if no statuses are selected
    } else {
      const filtered = requestList.filter((item) =>
        selectedStatuses.includes(item.requestStatus)
      );
      setFilteredRequests(filtered);
    }
  };

  const fetchAllRequests = () => {
    getRequests();
    setSelectedStatuses([]); // Clear selected statuses
    setGradeFilter(""); // Clear grade filter
  };

  return (
    <SafeAreaView>
    <KeyboardAwareScrollView >
       <View className="pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4 w-12"
          >
            <ArrowLeftIcon size="20" color="black" />
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
              onPress={fetchAllRequests}
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
            <Select.Item label="Pending" value="Pending" />
            <Select.Item label="Setel your Balance" value="Setel your Balance" />
            {/* Add more Select.Item components for other statuses */}
          </Select>
        </View>
          <View style={styles.searchContainer}>
            <TouchableOpacity>
              <Feather name="search" size={30} style={styles.searchIcon} />
            </TouchableOpacity>
            <View style={styles.searchWrapper}>
              <TextInput
                onFocus={openList}
                onChangeText={(text) => searchRequests(text)}
                placeholder="Search"
              />
            </View>
         
          </View>
        </View>
        <View className="space-y-4">
          <FlatList
            data={filteredRequests}
            renderItem={({ item }) => (
              <View className="space-y-4">
                <RequestCard item={item} />
                <View style={styles.requestItem}>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()} // Ensure key is string
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
    </SafeAreaView>
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

  categoryContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  categoryButton: {
    backgroundColor: "#yellow-900",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  categoryText: {
    fontWeight: "bold",
    color: "white",
  },

  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});

export default StudentRequests;
