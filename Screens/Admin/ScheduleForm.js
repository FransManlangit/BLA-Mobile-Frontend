import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import baseURL from "../../assets/common/baseUrl";
import {
  FormControl,
  Center,
  CheckIcon,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { CalendarDaysIcon } from "react-native-heroicons/solid";
import { COLORS, SIZES } from "../../assets/constants";

const ScheduleForm = (props) => {
  const [userList, setUserList] = useState([]);
  const [user, setUser] = useState("");
  const [DateTime, setDateTime] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [schedule, setSchedule] = useState(null);
  const [datePickerType, setDatePickerType] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(
    false
  );

  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  useEffect(() => {
    if (context.stateUser.isAuthenticated) {
      setUser(context.stateUser.user.userId);
    } else {
      navigation.navigate("User", { screen: "Login" });
      Toast.show({
        topOffset: 60,
        type: "error",
        text1: "Please Login to Checkout",
      });
    }
  }, []);

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

  useEffect(() => {
    if (!props.route.params) {
      setSchedule(null);
    } else {
      setSchedule(props.route.params.schedule.Schedule);
      setDateTime(props.route.params.schedule.DateTime);
    }
    AsyncStorage.getItem("jwt")
      .then((res) => {
        setToken(res);
      })
      .catch((error) => console.log(error));

    axios
      .get(`${baseURL}users/approvedRequests`)
      .then((res) => {
        const formattedUserList = res.data.map((user) => ({
          _id: user.user._id,
          firstname: user.user.firstname,
          lastname: user.user.lastname,
          grade: user.user.grade,
        }));
        setUserList(formattedUserList);
      })
      .catch((error) => {
        console.log(error);
        Toast.show({
          topOffset: 60,
          type: "error",
          text1: "Something went wrong while fetching user data",
        });
      });
  }, []);

  const addOrUpdateSchedule = () => {
    if (DateTime === "") {
      setError("Please fill in the form correctly");
      return;
    }
    const Schedule = {
      DateTime,
      user,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = schedule
      ? `${baseURL}schedules/${schedule.id}`
      : `${baseURL}schedules`;
    const method = schedule ? axios.put : axios.post;

    method(url, Schedule, config)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          Toast.show({
            topOffset: 60,
            type: "success",
            text1: schedule
              ? "Schedule successfully updated"
              : "Schedule Added",
          });
          setTimeout(() => {
            navigation.navigate(
              schedule ? "SchedulesContainer" : "Documents"
            );
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
  };

  return (
    <View className="bg-white h-full w-full pt-8">
      <Text className="text-2xl font-semibold text-center">Set Student's Schedule</Text>
      <View className="pt-12">
        <Center>
          <FormControl w="3/4" maxW="300">
            <FormControl.Label>Choose Student</FormControl.Label>
            <Select
              minWidth="200"
              accessibilityLabel="Choose Student"
              placeholder="Select User"
              onValueChange={(value) => setUser(value)}
              selectedValue={user}
              _selectedItem={{
                bg: "yellow.300",
                endIcon: <CheckIcon size={10} />,
              }}
              mt="1"
            >
             {userList.map((user) => (
                <Select.Item
                  key={user._id}
                  label={`${user.firstname} ${user.lastname} - Grade: ${user.grade}`}
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
          <Text className="font-semibold text-center text-xl pt-4">
            Select Schedule
          </Text>
          <TouchableOpacity className="pt-4">
            <View className="pl-4 flex flex-row space-x-4 items-center">
              <CalendarDaysIcon
                onPress={() => showDatePicker("start")}
                name="calendar-alt"
                size={45}
                color={COLORS.versatilegray}
              />
              <Text className="text-base font-normal">
                {DateTime ? new Date(DateTime).toLocaleString() : ""}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="flex items-center pt-12">
            <TouchableOpacity
              large
              primary
              onPress={() => addOrUpdateSchedule()}
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
  );

};

export default ScheduleForm;
