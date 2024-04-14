import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Auth from "./Context/Store/Auth";
import Main from "./Navigators/Main";
import Toast from "react-native-toast-message";
import store from "./Redux/store";
import Header from "./Shared/Header";
import { Provider } from "react-redux";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";

const newColorTheme = {
  brand: {
    900: "#8287af",
    800: "#7c83db",
    700: "#b3bef6",
  },
};
const theme = extendTheme({ colors: newColorTheme });

const Stack = createNativeStackNavigator();

function App() {
  return (
 
    <Auth>
      <Provider store={store}>
        <NativeBaseProvider theme={theme}>
          <NavigationContainer>
            <Main />
            <Toast />
          </NavigationContainer>
        </NativeBaseProvider>
      </Provider>
    </Auth>
   
  );
}

export default App;
