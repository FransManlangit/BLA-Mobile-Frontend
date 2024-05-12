import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import ViolationLogsList from "./ViolationLogsList";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { COLOURS, Item } from "../../assets/database/Database";
import { useNavigation } from "@react-navigation/native";

const ViolationLogs = (props) => {
  const [violationLogs, setViolationLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("jwt")
        .then((res) => {
          setToken(res);
        })
        .catch((error) => console.log(error));

      fetchViolationLogs(1);

      return () => {
        setViolationLogs([]);
      };
    }, [])
  );

  const fetchViolationLogs = (pageNum) => {
    setLoading(true);
    axios
      .get(`${baseURL}violations/violationLogs?page=${pageNum}`)
      .then((res) => {
        console.log(res.data);
        if (pageNum === 1) {
          setViolationLogs(res.data.violationLogs);
        } else {
          setViolationLogs((prevLogs) => [...prevLogs, ...res.data.violationLogs]);
        }
        setHasMore(res.data.hasMore);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error("Error fetching violation logs:", error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const onRefresh = useCallback(() => {
    setPage(1);
    setRefreshing(true);
    fetchViolationLogs(1);
  }, []);

  const onEndReached = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      fetchViolationLogs(page + 1);
    }
  };

  const ListHeader = () => {
    return (
      <View className="p-5 bg-[#FAE500] rounded-lg ">
        <View className="flex flex-row space-x-12">
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black w-32">Student's Name</Text>
          </View>
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black w-32 ">Violation Type</Text>
          </View>
    
          <View className="flex-1 justify-center items-start">
            <Text className="font-bold text-black">Status</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 pt-4">
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
      <View className="flex-1 p-4">
        {loading && page === 1 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="red" />
          </View>
        ) : (
          <FlatList
            data={violationLogs}
            ListHeaderComponent={ListHeader}
            renderItem={({ item, index }) => (
              <View className="mt-1 bg-white rounded-lg">
                <ViolationLogsList item={item} index={index} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="red"/>
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </View>
  );
};

export default ViolationLogs;