import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const DateDetails = ({ route }) => {
  const { request } = route.params;
  const [requestItems, setRequestItems] = useState([]);

  const navigation = useNavigation();

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    const fetchRequestItems = async () => {
      try {
        const response = await axios.get(
          `${baseURL}requests/get/userRequests/${request._id}`
        );

    
        setRequestItems(response.data[0]?.requestItems || []); 
      } catch (error) {
        console.error("Error fetching request items:", error);
      
      }
      console.log(request, "frans330928");
    };

    console.log("Request ID:", request._id); 

    fetchRequestItems();
  }, [request._id]);

  console.log("Requested Documents",)

  return (
    <SafeAreaView>
      <View className="flex p-4 bg-white h-full w-full">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={30} />
        </TouchableOpacity>
        <Text className="text-2xl text-yellow-900 font-semibold pt-12 text-center">
          Requested Documents
        </Text>

        <View className="mt-4 ">
          {request.requestItems ? (
            request.requestItems.map((requestItem) => (
              <View
                key={requestItem.document._id}
                className="flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <View className="flex-row items-center">
                  <Text className="text-4xl text-blue-500 mr-2">
                    {"\u2022"}
                  </Text>
                  <View className="flex-col gap-6 pt-8 pl-2">
                    <Text className="font-bold text-lg">
                      {requestItem.document.name}
                    </Text>
                    <Text>
                      Price: {requestItem.document.price} | Copies:{" "}
                      {requestItem.quantity}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No request items available</Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DateDetails;
