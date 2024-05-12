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
import { useSelector, useDispatch } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PencilSquareIcon,
  ArrowLeftEndOnRectangleIcon,
  ClipboardDocumentIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  ListBulletIcon,
  LockClosedIcon,
  ClipboardDocumentListIcon,
} from "react-native-heroicons/solid";
import Clearance from "./Clearance";

const UserProfile = () => {
  const context = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState("");

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const Guidance = (request) => {
    navigation.navigate("Requests", { request });
  };

  const handleEditPress = () => {
    navigation.navigate("UserUpdate", { userProfile });
  };

  const handleViolationPress = (request) => {
    navigation.navigate("Violation", { request });
  };

  const studentlist = (request) => {
    navigation.navigate("Students", { request });
  };

  const clearancelist = (request) => {
    navigation.navigate("Clearance", { request });
  };

  
  const changepassword = (request) => {
    navigation.navigate("ChangePassword", { request });
  };

  const violationlogs = () => {
    navigation.navigate("ViolationLogs", { });
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
      }

      return () => {
        setUserProfile("");
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
            <TouchableOpacity onPress={Guidance}>
              {context.stateUser.user.role === "guidance" && (
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <ClipboardDocumentIcon
                    size={45}
                    color={COLORS.versatilegray}
                  />
                  <Text className="font-semibold pl-4">Student Requests</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={clearancelist}>
              {context.stateUser.user.role === "guidance" && (
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <ListBulletIcon size={45} color={COLORS.versatilegray} />
                  <Text className="font-semibold pl-4">
                    Student's Clearance List
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={studentlist}>
              {context.stateUser.user.role === "guidance" && (
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <UserGroupIcon size={45} color={COLORS.versatilegray} />
                  <Text className="font-semibold pl-4">
                    Student's with Violation
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleViolationPress()}>
              {context.stateUser.user.role === "guidance" && (
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <ShieldExclamationIcon
                    size={45}
                    color={COLORS.versatilegray}
                  />
                  <Text className="font-semibold pl-4">
                    Add Student's Violation
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => violationlogs()}>
              {context.stateUser.user.role === "guidance" ? (
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <ClipboardDocumentListIcon size={45} color={COLORS.versatilegray} />
                  <Text className="font-semibold pl-4 ">Violation Logs</Text>
                </View>
              ) : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changepassword()}>
                <View className="pl-4 flex flex-row space-x-1 items-center">
                  <LockClosedIcon size={45} color={COLORS.versatilegray} />
                  <Text className="font-semibold pl-4 ">Change Password</Text>
                </View>
              </TouchableOpacity>
            <TouchableOpacity onPress={() => handleEditPress()}>
              <View className="pl-4 flex flex-row space-x-1 items-center">
                <PencilSquareIcon size={45} color={COLORS.versatilegray} />
                <Text className="font-semibold pl-4 ">Edit Profile</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await AsyncStorage.removeItem("jwt");
                logoutUser(context.dispatch);
                navigation.navigate("Login");
              }}
            >
              <View className="pl-4 flex flex-row space-x-1 items-center">
                <ArrowLeftEndOnRectangleIcon
                  name="sign-out-alt"
                  size={50}
                  color={COLORS.versatilegray}
                />
                <Text className="font-semibold pl-4">Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;
