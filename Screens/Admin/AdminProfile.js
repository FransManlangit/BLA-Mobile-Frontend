import React, { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import { COLORS, SIZES } from "../../assets/constants";
import { useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PencilSquareIcon,
  ArrowLeftEndOnRectangleIcon,
  PhotoIcon,
} from "react-native-heroicons/solid";

const AdminProfile = () => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");
  const [requests, setRequests] = useState([]);
  console.log(requests, "Profile");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleEditPress = () => {
    navigation.navigate("EditProfile", { userProfile });
  };

  const Authorization = (Authorization) => {
    navigation.navigate("Authorization", { Authorization });
  };

  useFocusEffect(
    useCallback(() => {
      if (
        context.stateUser.isAuthenticated === false ||
        context.stateUser.isAuthenticated === null
      ) {
        navigation.navigate("Login");
      }

      {
        AsyncStorage.getItem("jwt")
          .then((res) => {
            axios
              .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                headers: { Authorization: `Bearer ${res}` },
              })
              .then((user) => setUserProfile(user.data))
              .catch((error) => console.log(error));
          })
          .catch((error) => console.log(error));

        axios
          .get(
            `${baseURL}requests/requestItems/${context.stateUser.user.userId}`
          )
          .then((res) => setRequests(res.data))
          .catch((error) => console.log(error));
      }

      return () => {
        setUserProfile("");
        setRequests([]);
      };
    }, [context.stateUser.isAuthenticated])
  );

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="h-screen w-screen flex bg-[#FFFFFF]">
          <View className="px-5 flex-row items-center space-x-4 pt-4">
            <View className="rounded-full pb-8">
              <Image
                className="rounded-full h-28 w-28"
                source={
                  userProfile.avatar?.url
                    ? { uri: userProfile.avatar?.url }
                    : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
                }
              />
            </View>
            <View className="flex">
              <Text className="font-bold italic text-lg">
                {" "}
                {userProfile
                  ? `${userProfile.firstname} ${userProfile.lastname}`
                  : ""}
              </Text>
              <Text className="text-black text-s text-center">
                {userProfile ? userProfile.email : ""}
              </Text>
            </View>
          </View>
          <View className="flex flex-col gap-6 pt-4 ">
            <TouchableOpacity onPress={() => Authorization()}>
              <View className="pl-4 flex flex-row space-x-1 items-center">
                <PhotoIcon size={42} color={COLORS.versatilegray} />
                <Text className="font-semibold pl-4 ">Student's Authorization</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditPress()}>
              <View className="pl-4 flex flex-row space-x-1 items-center">
                <PencilSquareIcon size={45} color={COLORS.versatilegray} />
                <Text className="font-semibold pl-4 ">Edit Profile</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => [
                navigation.navigate("Login"),
                AsyncStorage.removeItem("jwt"),
                logoutUser(context.dispatch),
              ]}
            >
              <View className="pl-4 flex flex-row space-x-1 items-center">
                <ArrowLeftEndOnRectangleIcon
                  name="sign-out-alt"
                  size={50}
                  color={COLORS.versatilegray}
                />
                <Text className="font-semibold pl-4 ">Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AdminProfile;
