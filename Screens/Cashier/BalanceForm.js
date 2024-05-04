import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import baseURL from "../../assets/common/baseUrl";
import {
  Spacer,
  Center,
  FormControl,
  CheckIcon,
  Select,
  WarningOutlineIcon,
} from "native-base";
import { COLORS, SIZES } from "../../assets/constants";
import { SafeAreaView } from "react-native-safe-area-context";

const BalanceForm = (props) => {
  const [userList, setUserList] = useState();
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(null);
  const [specificBalance, setSpecificBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const context = useContext(AuthGlobal);

  let navigation = useNavigation();

  const onUserChange = (value) => {
    setUser(value);
  };

  useEffect(() => {
    if (props.route.params && props.route.params.balance) {
      setSpecificBalance(props.route.params.balance.specificBalances);
      setAmount(props.route.params.balance.amount);
      setBalance(props.route.params.balance.Balance);
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

  const addOrUpdateBalance = () => {
    // Consolidate error handling
    if (specificBalance === "" || amount === "") {
      setError("Please fill in the form correctly");
      return;
    }

    // Create FormData for file uploads
    let formData = new FormData();
    formData.append("specficicBalance", specificBalance);
    formData.append("amount", amount);

    // Prepare data object for violation
    const Balance = {
      createdAt: Date.now(),
      user,
      specificBalance,
      amount,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (balance !== null) {
      axios
        .put(`${baseURL}balances/${balance.id}`, Balance, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Balance successfully updated",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("BalanceContainer");
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
        .post(`${baseURL}balances`, Balance, formData, config)
        .then((res) => {
          if (res.status === 200 || res.status === 201) {
            Toast.show({
              topOffset: 60,
              type: "success",
              text1: "Balance Added",
              text2: "",
            });
            setTimeout(() => {
              navigation.navigate("CashierProfile");
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
      <View className="flex bg-white h-full w-full p-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-[#FAE500] p-2 rounded-tr-2xl rounded-bl-2xl ml-4 w-12"
        >
          <ArrowLeftIcon size="20" color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-center pt-16">
          Set Student's Balance
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
            </FormControl>
            <View className="pt-4 pb-4">
              <Text>Specific Balance</Text>
              <View className="items-baseline bg-black/5 p-5 rounded-2xl w-72 h-14">
                <TextInput
                  name="specificBalance"
                  id="specificBalance"
                  value={specificBalance}
                  onChangeText={(text) => setSpecificBalance(text)}
                />
              </View>
              <Text>Amount</Text>
              <View className="items-baseline bg-black/5 p-5 rounded-2xl w-72 h-14">
                <TextInput
                  name="amount"
                  id="amount"
                  value={amount}
                  onChangeText={(text) => setAmount(text)}
                />
              </View>
            </View>

            <View className="flex items-center pt-12">
              <TouchableOpacity
                large
                primary
                onPress={() => addOrUpdateBalance()}
                className="bg-[#FAE500] p-4 w-40 rounded-lg mb-3"
              >
                <Text className="text-lg font-bold text-black text-center">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </Center>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BalanceForm;
