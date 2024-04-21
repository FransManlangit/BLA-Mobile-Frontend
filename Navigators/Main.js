import React, { useContext, useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import AuthGlobal from "../Context/Store/AuthGlobal";
import UserNavigator from "./UserNavigator";
import HomeNavigator from "./HomeNavigator";
import CartNavigator from "./CartNavigator";
import AdminNavigator from "./AdminNavigator";
import NotificationNavigator from "./NotificationNavigator";
import GuidanceNavigator from "./GuidanceNavigator";
import CashierNavigator from "./CashierNavigator";
import ProductContainer from "../Screens/Product/ProductContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../assets/common/baseUrl";
import { Image } from "react-native";
import ProductNavigator from "./ProductNavigator";
import {
  UserCircleIcon,
  ShoppingCartIcon,
  DocumentPlusIcon,
  HomeIcon,
  Cog8ToothIcon,
  ShoppingBagIcon,
  BellIcon,
} from "react-native-heroicons/solid";
import ProductIcon from "../Shared/ProductIcon";
import CartIcon from "../Shared/CartIcon";
import NotificationIcon from "../Shared/NotificationIcon";

const Tab = createBottomTabNavigator();

const Main = () => {
  const { stateUser } = useContext(AuthGlobal);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        if (token && stateUser.isAuthenticated) {
          const response = await axios.get(
            `${baseURL}users/${stateUser.user.userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [stateUser.isAuthenticated, stateUser.user.userId]);

  const renderUserIcon = () => {
    if (userProfile && userProfile.image) {
      return (
        <Image
          source={{ uri: userProfile.image }}
          style={{ width: 30, height: 30, borderRadius: 15 }}
        />
      );
    } else {
      return (
        <Icon
          name="user"
          style={{ position: "relative" }}
          color="#e91e63"
          size={30}
        />
      );
    }
  };

  const Admin = stateUser.isAuthenticated && stateUser.user.role === "admin";

  const Notification =
    stateUser.isAuthenticated &&
    (stateUser.user.role === "admin" ||
      stateUser.user.role === "guidance" ||
      stateUser.user.role === "cashier");

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#EBDE70",
      }}
    >
      <Tab.Screen
        name="Product"
        component={ProductContainer}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return (
              <ShoppingBagIcon
                name="shopping-cart"
                style={{ position: "relative" }}
                color={color}
                size={35}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Order"
        component={ProductNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <>
                <ShoppingCartIcon
                  style={{ position: "absolute" }}
                  color={color}
                  size={30}
                />
                <ProductIcon />
              </>
            );
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => {
            return (
              <HomeIcon
                name="home"
                style={{ position: "relative" }}
                color={color}
                size={35}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => {
            return (
              <>
                <DocumentPlusIcon
                  style={{ position: "absolute" }}
                  color={color}
                  size={30}
                />
                <CartIcon />
              </>
            );
          },
        }}
      />

      {Notification && (
        <Tab.Screen
          name="NotificationScreen"
          component={NotificationNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <>
                <BellIcon
                  style={{ position: "absolute" }}
                  color={color}
                  size={30}
                />
                <NotificationIcon />
              </>
            ),
          }}
        />
      )}
     {stateUser.user.role === "guidance" ? 
    (  <Tab.Screen
      name="Guidance"
      component={GuidanceNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => {
          return (
            <UserCircleIcon
              name="users"
              style={{ position: "relative" }}
              color={color}
              size={40}
            />
          );
        },
      }}
    />) : stateUser.user.role === "cashier" ? (<Tab.Screen
      name="Cashier"
      component={CashierNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => {
          return (
            <UserCircleIcon
              name="users"
              style={{ position: "relative" }}
              color={color}
              size={40}
            />
          );
        },
      }}
    />) : (<Tab.Screen
      name="User"
      component={UserNavigator}
      options={{
        headerShown: false,
        tabBarIcon: ({ color }) => {
          return (
            <UserCircleIcon
              name="users"
              style={{ position: "relative" }}
              color={color}
              size={40}
            />
          );
        },
      }}
    />)
    }
      {Admin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Cog8ToothIcon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={35}
              />
            ),
            headerStyle: {
              height: 30, // Adjust the height of the header as needed
            },
            headerTitleStyle: {
              fontSize: 25, // Adjust the font size of the header title as needed
              marginTop: -40,
            },
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Main;
