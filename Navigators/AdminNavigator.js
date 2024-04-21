import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Requests from "../Screens/Admin/Requests";
import Documents from "../Screens/Admin/Documents";
import Products from "../Screens/Admin/Products";
import Orders from "../Screens/Admin/Orders";
import DocumentForm from "../Screens/Admin/DocumentForm";
import ProductForm from "../Screens/Admin/ProductForm";
import Users from "../Screens/Admin/Users";
import ScheduleForm from "../Screens/Admin/ScheduleForm";
import OrderSchedule from "../Screens/Admin/OrderSchedule";
import UserUpdateStatus from "../Screens/Admin/UserUpdateStatus";
import Notification from "../Screens/Admin/Notification";
import CreateStudent from "../Screens/Admin/CreateStudent";
import EditProfile from "../Screens/Admin/EditProfile";
import AdminProfile from "../Screens/Admin/AdminProfile";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
    initialRouteName="AdminProfile"
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen
        name="Documents"
        component={Documents}
        options={{
          title: "Documents",
        }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Products"
        component={Products}
        options={{
          title: "Products",
        }}
      />

      <Stack.Screen
        name="Users"
        component={Users}
        options={{
          title: "Users",
        }}
      />
      <Stack.Screen
        name="UserUpdateStatus"
        component={UserUpdateStatus}
        options={{
          title: "User Update Status",
        }}
      />
    
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="DocumentForm" component={DocumentForm} />
      <Stack.Screen name="ProductForm" component={ProductForm} />
      <Stack.Screen name="ScheduleForm" component={ScheduleForm} />
      <Stack.Screen name="OrderSchedule" component={OrderSchedule} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="CreateStudent" component={CreateStudent} />
    </Stack.Navigator>
  );
}
export default function AdminNavigator() {
  return <MyStack />;
}
