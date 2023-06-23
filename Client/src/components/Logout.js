import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { useAuth } from '../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
    const [auth, setAuth] = useAuth();
    const navigation = useNavigation();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await AsyncStorage.removeItem('auth');
                setAuth({
                    ...auth,
                    user: null,
                    token: '',
                });
                navigation.navigate('Login');
            } catch (error) {
                console.log('Error during logout:', error);
            }
        };

        handleLogout();
    }, []);
    return null;

};


export default Logout

const styles = StyleSheet.create({})