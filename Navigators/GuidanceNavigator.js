import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import EditProfile from "../Screens/Guidance/EditProfile";
import GuidanceProfile from "../Screens/Guidance/UserProfile";
import ViolationForm from "../Screens/Guidance/ViolationForm";
import Students from "../Screens/Guidance/Students";
import Requests from "../Screens/Guidance/Requests";
import Clearance from "../Screens/Guidance/Clearance";
import SingleClearance from "../Screens/Guidance/SingleClearance";

const Stack = createStackNavigator();

const GuidanceNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Guidance Profile"
      screenOptions={{
        headerShown: false,
      }}
    >
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
        name="Guidance Profile"
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
      <Stack.Screen name="SingleClearance" component={SingleClearance} />
    </Stack.Navigator>
  );
};

export default GuidanceNavigator;
