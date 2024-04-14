import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import baseURL from "../../assets/common/baseUrl";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";

const Register = ({ navigation }) => {
  const [lastname, setLastName] = useState("");
  const [firstname, setFirstName] = useState("");
  const [middlename, setMiddleName] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState("");

  
  const validateForm = () => {
    let errors = {};
    if (!firstname) errors.firstname = "First Name is Required";
    if (!lastname) errors.lastname = "Last Name is Required";
    if (!middlename) errors.middlename = "Middle Name is Required";
    if (!phone) errors.phone = "Mobile Number is Required ";
    if (!schoolId) errors.schoolId = "Your School ID is Required";
    if (!schoolYear) errors.schoolYear = "School Year is Required";
    if (!email) errors.email = "Email is Required";
    if (!password) errors.password = "Password is Required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const register = () => {
    if (!validateForm()) {
      return;
    }
    if (
      email === "" ||
      firstname === "" ||
      lastname === "" ||
      schoolId === "" ||
      schoolYear === "" ||
      phone === "" ||
      password === ""
    ) {
      setErrors("Please fill in the form correctly");
    }

    let user = {
      firstname: firstname,
      lastname: lastname,
      middlename: middlename,
      schoolId: schoolId,
      schoolYear: schoolYear,
      email: email,
      password: password,
      phone: phone,
      isAdmin: false,
    };

    axios
      .post(`${baseURL}users/register`, user)
      .then((res) => {
        if (res.status == 200) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: "Registration Succeeded",
            text2: "Please Login into your account",
          });
          setTimeout(() => {
            navigation.navigate("Login");
          }, 500);
        }
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with an error status code
          if (error.response.status === 400) {
            // Check if the error message indicates duplicate email or phone
            if (error.response.data === "Email already exists") {
              setErrors("Email already exists");
            } else if (error.response.data === "Phone number already exists") {
              setErrors("Phone number already exists");
            } else {
              setErrors("Registration failed. Please try again.");
            }
          } else {
            setErrors("Registration failed. Please try again.");
          }
        } else {
          // Error not from the server response
          setErrors("Registration failed. Please try again.");
        }
      });
  };
  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <View className="flex-1 bg-[#B1A079] pt-4">
          <View className="flex">
            <View className="flex-row justify-start">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
              >
                <ArrowLeftIcon size="20" color="black" />
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center pb-4">
              <Image
                source={require("../../assets/new-logo.png")}
                style={{ width: 190, height: 190 }}
              />
            </View>
          </View>
          <View
            className="flex-1 bg-white px-8 pt-8"
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
          >
            <View className="form space-y-2">
              <Text className="text-gray-700 ml-4">First Name</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="first name"
                name={"firstname"}
                id={"firstname"}
                value={firstname}
                onChangeText={(text) => setFirstName(text)}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.firstname ? (
                  <Text className="text-red-500">{errors.firstname}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">Last Name</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="last name"
                name={"lastname"}
                id={"lastname"}
                value={lastname}
                onChangeText={(text) => setLastName(text)}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.lastname ? (
                  <Text className="text-red-500">{errors.lastname}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">Middle Name</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="middle name"
                name={"middlename"}
                id={"middlename"}
                value={middlename}
                onChangeText={(text) => setMiddleName(text)}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.middlename ? (
                  <Text className="text-red-500">{errors.middlename}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">Mobile Number</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="mobile number"
                name={"phone"}
                id={"phone"}
                value={phone}
                keyboardType={"numeric"}
                onChangeText={(text) => setPhone(text.toLowerCase())}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.phone ? (
                  <Text className="text-red-500">{errors.phone}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">School ID</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="school id"
                name={"schoolId"}
                id={"schoolId"}
                value={schoolId}
                keyboardType={"numeric"}
                onChangeText={(text) => setSchoolId(text.toLowerCase())}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.schoolId ? (
                  <Text className="text-red-500">{errors.schoolId}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">School Year</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="school year"
                name={"schoolYear"}
                id={"schoolYear"}
                value={schoolYear}
                onChangeText={(text) => setSchoolYear(text)}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.schoolYear ? (
                  <Text className="text-red-500">{errors.schoolYear}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">Email Address</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="email address"
                name={"email"}
                id={"email"}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholderTextColor={"black"}
              />
              <Text className="font-bold text-justify">
                {errors.email ? (
                  <Text className="text-red-500">{errors.email}</Text>
                ) : null}
              </Text>
              <Text className="text-gray-700 ml-4">Password</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                placeholder="enter password"
                name={"password"}
                id={"password"}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholderTextColor={"black"}
                secureTextEntry={true}
              />
              <Text className="font-bold text-justify">
                {errors.password ? (
                  <Text className="text-red-500">{errors.password}</Text>
                ) : null}
              </Text>
              <TouchableOpacity
                onPress={() => register()}
                className="py-3 bg-[#FAE500] rounded-xl"
              >
                <Text className="font-xl font-bold text-center text-gray-700">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            <Text className="text-xl text-gray-700 font-bold text-center py-5">
              Or
            </Text>
            <View className="flex-row justify-center mt-4 pb-2">
              <Text className="text-gray-500 font-semibold">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="font-semibold text-yellow-500"> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;
