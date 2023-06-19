import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { ToastAndroid } from 'react-native';
import { useAuth } from '../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = async () => {
    const [auth, setAuth] = useAuth();
    const navigation = useNavigation();
    console.log('auth:', auth); // Check the structure of the auth object
    await AsyncStorage.removeItem('auth');
    ToastAndroid.show('Logout successfully', ToastAndroid.SHORT);
    setAuth({
        ...auth,
        user: null,
        token: '',
    });


    return navigation.navigate('Login');

};


export default Logout

const styles = StyleSheet.create({})