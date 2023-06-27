import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import clientApi from '../api/clientApi';
import { ToastAndroid } from 'react-native';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [auth, setAuth] = useAuth();

    const onPressResetPassword = async () => {
        // try {
        //     const res = await clientApi.post('/api/v1/auth/login',
        //         { email, password }
        //     )
        //     if (res && res.data.success) {
        //         ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        //         const { user, token } = res.data;
        //         setAuth({
        //             ...auth,
        //             user,
        //             token,
        //         });
        //         await AsyncStorage.setItem("auth", JSON.stringify(res.data));
        //         navigation.navigate("Root");
        //     } else {
        //         ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
        //     }
        // } catch (error) {
        //     console.log(error);
        //     ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
        // }


    }


    return (
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.title}> Reset Password </Text>
            {/* <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View> */}
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    secureTextEntry
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity
                onPress={onPressResetPassword}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN </Text>
            </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

export default ForgotPassword;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        marginBottom: 40,
    },
    inputView: {
        width: "30%",
        // backgroundColor: "#3AB4BA",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
        borderRadius: 10,
        borderWidth: 1
    },
    inputText: {
        height: 50
    },
    loginBtn: {
        width: "30%",
        backgroundColor: "#B9D5FF",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    singupandforgotcont: {
        flexDirection: 'row',

    },
    signup: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '15%'
    },
    forgot: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '3%'
    },
    loginfb: {
        fontSize: 25
    },
    fblog: {
        width: "30%",
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,

    }
})