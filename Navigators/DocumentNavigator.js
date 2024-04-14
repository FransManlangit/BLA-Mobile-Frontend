import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentContainer from "../Screens/Document/DocumentContainer";
// import SingleDocument from "../Screens/Document/SingleDocument";
// import Cart from "../Screens/Cart/Cart";

const Stack = createStackNavigator();
function MyStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DocumentContainer"
        component={DocumentContainer}
        options={{ headerShown: false }}
      />

      {/* <Stack.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
        }}
      /> */}

      {/* <Stack.Screen
        name="Document Detail"
        component={SingleDocument}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
}

export default function DocumentNavigator() {
  return <MyStack />;
}
