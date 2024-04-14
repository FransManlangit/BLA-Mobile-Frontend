import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { COLORS } from "../../assets/constants";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Input from "../../Shared/Form/Input";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import mime from "mime";

const EditProfile = (props) => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [mainImage, setMainImage] = useState();
  const [token, setToken] = useState();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  let navigation = useNavigation();

  const [user, setUser] = useState(props.route.params.userProfile);
  console.log(props.route.params);

  const context = useContext(AuthGlobal);

  const changePassword = () => {
    console.log("Attempting to update password...");
    const id = user._id;
    const data = { currentPassword, newPassword };

    axios
      .put(`${baseURL}users/changePassword/${id}`, data)
      .then((res) => {
        console.log("Password updated successfully");
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Password updated successfully",
          text2: "",
        });
      })
      .catch((error) => {
        console.log("Error updating password", error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Error updating password",
          text2: "",
        });
      });
  };

  const updateProfile = () => {
    let formData = new FormData();
    formData.append("email", email);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("middlename", middlename);
    formData.append("phone", phone);

    const id = user._id;

    if (mainImage == undefined) {
    } else if (mainImage !== image) {
      const newImageUri = "file:///" + mainImage.split("file:/").join("");

      formData.append("image", {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split("/").pop(),
      });
    }
    console.log(formData, "update user");

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .put(`${baseURL}users/userProfile/${id}`, formData, config)
      .then((res) => {
        console.log("Profile updated successfully");
        navigation.navigate("User Profile");
      })
      .catch((error) => {
        console.log("Error updating profile", error);
      });
  };

  useEffect(() => {
    setEmail(user.email || "");
    setFirstName(user.firstname || "");
    setLastName(user.lastname || "");
    setMiddleName(user.middlename || "");
    setPhone(user.phone || "");
    setMainImage(user.avatar.url || "");
    setImage(user.avatar.url || "");

    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, [user]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets);
      setMainImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView className="p-5 bg-lightWhite">
      <View className="pt-8">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <StatusBar backgroundColor={COLORS.brown} />

        <View className="pt-10 items-center">
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={
                mainImage
                  ? { uri: mainImage }
                  : "https://res.cloudinary.com/dn638duad/image/upload/v1698419194/Beige_and_Charcoal_Modern_Travel_Itinerary_A4_Document_v9fz8j.png"
              }
              className="h-40 w-40 rounded-full border-2 border-primary overflow-hidden"
            />
          </TouchableOpacity>
          <View className=" flex-col">
            <Text className="font-bold ">Email</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"email"}
                id={"email"}
                value={email}
                onChangeText={(text) => setEmail(text)}
              ></Input>
            </View>
            <Text className="font-bold ">First Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"firstname"}
                id={"firstname"}
                value={firstname}
                onChangeText={(text) => setFirstName(text)}
              ></Input>
            </View>
            <Text className="font-bold">Last Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"lastname"}
                id={"lastname"}
                value={lastname}
                onChangeText={(text) => setLastName(text)}
              ></Input>
            </View>
            <Text className="font-bold">Middle Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"mdiddlename"}
                id={"middlename"}
                value={middlename}
                onChangeText={(text) => setMiddleName(text)}
              ></Input>
            </View>
            <Text className="font-bold">Phone</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"phone"}
                id={"phone"}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              ></Input>
            </View>
            <Text className="font-bold">Current Password</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"currentPassword"}
                id={"currentPassword"}
                value={currentPassword}
                secureTextEntry={true}
                onChangeText={(text) => setCurrentPassword(text)}
              ></Input>
            </View>
            <Text className="font-bold">New Password</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"newPassword"}
                id={"newPassword"}
                value={newPassword}
                secureTextEntry={true}
                onChangeText={(text) => setNewPassword(text)}
              ></Input>
            </View>
          </View>
          <View className="pb-6 pt-6 flex-row space-x-2">
            <TouchableOpacity
              className="py-3 w-32 
              bg-[#FAE500] rounded-xl "
              onPress={() => updateProfile()}
            >
              <Text className="text-base font-semibold text-center text-black">
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="py-3 w-40 
              bg-[#FAE500] rounded-xl "
              onPress={() => changePassword()}
            >
              <Text className="text-base font-semibold text-center text-black">
                Change Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
