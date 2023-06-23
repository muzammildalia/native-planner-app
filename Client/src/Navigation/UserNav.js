import { View, Text } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Hindex from '../../src/screens/index'
import CalenderScreen from '../screens/CalenderScreen';
import Logout from '../components/Logout'
import Setting from '../screens/Setting'

const Drawer = createDrawerNavigator();

const UserNav = () => {

    return (
        <Drawer.Navigator
            initialRouteName="Home"
            useLegacyImplementation
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#B9D5FF'
                },
                drawerStyle: {
                    backgroundColor: '#B9D5FF',
                    width: 240,
                },
            }}
        >
            <Drawer.Screen name="Home" component={Hindex} />
            <Drawer.Screen name="Calender" component={CalenderScreen} />
            <Drawer.Screen name="Logout" component={Logout} />
            <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
    )
}

export default UserNav