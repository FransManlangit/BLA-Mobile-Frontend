import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

const BalanceLogsList = ({ item }) => {
  const [isHide, setIsHide] = useState(false);

  const toggleHide = () => {
    setIsHide(!isHide);
  };

  const createdAtDate = new Date(item.createdAt);

  // Format the date
  const formattedDate = createdAtDate.toLocaleString("en-US", {
    month: "long", // Full month name (e.g., January)
    day: "2-digit", // Day with leading zeros (e.g., 18)
    year: "numeric", // Full year (e.g., 2024)
    hour: "numeric", // Hour (e.g., 1)
    minute: "2-digit", // Minute with leading zeros (e.g., 00)
    hour12: true, // 12-hour format (true) or 24-hour format (false)
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => toggleHide()}
        className="p-2 bg-white rounded-lg"
      >
        <View className="flex flex-row justify-between">
          <View className="flex-1 justify-start">
            <Text className="font-semibold">{item.studentName}</Text>
          </View>
          <View className="flex-1 justify-center items-start ">
            <Text className="font-semibold">{item.amountPaid}</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <View
              className={`px-3 rounded-full ${
                item.status === "Settled" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <Text className="text-white font-semibold">{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {isHide && (
        <View className="px-5 mb-5 space-y-3">
          <View className="border-t border-gray-300" />
          <View className="bg-gray-100 p-2 rounded-lg">
            <View className="flex-row space-x-2 justify-between">
              <Text className="text-gray-600">Record By:</Text>
              <Text className="font-semibold">{item.recordBy}</Text>
            </View>
            <View className="flex-row space-x-2 justify-between">
              <Text className="text-gray-600">Created At:</Text>
              <Text className="font-semibold">{formattedDate}</Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

export default BalanceLogsList;
