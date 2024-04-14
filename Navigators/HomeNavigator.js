import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SingleDocument from "../Screens/Document/SingleDocument";
import DocumentContainer from "../Screens/Document/DocumentContainer";
import ProductContainer from "../Screens/Product/ProductContainer";
import SingleProduct from "../Screens/Product/SingleProduct";

const Stack = createStackNavigator();
function MyStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={DocumentContainer}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Document Detail"
        component={SingleDocument}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Product Detail"
        component={SingleProduct}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Product"
        component={ProductContainer}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function HomeNavigator() {
  return <MyStack />;
}
