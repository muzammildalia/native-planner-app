import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';


import clientApi from '../api/clientApi';


const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const onPressRegister = async () => {

        try {
            const res = await clientApi.post('/api/v1/auth/register',
                { name, email, password }
            )
            // const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            // const user = userCredentials.user;
            // console.log('user data', user);

            navigation.navigate('Login');
        } catch (error) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log("Error Code => ", errorCode);
            // console.log("Error Message => ", errorMessage);
            // alert(error.message);
        }
    };

    const onPressForgotPassword = () => {
        // Do something about forgot password operation
    };
    const onPressLogin = () => {
        navigation.navigate('Login');
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Register </Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Name"
                    placeholderTextColor="#003f5c"
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            {/* <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder="UserName"
                    placeholderTextColor="#003f5c"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
            </View> */}
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
                onPress={onPressRegister}
                style={styles.registerBtn}>
                <Text style={styles.loginText}>REGISTER </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onPressLogin}
            >
                <Text style={styles.forgot}>Already have an account?</Text>
            </TouchableOpacity>
            <Text style={styles.loginfb}> OR </Text>
            <Text style={styles.loginfb}> Login from  </Text>
            {/* <Text style={styles.loginfb}> Facebook  </Text> */}
            <View style={{
                marginTop: 30
            }}>
                <TouchableOpacity>
                    <FontAwesome5 name="facebook" size={40} color="#1E4FAD" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Register

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
    registerBtn: {
        width: "30%",
        backgroundColor: "#B9D5FF",
        borderRadius: 10,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10
    },
    singupandforgotcont: {
        flexDirection: 'row',

    },
    forgot: {
        fontSize: 18,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '13%'
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