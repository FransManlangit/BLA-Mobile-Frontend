import React, { useCallback, useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NotificationCard from "./NotificationCard";
import { COLORS, SIZES } from "../../assets/constants";

import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Notification = (props) => {
  const [requests, setRequests] = useState([]);
  const [requestsFiltered, setRequestsFiltered] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);


  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getRequests();
      return () => {
        setRequestList([]);
        setFilteredRequests([]);
      };
    }, [])
  );


  const getRequests = () => {
    axios
      .get(`${baseURL}requests`)
      .then((res) => {
        // Filter requests to get only pending requests
        const pendingRequests = res.data.filter(
          (request) => request.requestStatus === "Pending"
        );
  
        setRequests(pendingRequests);
        setRequestsFiltered(pendingRequests);
        setRequestList(pendingRequests);
        setFilteredRequests(pendingRequests); // Initialize filtered requests with pending requests

        // Update the pending requests count in the NotificationIcon component
        setPendingRequestsCount(pendingRequests.length);
      })
      .catch((error) => console.log(error));
      
  };

 
  return (
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
     <View className="space-y-4">
       <FlatList
         data={filteredRequests}
         renderItem={({ item }) => (
           <View className="space-y-4">
             <NotificationCard item={item} />
             <View style={styles.requestItem}>
             </View>
           </View>
         )}
         keyExtractor={(item) => item.id.toString()} // Ensure key is string
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


export default Notification;
