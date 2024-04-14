import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProductCart from "../Screens/ProductCart/ProductCart";
import ProductCheckoutNavigator from "./ProductCheckoutNavigator";
// import SingleProduct from "../Screens/Product/SingleProduct";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductCart"
        component={ProductCart}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Payment"
        component={ProductCheckoutNavigator}
        options={{
          title: "Payment",
        }}
      />
        {/* <Stack.Screen
        name="Product Detail"
        component={SingleProduct}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}

export default function ProductCartNavigator() {
  return <MyStack />;
}
