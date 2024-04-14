import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CashierProfile from "../Screens/Cashier/UserProfile";
import BalanceForm from "../Screens/Cashier/BalanceForm";
import Students from "../Screens/Cashier/Students";
import Requests from "../Screens/Cashier/StudentRequests";
import EditProfile from "../Screens/Cashier/EditProfile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CashierNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName="Cashier Profile"
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
        component={Requests}
        options={{
          headerShown: false,
        }}
      />


      <Stack.Screen
        name="Cashier Profile"
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
