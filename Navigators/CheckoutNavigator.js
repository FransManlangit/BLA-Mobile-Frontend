import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Screens
import Request from '../Screens/Cart/Checkout/Checkout';
import Payment from '../Screens/Cart/Checkout/Payment';
import Confirm from '../Screens/Cart/Checkout/Confirm';
import Authorization from '../Screens/Cart/Checkout/Authorization';


const Tab = createMaterialTopTabNavigator();

function MyTabs() {
    return(
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: '#000', 
                inactiveTintColor: '#777', 
                labelStyle: { fontWeight: 'bold' }, 
                indicatorStyle: { backgroundColor: '#000' }, 
                style: { backgroundColor: '#fff' }, 
                tabStyle: { justifyContent: 'center' }, 
                scrollEnabled: true, 
            }}
        >
            <Tab.Screen name="Request Details" component={Request} />
            <Tab.Screen name="Payment" component={Payment} />
        
            <Tab.Screen name="Authorization" component={Authorization} />
            <Tab.Screen name="Confirm" component={Confirm} />
        </Tab.Navigator>
    );
}

export default function CheckoutNavigator() {
    return <MyTabs />;
}
