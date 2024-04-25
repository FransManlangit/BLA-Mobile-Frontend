import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import DocumentContainer from "../Screens/Document/DocumentContainer";


const Stack = createStackNavigator();
function MyStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DocumentContainer"
        component={DocumentContainer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function DocumentNavigator() {
  return <MyStack />;
}
