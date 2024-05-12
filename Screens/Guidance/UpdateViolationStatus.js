import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseURL from "../../assets/common/baseUrl";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Select } from "native-base"; // Import Select component from native-base
import AuthGlobal from "../../Context/Store/AuthGlobal"; // Import AuthGlobal context

const UpdateViolationStatus = (props) => {
  const [violation, setViolation] = useState("");
  const [item, setItem] = useState();
  const [violationStatus, setViolationStatus] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const context = useContext(AuthGlobal);
  let navigation = useNavigation();

  
  useEffect(() => {
    setItem(props.route.params.item);

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    return () => {};
  }, []);

    console.log("Itemssssss", props.route.params.item)
  console.log(context.stateUser.user.userId, "userId");
  
  const updateViolationStatus = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const requestData = {
        status: violationStatus,
        user: item.user._id,
        guidanceLastName: context.stateUser.user.lastname,
        guidanceRole: context.stateUser.user.role,
      };



      const response = await axios.put(
        `${baseURL}violations/update-violation-status/${item.id}`,
        requestData,
        config
      );

      if (response.status === 200 || response.status === 201) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Violation status successfully updated",
          text2: "",
        });
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error updating violation status:", error);
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Something went wrong",
        text2: "Failed to update violation status",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <View className="flex bg-white h-full w-full p-4">
        <View
          className="flex-1 bg-white mt-5"
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <View className="form space-y-3 p-6 mt-5">
            <View>
              <Text className="font-bold text-2xl">Select Status</Text>
            </View>

            <View className="">
              <Select
                selectedValue={violationStatus}
                onValueChange={(value) => setViolationStatus(value)}
              >
                  <Select.Item label="Community Service" value="Community Service"/>
                <Select.Item label="Parent Meeting" value="Parent Meeting"/>
                <Select.Item label="With Violation" value="With Violation" />
              </Select>
            </View>
          </View>
          <View className="px-4 mb-4">
            <TouchableOpacity
              className="bg-[#FAE500] py-4 rounded-xl items-center mt-4"
              onPress={() => updateViolationStatus()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="font-xl font-bold text-center text-zinc-700">
                  Confirm
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#FAE500] py-4 rounded-xl items-center mt-4"
              onPress={() => navigation.goBack()}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text className="font-xl font-bold text-center text-zinc-700">
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UpdateViolationStatus;
