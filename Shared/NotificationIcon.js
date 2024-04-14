import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Badge, VStack, Text } from "native-base";
import axios from "axios";
import { BellIcon } from "react-native-heroicons/solid";
import { COLORS } from "../assets/constants";
import baseURL from "../assets/common/baseUrl";

const NotificationIcon = (props) => {
  const { color } = props;
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  useEffect(() => {
    const fetchPendingRequestsCount = async () => {
      try {
        const response = await axios.get(`${baseURL}requests`);
        const pendingRequests = response.data.filter(
          (request) => request.requestStatus === "Pending"
        );
        setPendingRequestsCount(pendingRequests.length);
      } catch (error) {
        console.error("Error fetching pending requests count:", error);
      }
    };

    fetchPendingRequestsCount();
  }, []);

  return (
    <>
      {pendingRequestsCount > 0 && (
        <VStack space={2} alignItems="center">
          <View className="p-5 flex-row">
            <Badge
              className="bg-[#B1A079] border-solid border-white"
              rounded="md"
              top={-2} 
              right={-2}
              position="absolute"
              zIndex={1}
              variant="solid"
              alignSelf="flex-end"
              _text={{
                fontSize: 14,
                color: COLORS.white,
              }}
            >
              {pendingRequestsCount}
            </Badge>
            <BellIcon color={color} />
          </View>
        </VStack>
      )}
    </>
  );
};

export default NotificationIcon;
