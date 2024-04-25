import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Screens
import Request from "../Screens/Cart/Checkout/Checkout";
import Payment from "../Screens/Cart/Checkout/Payment";
import Confirm from "../Screens/Cart/Checkout/Confirm";
import Authorization from "../Screens/Cart/Checkout/Authorization";

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#777",
        labelStyle: { fontWeight: "bold" },
        indicatorStyle: { backgroundColor: "#000" },
        style: { backgroundColor: "#fff" },
        tabStyle: { justifyContent: "center" },
        scrollEnabled: true,
      }}
    >
      <Tab.Screen
        name="Request Details"
        component={Request}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Authorization"
        component={Authorization}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Confirm"
        component={Confirm}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function CheckoutNavigator() {
  return <MyTabs />;
}
