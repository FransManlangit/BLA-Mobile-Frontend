import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import baseURL from "../../assets/common/baseUrl";
import FormContainer from "../../Shared/Form/FormContainer";
import EasyButton from "../../Shared/StyledComponents/EasyButtons";
import {
  NativeBaseProvider,
  Box,
  HStack,
  VStack,
  FlatList,
  Heading,
  Avatar,
  Spacer,
  Center,
  FormControl,
  CheckIcon,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { COLORS, SIZES } from "../../assets/constants";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

const ViolationForm = (props) => {
  const [userList, setUserList] = useState();
  const [user, setUser] = useState("");
  const [date, setDateTime] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [violation, setViolation] = useState(null);
  const [type, setTpye] = useState("");
  const [description, setDescription] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [datePickerType, setDatePickerType] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);

  const context = useContext(AuthGlobal);
  let navigation = useNavigation();

  // useEffect(() => {
  //   if (context.stateUser.isAuthenticated) {
  //     setUser(context.stateUser.user.userId);
  //   } else {
  //     navigation.navigate("User", { screen: "Login" });
  //     Toast.show({
  //       topOffset: 60,
  //       type: "error",
  //       text1: "Please Login to Checkout",
  //       text2: "",
  //     });
  //   }
  // }, []);

  const showDatePicker = (type) => {
    setDatePickerType(type);
    if (type === "start") {
      setStartDatePickerVisibility(true);
    }
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString();

    if (datePickerType === "start") {
      setDateTime(formattedDate);
    }
    hideDatePicker();
  };

  const onUserChange = (value) => {
    setUser(value);
  };

  useEffect(() => {
    if (props.route.params && props.route.params.violation) {
      setTpye(props.route.params.violation.type);
      setDescription(props.route.params.violation.description);
      setViolation(props.route.params.violation.Violation);
      setDateTime(props.route.params.violation.date);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));
    axios.get(`${baseURL}users/usersList`).then((res) => {
      setUserList(res.data);
      console.log(userList, "Users List");
      return () => {
        setUserList();
      };
    });
  }, []);
  console.log(userList, "Users User List");

  const addOrUpdateViolation = () => {
    // Consolidate error handling
    if (type === "" || description === "" || date === "") {
      setError("Please fill in the form correctly");
      return;
    }

    // Create FormData for file uploads
    let formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);

    // Prepare data object for violation
    const Violation = {
      date,
      user,
      type,
      description,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (violation !== null) {
      axios
        .put(`${baseURL}violations/${violation.id}`, Violation, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Violation successfully updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("ViolationContainer");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    } else {
      axios
        .post(`${baseURL}violations`, Violation, formData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Violation Added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("Guidance Profile");
            }, 500);
          }
        })
        .catch((error) => {
          console.log(error);
          Toast.show({
            topOffset: 60,
            type: "error",
            text1: "Something went wrong",
            text2: "Please try again",
          });
        });
    }
  };

  return (
    <SafeAreaView>
      <View className="bg-white h-full w-full pt-4">
        <View className="pt-12">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4 w-12"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-semibold text-center">
          Set Violation
        </Text>
        <View className="pt-4">
          <Center>
            <FormControl w="3/4" maxW="300">
              <FormControl.Label>Choose Student</FormControl.Label>
              <Select
                minWidth="200"
                accessibilityLabel="Choose Student"
                placeholder="Select User"
                onValueChange={onUserChange}
                selectedValue={user}
                _selectedItem={{
                  bg: "yellow.300",
                  endIcon: <CheckIcon size={5} />,
                }}
                mt="1"
              >
                {userList &&
                  userList.map((user) => (
                    <Select.Item
                      key={user._id}
                      label={`${user.lastname} - Grade: ${user.grade}`}
                      value={user._id}
                    />
                  ))}
              </Select>
              {/* <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Please make a selection!
            </FormControl.ErrorMessage> */}
            </FormControl>
            <View className="pt-4 pb-4">
              <Text>Type</Text>
              <View className="items-baseline bg-black/5 p-5 rounded-2xl w-72 h-14">
                <TextInput
                  placeholder="Type"
                  name="type"
                  id="type"
                  value={type}
                  onChangeText={(text) => setTpye(text)}
                />
              </View>
              <Text>Description</Text>
              <View className="items-baseline bg-black/5 p-5 rounded-2xl w-72 h-14">
                <TextInput
                  placeholder="Description"
                  name="description"
                  id="description"
                  value={description}
                  onChangeText={(text) => setDescription(text)}
                />
              </View>
            </View>
            <Text className="font-semibold text-center pt-4">Select Date</Text>
            <TouchableOpacity className="pt-4">
              <View className="pl-4 flex flex-row space-x-4 items-center">
                <CalendarDaysIcon
                  onPress={() => showDatePicker("start")}
                  name="calendar-alt"
                  size={45}
                  color={COLORS.versatilegray}
                />
                <Text className="text-sm font-normal">
                  {date ? new Date(date).toLocaleString() : ""}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="flex items-center pt-12">
              <TouchableOpacity
                large
                primary
                onPress={() => addOrUpdateViolation()}
                className="bg-[#FAE500] p-4 w-40 rounded-lg mb-3"
              >
                <Text className="text-lg font-bold text-black text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </Center>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default ViolationForm;
