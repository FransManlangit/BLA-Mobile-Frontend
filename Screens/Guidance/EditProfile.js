import React, { useContext, useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import { COLORS } from "../../assets/constants";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Input from "../../Shared/Form/Input";
import { Ionicons } from "@expo/vector-icons";
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
  const [errors, setErrors] = useState("");
  const [user, setUser] = useState(props.route.params.userProfile);
  console.log(props.route.params);

  const context = useContext(AuthGlobal);
  let navigation = useNavigation();

  const validateForm = () => {
    let errors = {};
    if (!firstname) errors.firstname = "First Name is Required";
    if (!lastname) errors.lastname = "Last Name is Required";
    if (!middlename) errors.middlename = "Middle Name is Required";
    if (!phone) errors.phone = "Mobile Number is Required ";
    if (!email) errors.email = "Email is Required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateProfile = () => {
    if (!validateForm()) {
      return;
    }

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
        navigation.navigate("GuidanceProfile");
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
            <Text className="font-bold text-justify">
              {errors.email ? (
                <Text className="text-red-500">{errors.email}</Text>
              ) : null}
            </Text>
            <Text className="font-bold ">First Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"firstname"}
                id={"firstname"}
                value={firstname}
                onChangeText={(text) => setFirstName(text)}
              ></Input>
            </View>
            <Text className="font-bold text-justify">
              {errors.firstname ? (
                <Text className="text-red-500">{errors.firstname}</Text>
              ) : null}
            </Text>
            <Text className="font-bold">Last Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"lastname"}
                id={"lastname"}
                value={lastname}
                onChangeText={(text) => setLastName(text)}
              ></Input>
            </View>
            <Text className="font-bold text-justify">
              {errors.lastname ? (
                <Text className="text-red-500">{errors.lastname}</Text>
              ) : null}
            </Text>
            <Text className="font-bold">Middle Name</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"mdiddlename"}
                id={"middlename"}
                value={middlename}
                onChangeText={(text) => setMiddleName(text)}
              ></Input>
            </View>
            <Text className="font-bold text-justify">
              {errors.middlename ? (
                <Text className="text-red-500">{errors.middlename}</Text>
              ) : null}
            </Text>
            <Text className="font-bold">Phone</Text>
            <View className="bg-black/5 p-5 rounded-xl w-64">
              <Input
                name={"phone"}
                id={"phone"}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              ></Input>
            </View>
            <Text className="font-bold text-justify">
              {errors.phone ? (
                <Text className="text-red-500">{errors.phone}</Text>
              ) : null}
            </Text>
          </View>
          <View className="pb-6 pt-6 ">
            <TouchableOpacity
              className="py-3 w-32 
              bg-[#FAE500] rounded-xl "
              onPress={() => updateProfile()}
            >
              <Text className="text-base font-semibold text-center text-black">
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfile;
