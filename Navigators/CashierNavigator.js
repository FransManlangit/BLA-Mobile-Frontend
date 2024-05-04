import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CashierProfile from "../Screens/Cashier/UserProfile";
import BalanceForm from "../Screens/Cashier/BalanceForm";
import Students from "../Screens/Cashier/Students";
import Requests from "../Screens/Cashier/StudentRequests";
import EditProfile from "../Screens/Cashier/EditProfile";
import ChangePassword from "../Screens/Cashier/ChangePassword";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import AuthGlobal from "../Context/Store/AuthGlobal";
import React, { useContext, useState, useEffect } from "react";
import Login from "../Screens/User/Login";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CashierNavigator = (props) => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.isAuthenticated) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [stateUser.isAuthenticated, stateUser.user.userId]);
  return (
    <Stack.Navigator
      initialRouteName="CashierProfile"
      screenOptions={{
        headerShown: false,
      }}
    >

     <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Students"
        component={Students}
        options={{
          title: "StudentsList",
        }}
      />

      <Stack.Screen
        name="Requests"
        component={Requests}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
        initialParams={{ userProfile: userProfile }} // Pass userProfile as initialParams
      />

      <Stack.Screen
        name="CashierProfile"
        component={CashierProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UserUpdate"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Balance"
        component={BalanceForm}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CashierNavigator;
