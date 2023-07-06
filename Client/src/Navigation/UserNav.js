import { View, Text } from 'react-native'
import React from 'react'
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
} from '@react-navigation/drawer';
import Hindex from '../../src/screens/index'
import CalenderScreen from '../screens/CalenderScreen';
import Logout from '../components/Logout'
import Setting from '../screens/Setting'
import { useAuth } from '../context/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const UserNav = () => {
    const [auth, setAuth] = useAuth();
    const navigation = useNavigation();
    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('auth');
            setAuth({
                ...auth,
                user: null,
                userId: "",
                token: ''

            });

            console.log("logout screen", auth)
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };
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

            drawerContent={props => {
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <DrawerItem label="Logout" onPress={handleLogout} />
                    </DrawerContentScrollView>
                )
            }}
        >
            <Drawer.Screen name="Home" component={Hindex} />
            <Drawer.Screen name="Calender" component={CalenderScreen} />
            {/* <Drawer.Screen name="Logout" component={Logout} /> */}
            <Drawer.Screen name="Settings" component={Setting} />
        </Drawer.Navigator>
    )
}

export default UserNav;