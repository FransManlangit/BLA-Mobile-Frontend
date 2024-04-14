import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native"; // Import Image component
import UserUpdate from "../Screens/User/UserUpdate";
import RequestDetails from "../Screens/User/RequestDetails";
import OrderDetails from "../Screens/User/OrderDetails";
import Login from "../Screens/User/Login";
import ForgotPassword from "../Screens/User/ForgotPassword";
import ResetPasswordConfirmation from "../Screens/User/ResetPasswordConfirmation";
import Start from "../Screens/User/Start";
import Starter from "../Screens/User/Start";
import Starts from "../Screens/User/Start";
import Register from "../Screens/User/Register";
import UserProfile from "../Screens/User/UserProfile";
import StudentOrder from "../Screens/User/StudentOrder";
import StudentRequest from "../Screens/User/StudentRequest";
import DateSchedule from "../Screens/User/DateSchedule";
import DateDetail from "../Screens/User/DateDetail";
import GuidanceNavigator from "./GuidanceNavigator";
import AdminProfile from "../Screens/Admin/AdminProfile";
import CashierNavigator from "./CashierNavigator";
import UploadClearance from "../Screens/User/UploadClearance";
import Authorization from "../Screens/Admin/Authorization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import AuthGlobal from "../Context/Store/AuthGlobal";

const Stack = createStackNavigator();

const UserNavigator = (props) => {
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

  const Cashier =
    stateUser.isAuthenticated && stateUser.user.role === "cashier";

  const Guidance =
    stateUser.isAuthenticated && stateUser.user.role === "guidance";

  const Admin = stateUser.isAuthenticated && stateUser.user.role === "admin";

  return (
    <Stack.Navigator
      initialRouteName="Start"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
      }}
    >
      <Stack.Screen
        name="User Profile"
        component={UserProfile}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Start"
        component={Start}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Order Details"
        component={OrderDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="StudentOrder"
        component={StudentOrder}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="StudentRequest"
        component={StudentRequest}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RequestDetails"
        component={RequestDetails}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Authorization"
        component={Authorization}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="DateSchedule"
        component={DateSchedule}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UploadClearance"
        component={UploadClearance}
        options={{
          headerShown: false,
        }}
      />

      {Guidance && (
        <Stack.Screen
          name="GuidanceNavigator"
          component={GuidanceNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}

      <Stack.Screen
        name="Starts"
        component={Starts}
        options={{
          headerShown: false,
        }}
      />
      {Admin && (
        <Stack.Screen
          name="AdminProfile"
          component={AdminProfile}
          options={{
            headerShown: false,
          }}
        />
      )}

      <Stack.Screen
        name="Starter"
        component={Starter}
        options={{
          headerShown: false,
        }}
      />
      {Cashier && (
        <Stack.Screen
          name="CashierNavigator"
          component={CashierNavigator}
          options={{
            headerShown: false,
          }}
        />
      )}

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResetPass"
        component={ResetPasswordConfirmation}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UserUpdate"
        component={UserUpdate}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DateDetail"
        component={DateDetail}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default UserNavigator;
