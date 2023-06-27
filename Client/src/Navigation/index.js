import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import { useAuth } from '../context/auth';
import UserNav from './UserNav';

const MainNavigation = () => {

    const [auth, setAuth] = useAuth();

    return (
        < NavigationContainer >
            {!auth.user ? (
                <AuthNavigation />
            )
                : (
                    <UserNav />
                )}

        </NavigationContainer >
    )
}

export default MainNavigation