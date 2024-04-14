import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// Screens

import Payment from "../Screens/ProductCart/Checkout/Payment";
import Confirm from "../Screens/ProductCart/Checkout/Confirm";

// import Checkout from '../Screens/ProductCart/Checkout/ProductCheckout'

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Student Details" component={Checkout} /> */}
      <Tab.Screen name="Payment" component={Payment} />
      <Tab.Screen name="Confirm" component={Confirm} />
    </Tab.Navigator>
  );
}

export default function ProductCheckoutNavigator() {
  return <MyTabs />;
}
