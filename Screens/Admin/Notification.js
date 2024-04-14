import React, { useCallback, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NotificationCard from "./NotificationCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";


const Notification = (props) => {
  const [requests, setRequests] = useState([]);

  const [requestsFiltered, setRequestsFiltered] = useState([]);

  const [filteredRequests, setFilteredRequests] = useState([]);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getRequests();
      return () => {
        setRequests([]);
        setFilteredRequests([]);
      };
    }, [])
  );

  

  const getRequests = () => {
    axios
      .get(`${baseURL}requests`)
      .then((res) => {
        const pendingRequests = res.data.filter(
          (request) => request.requestStatus === "Pending"
        );
        setRequests(pendingRequests);
        setRequestsFiltered(pendingRequests);

        setFilteredRequests(pendingRequests);
      })
      .catch((error) => console.log(error));
  };

  return (
    <KeyboardAwareScrollView>
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
              </View>
            )}
            keyExtractor={(item) => item.id.toString()} // Ensure key is string
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default Notification;
