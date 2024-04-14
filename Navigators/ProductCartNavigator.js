import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProductCart from '../Screens/ProductCart/ProductCart';
import ProductCheckoutNavigator from './ProductCheckoutNavigator';


const Stack = createStackNavigator();


function MyStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="ProductCart"
                component={ProductCart}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen 
                name="Checkout"
                component={ProductCheckoutNavigator}
                options={{
                    title: 'Order'
                }}
            />
        </Stack.Navigator>
    )
}

export default function CartNavigator() {
    return <MyStack />
}