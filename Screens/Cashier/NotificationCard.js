import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Clipboard,
} from "react-native";
import { Spacer } from "native-base";
import { useNavigation } from "@react-navigation/native";


const NotificationCard = ({ item }) => {
  const navigation = useNavigation();


  const StudentRequests = () => {
    navigation.navigate("Requests", );
  };

  const copyToClipboard = (item) => {
    try {
      if (item && item.id) {
        Clipboard.setString(`BLA-${item.id.substring(0, 7)}`);
        Alert.alert("Success", "Text copied to clipboard!");
      } else {
        throw new Error("Item or item ID is undefined or null");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to copy text to clipboard!");
      console.error("Clipboard Error:", error);
    }
  };



  return (
    <View style={[styles.container]}>
     <TouchableOpacity onPress={StudentRequests}>
        <View className="p-4 bg-white rounded-lg mb-4">
          <View className="flex flex-col space-y-2 pb-2">
            <View className="flex flex-row">
              <Text className="text-zinc-700 text-right font-bold w-8/12 text-xl text-center pl-24 pb-4">
                {item.user ? item.user.role : ""}
              </Text>
            </View>
            <TouchableOpacity onPress={() => copyToClipboard(item)}>
              <View className="flex flex-row">
                <Text>Tracking ID:</Text>
                <Text className="text-zinc-700 text-right w-8/12 text-base">
                  BLA-{item.id.substring(0, 7)}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex flex-row">
              <Text className="text-base">Email:</Text>
              <Text className="text-zinc-700 text-right w-10/12 text-base">
                {item.user ? item.user.email : ""}
              </Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-base">Last Name</Text>
              <Text className="text-zinc-700 text-right w-8/12 text-base">
                {item.user ? item.user.lastname : ""}
              </Text>
            </View>

            <View className="flex flex-row">
              <Text className="text-base">Grade:</Text>
              <Text className="text-zinc-700 text-right w-10/12 text-base">
                {item.user ? item.user.grade : ""}
              </Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-base">Purpose:</Text>
              <Text className="text-zinc-700 text-right w-9/12 text-base">
                {item.user ? item.purpose : ""}
              </Text>
            </View>
            <View className="flex flex-row">
              <Text className="text-base">Date of Request</Text>
              <Text className="text-zinc-700 text-right w-7/12 text-base">
                {item.dateofRequest.split("T")[0]}
              </Text>
            </View>
            <Spacer />
            <Text className="font-bold text-xl">Request List</Text>
            <View className="flex flex-col space-y-4">
              {item.requestItems.map((requestItem, index) => (
                <View key={index} className="flex flex-row">
                  <Text className="text-base">
                    {requestItem.document?.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 2,
    // Add other styles as needed
  },
});

export default NotificationCard;
