import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditProfile from "../Screens/Guidance/EditProfile";
import GuidanceProfile from "../Screens/Guidance/UserProfile";
import ViolationForm from "../Screens/Guidance/ViolationForm";
import Students from "../Screens/Guidance/Students";
import Requests from "../Screens/Guidance/Requests";
import Clearance from "../Screens/Guidance/Clearance";
import SingleClearance from "../Screens/Guidance/SingleClearance";
import Login from "../Screens/User/Login";
import UpdateViolationStatus from "../Screens/Guidance/UpdateViolationStatus";
import ViolationLogs from "../Screens/Guidance/ViolationLogs";
import ChangePassword from "../Screens/Guidance/ChangePassword";

const Stack = createStackNavigator();

const GuidanceNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="GuidanceProfile"
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
        options={{ headerShown: false }}
        component={Requests}
      ></Stack.Screen>

      <Stack.Screen
        name="GuidanceProfile"
        component={GuidanceProfile}
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
        name="Violation"
        component={ViolationForm}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Clearance"
        component={Clearance}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="UpdateViolationStatus"
        component={UpdateViolationStatus}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ViolationLogs"
        component={ViolationLogs}
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
      />
      <Stack.Screen name="SingleClearance" component={SingleClearance} />
    </Stack.Navigator>
  );
};

export default GuidanceNavigator;
