import { View, ImageBackground, TextInput, Text, TouchableOpacity, PanResponder, Animated, StyleSheet, Modal, Alert, Pressable, ToastAndroid, Button, Dimensions, Image, Platform } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { useAuth } from "../context/auth";
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import {
    DrawWithOptions,
    DrawProvider,
} from '@archireport/react-native-svg-draw';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const Notes = ({ route }) => {
    const Data = route.params;
    // console.log("dATA.DESC", Data.desc)
    const [text, setText] = useState('');

    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');

    const [category, setCategory] = useState('Notes');
    const [auth] = useAuth();
    const { userId, token } = auth;
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");
    const pan = useRef(new Animated.ValueXY()).current;
    const [image, setImage] = useState(null);
    const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);



    const { updateTasks } = useTasks();
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
    const saveSnapshot = async (uri) => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
            await MediaLibrary.saveToLibraryAsync(uri); // Save the snapshot to the device's photo library on Android
            console.log('Snapshot saved successfully:', uri);
        } else {
            console.log('Permission to access media library not granted.');
        }
    };


    const handleToggleInput = () => {
        setIsTextInputEnabled((prevIsTextInputEnabled) => !prevIsTextInputEnabled);
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
    const removeImage = () => {
        setImage(null);
    };

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();

            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRecording(recording);
            } else {
                setMessage("Please grant permission to app to access microphone");
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }
    async function stopRecording() {
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(updatedRecordings);
    }

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }
    function RecordingLine({ recordingLine, index }) {
        const [isPlaying, setIsPlaying] = useState(false);
        const sound = recordingLine.sound;

        const handlePlaybackToggle = async () => {
            if (isPlaying) {
                // Pause the playback
                await sound.pauseAsync();
            } else {
                // Start or resume the playback
                await sound.playAsync();
            }
            setIsPlaying(!isPlaying);
        };

        return (
            <View style={styles.row}>
                <Text>Recording {index + 1} - {recordingLine.duration}</Text>
                <Button style={styles.button} onPress={handlePlaybackToggle} title={isPlaying ? 'Pause' : 'Play'}></Button>
                <Button style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)} title="Share"></Button>
            </View>
        );
    }
    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return <RecordingLine key={index} recordingLine={recordingLine} index={index} />;
        });
    }
    useEffect(() => {
        if (route.params && route.params.desc) {
            setText(route.params.desc);
            setTitle(route.params.head)
        }
    }, [route.params]);
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
            null,
            { dx: pan.x, dy: pan.y }
        ], { useNativeDriver: false }),
        onPanResponderRelease: () => {
            pan.flattenOffset(); // This will set the offset to the current value and reset value to zero
        },
        onPanResponderGrant: () => {
            pan.setOffset({
                x: pan.x._value,
                y: pan.y._value
            }); // This will set the offset to the current value when the pan starts
        }
    });
    return (
        <View style={{
            flex: 1,
        }}>
            <ReactNativeZoomableView
                disablePanOnInitialZoom={true}
                scrollEnabled={false}
                maxZoom={2}
                minZoom={1}
                zoomStep={0.5}
                initialZoom={1}
                bindToBorders={true}
                onZoomAfter={this.logOutZoomState}
                panEnabled={false}
                panBoundaryPadding={0}
                doubleTapZoomToCenter={true}
                style={{
                }}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }} >
                    <ImageBackground source={require('../../assets/not2.jpg')} style={{
                        width: '100%',
                        height: Dimensions.get('window').height / 1.21,
                        position: 'absolute',
                    }}
                        resizeMode="cover" >

                        {isTextInputEnabled ? (
                            <>
                                <TextInput
                                    value={text}
                                    onChangeText={(newtext) => setText(newtext)}
                                    autoFocus
                                    multiline
                                    editable
                                    style={styles.textcontainer} />
                            </>) : (<>
                                <Text style={styles.textcontainer}>{text} </Text>
                                <DrawWithOptions
                                    linearGradient={LinearGradient}
                                    close={() => true}
                                    takeSnapshot={(snap) => {
                                        snap.then((uri) => {
                                            saveSnapshot(uri);
                                            ToastAndroid.show(uri, ToastAndroid.SHORT);
                                        });
                                    }}
                                /></>)}
                        <Animated.View {...panResponder.panHandlers} style={[pan.getLayout(), styles.btncontainer, { width: 200, height: 200 }]}>
                            <View style={{ flexDirection: 'column' }} >
                                {image && (
                                    <>
                                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                                        <TouchableOpacity onPress={removeImage} style={styles.removebtn}>
                                            <FontAwesome name="remove" size={30} color="#B9D5FF" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>

                        </Animated.View>
                        <View
                            style={[
                                styles.btncontainer,
                                {

                                    marginLeft: "70%"
                                },
                            ]}
                        >

                            <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
                                {getRecordingLines()}
                            </View>
                        </View>
                        <View>
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
            <View style={{ alignItems: 'center' }}>
                <View style={styles.buttonview}>
                    <TouchableOpacity onPress={pickImage} style={styles.Touchablebutton} >
                        {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>Attachment</Text> */}
                        <MaterialIcons name="attachment" size={24} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Touchablebutton} onPress={handleToggleInput}>
                        {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>{isTextInputEnabled ? 'Drawing' : 'Text'}</Text> */}
                        {isTextInputEnabled ? <FontAwesome5 name="pen" size={24} color="#B9D5FF" /> : <MaterialIcons name="text-fields" size={24} color="#B9D5FF" />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Touchablebutton} onPress={() => setModalVisible(true)} >
                        {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>Save</Text> */}
                        <FontAwesome name="save" size={24} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Touchablebutton} onPress={recording ? stopRecording : startRecording}>
                        {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text> */}
                        {recording ? <FontAwesome5 name="stop" size={24} color="#B9D5FF" /> : <MaterialIcons name="multitrack-audio" size={24} color="#B9D5FF" />}

                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Notes

const styles = StyleSheet.create({
    buttonview: {
        flexDirection: 'row',
        // marginLeft: '90%',
        // marginRight: 10,
        // backgroundColor: 'black',
        // alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: '1%',
        backgroundColor: 'black',
        borderRadius: 10,
        width: Dimensions.get('window').width / 3,
    },
    Touchablebutton: {
        // backgroundColor: 'grey',
        width: Dimensions.get('window').width / 10,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        height: 30
    },
    removebtn: {

        width: Dimensions.get('window').width / 10,
        alignSelf: "flex-start",
        borderRadius: 10,
        height: 30
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
    btncontainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginTop: '10%'
        // top: '7%',
        // width: '100%',

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 999999,
        paddingTop: 10
    },
    buttonnote: {
        zIndex: 9999999,
        width: '10%',
    },
    textcontainer: {
        height: '100%',
        width: '100%',
        fontSize: 15,
        position: 'absolute',
        marginTop: "0%"
    }
})