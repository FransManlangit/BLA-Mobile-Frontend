import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Notification from "../Screens/Admin/Notification";
import CashierNotification from "../Screens/Cashier/Notification";
import GuidanceNotification from "../Screens/Guidance/Notification"

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="Notification" component={Notification} />
    <Stack.Screen name="CashierNotification" component={CashierNotification} />
    <Stack.Screen name="GuidanceNotification" component={GuidanceNotification} />
    </Stack.Navigator>
  );
}

export default function NotificationNavigator() {
  return <MyStack />;
}
