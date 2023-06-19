import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '../context/auth'

const Setting = () => {
    const [auth, setAuth] = useAuth();
    // const userId = auth;
    console.log(auth.user);


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> {auth.user && auth.user.name}</Text>
            <Text> {auth.user._id}</Text>
            <Text> {auth.token}</Text>
            <Text>Setting</Text>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({})