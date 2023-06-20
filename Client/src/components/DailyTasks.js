import { View, ImageBackground, TextInput, Text, TouchableOpacity, StyleSheet, Modal, Alert, Pressable, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { useAuth } from "../context/auth";
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';

const DailyTasks = () => {
    const [text, setText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('DailyTasks');
    const [auth] = useAuth();
    const { userId, token } = auth;

    const { updateTasks } = useTasks();

    console.log(userId)
    console.log(token)
    const handleSave = async () => {
        try {
            if (!userId) {
                console.log('userId is null', userId);
                setModalVisible(false)
                ToastAndroid.show("User ID is missing", ToastAndroid.SHORT);
                return;
            } else {
                const headers = {
                    Authorization: token
                };
                const res = await clientApi.post('/api/v1/tasks/create',
                    { title, category, text, userId },
                    { headers }
                );
                setModalVisible(!modalVisible)
                if (res && res.data.success) {
                    const updatedRes = await clientApi.get(`/api/v1/tasks/user-tasks/${userId}`);
                    const updatedTasks = updatedRes.data;
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                    updateTasks(updatedTasks);
                } else {
                    ToastAndroid.show(res.data.message, ToastAndroid.SHORT);
                }
            }
            setModalVisible(false)
        } catch (error) {
            setModalVisible(!modalVisible)
            console.log(error);
            ToastAndroid.show("Something went wrong");
            setModalVisible(false)

        }
    }


    return (
        <View style={{
            flex: 1,
        }}>
            <ReactNativeZoomableView
                maxZoom={1.5}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                panBoundaryPadding={0}
                doubleTapZoomToCenter={1}
                // disablePanOnInitialZoom={1}
                style={{
                }}
            >
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <ImageBackground source={require('../../assets/table1.png')} style={{
                        width: '100%',
                        height: 800,
                        position: 'absolute',
                        top: -298,
                        left: -362,
                        // zIndex: -1,
                        // justifyContent: 'flex-start'

                    }}
                    // resizeMode="cover"
                    >
                        <View>

                            <TextInput
                                multiline
                                onChangeText={(text) => setText(text)}
                                value={text}
                                numberOfLines={25}
                                maxLength={400}
                                textAlignVertical='top'

                                style={{
                                    height: 500,
                                    width: '100%',
                                    fontSize: 20,
                                    overflow: 'hidden',
                                }}
                            />
                        </View>
                        <View style={styles.buttonview}>
                            <TouchableOpacity style={styles.Touchablebutton} onPress={() => setModalVisible(true)} >
                                <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>Save</Text>
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    Alert.alert('Modal has been closed.');
                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <TextInput
                                            placeholder='Title'
                                            style={styles.modalText}
                                            onChangeText={(title) => setTitle(title)}
                                            value={title}
                                        />
                                        <TouchableOpacity
                                            style={[styles.button, styles.buttonClose]}
                                            onPress={handleSave}>
                                            <Text style={styles.textStyle}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                    </ImageBackground>
                </View>
            </ReactNativeZoomableView>
        </View>
    )
}

export default gestureHandlerRootHOC(DailyTasks)

const styles = StyleSheet.create({
    buttonview: {
        // marginTop: '9%',
        marginLeft: '90%',
        marginRight: 10,
        // borderWidth: 2,
        backgroundColor: 'black',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    Touchablebutton: {
        height: 50,
        width: 60,
        justifyContent: 'center',
        borderWidth: 2
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'flex-end',
        marginTop: 22,
        // height: 300,
        // width: '30%'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})