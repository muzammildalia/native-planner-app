import { View, ImageBackground, TextInput, Text, TouchableOpacity, StyleSheet, Modal, Alert, Pressable, ToastAndroid, Button } from 'react-native'

import React, { useEffect, useState } from 'react'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { useAuth } from '../context/auth';
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

const MasterTasks = ({ navigation, route }) => {
    // const [mastertext, setMasterText] = useState('');
    const Data = route.params;

    console.log('MData.DESC', Data.desc)

    const [text, setText] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState(Data.title ? Data.title : '');
    const [category, setCategory] = useState('MasterTasks');
    const [auth] = useAuth();
    const { userId, token } = auth;
    const { updateTasks } = useTasks();
    const [image, setImage] = useState(null);
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);



    // console.log("Mtext", id, desc, head)
    const handleSave = async () => {
        try {
            if (!userId) {
                console.log('userId is null', userId);
                ToastAndroid.show("User ID is missing", ToastAndroid.SHORT);
                return;
            } else {
                const headers = {
                    Authorization: token // Add the token to the Authorization header
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
    const startRecording = async () => {
        try {
            const recordingOptions = {
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
                    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
            };

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(recordingOptions);
            await recording.startAsync();
            setRecording(recording);
        } catch (error) {
            // Handle recording start error
            console.error('Failed to start recording', error);
        }
    };

    const stopRecording = async () => {
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);

            // Create a new folder for saving the recording
            const folderName = 'recordings';
            const folderUri = FileSystem.documentDirectory + folderName;
            await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });

            // Save the recording inside the new folder
            const fileInfo = await FileSystem.getInfoAsync(uri);
            const fileUri = fileInfo.uri;
            const newUri = folderUri + '/recordedAudio.m4a';
            await FileSystem.moveAsync({
                from: fileUri,
                to: newUri,
            });
            console.log(newUri)
            // Do something with the saved audio file URI (newUri)
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: newUri },
                { shouldPlay: false }
            );
            setSound(newSound);
        } catch (error) {
            // Handle recording stop error
            console.error('Failed to stop recording', error);
        }
    };
    const playPauseAudio = async () => {
        if (sound === null) return;

        if (isPlaying) {
            await sound.pauseAsync();
        } else {
            await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    useEffect(() => {
        if (route.params && route.params.desc) {
            setText(route.params.desc);
            setTitle(route.params.head)
        }
    }, [route.params]);
    return (
        <View style={{
            flex: 1,
        }}>
            <ReactNativeZoomableView
                maxZoom={1.5}
                minZoom={0.5}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                panBoundaryPadding={0}
                doubleTapZoomToCenter={1}
                style={{
                }}
            >
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }}>
                    <ImageBackground source={require('../../assets/table2.png')} style={{
                        width: '100%',
                        height: 800,
                        position: 'absolute',
                        top: -295,
                        left: -362,
                        right: 0
                    }}
                    >

                        <View>


                            <TextInput
                                // editable
                                // autoFocus
                                multiline
                                onChangeText={(newtext) => setText(newtext)}
                                value={text}
                                numberOfLines={25}
                                maxLength={400}
                                textAlignVertical='top'
                                // textAlign='left'

                                style={{
                                    height: 500,
                                    width: '100%',
                                    fontSize: 20,
                                    overflow: 'hidden',
                                    // justifyContent: 'center',
                                    // alignItems: 'flex-start'
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

export default MasterTasks

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