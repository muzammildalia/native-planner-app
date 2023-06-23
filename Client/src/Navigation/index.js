import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';


const MainNavigation = () => {
    return (
        < NavigationContainer >
            <AuthNavigation />
        </NavigationContainer >
    )
}

export default MainNavigation