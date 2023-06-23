import { View, Text, TextInput, ImageBackground, Button, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import React, { useState, useRef } from 'react'
import {
    DrawWithOptions,
    DrawProvider,
} from '@archireport/react-native-svg-draw';
import { LinearGradient } from 'expo-linear-gradient';

import * as MediaLibrary from 'expo-media-library';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { ToastAndroid, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';

const Notes = () => {
    const [notes, setNotes] = useState('')
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [isZoomed, setIsZoomed] = useState(false);
    // const [sound, setSound] = useState(null);
    // const [isPlaying, setIsPlaying] = useState(false);
    const handleZoom = (event) => {
        setIsZoomed(event.zoomLevel > 1);
    };

    const handleTouch = (event) => {
        if (!isZoomed) {
            event.preventDefault();
        }
    };

    const saveSnapshot = async (uri) => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
            await MediaLibrary.saveToLibraryAsync(uri); // Save the snapshot to the device's photo library on Android
            console.log('Snapshot saved successfully:', uri);
        } else {
            console.log('Permission to access media library not granted.');
        }
    };
    const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
    const [inputText, setInputText] = useState('');

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
    const handleSave = () => {
        // Handle the text save logic here
        console.log('Saved Text:', inputText);
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
    // const playPauseAudio = async () => {
    //     if (sound === null) return;

    //     if (isPlaying) {
    //         await sound.pauseAsync();
    //     } else {
    //         await sound.playAsync();
    //     }
    //     setIsPlaying(!isPlaying);
    // };
    return (
        // <View style={{
        //     flex: 1,
        // }}>
        // <Text> Hello world</Text>
        // <TouchableWithoutFeedback onPress={handleTouch}>
        <ReactNativeZoomableView
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
                justifyContent: 'center',
                alignItems: 'center'
            }} >
                <ImageBackground source={require('../../assets/not2.jpg')} style={{
                    width: '100%',
                    height: Dimensions.get('window').height / 1.2,
                    position: 'absolute',


                }}
                    resizeMode="cover" >
                    {/* <View style={{ flexDirection: 'row-reverse' }}> */}
                    {/* <View style={{ alignItems: 'flex-end' }}>
                                <View style={{ width: "100%", }}>
                                    <Button title="Attachment" onPress={pickImage} style={{ backgroundColor: 'black' }} />
                                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                                </View>
                            </View> */}

                    {/* <View>
                                {sound && (
                                    <Button
                                        title={isPlaying ? 'Pause' : 'Play'}
                                        onPress={playPauseAudio}
                                    />
                                )}
                            </View> */}
                    {/* </View> */}

                    {isTextInputEnabled ? (
                        <><DrawWithOptions
                            linearGradient={LinearGradient}

                            close={() => true}
                            takeSnapshot={(snap) => {
                                snap.then((uri) => {
                                    saveSnapshot(uri);
                                    ToastAndroid.show(uri, ToastAndroid.SHORT);
                                });
                            }}
                        />
                            <TextInput value={inputText}
                                onChangeText={setInputText}
                                // onBlur={handleSave}
                                autoFocus multiline style={styles.textcontainer} />
                        </>) : (<>
                            <Text style={styles.textcontainer}>{inputText} </Text>
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
                    {/* <View style={{ width: '100%', fontSize: 15, position: 'absolute', marginTop: 80, alignItems: 'flex-end' }}>
                            <Text>{message}</Text>
                            <Button
                                title={recording ? 'Stop Recording' : 'Start Recording'}
                                onPress={recording ? stopRecording : startRecording} />
                            {getRecordingLines()}

                        </View> */}
                    {/* <View style={{}}>
                            <View>
                                <Button title='Start Recording' />
                                <Button title='Attachment' />
                            </View>
                        </View> */}
                    <View
                        style={[
                            styles.btncontainer,
                            {
                                // Try setting flexDirection to "row".
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                height: ' 50%',
                            },
                        ]}>
                        <View style={{ alignSelf: 'flex-start' }} >
                            <Button title="Attachment" onPress={pickImage} style={{ backgroundColor: 'black' }} />
                            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                        </View>
                        <View style={{ alignSelf: 'flex-start' }}>
                            <Button
                                title={recording ? 'Stop Recording' : 'Start Recording'}
                                onPress={recording ? stopRecording : startRecording} />
                            {getRecordingLines()}
                        </View>
                    </View>
                    <Button
                        title={isTextInputEnabled ? 'Drawing' : 'Text'}
                        onPress={handleToggleInput}
                        style={{ marginBottom: 20 }}
                    />

                </ImageBackground>
            </View>
        </ReactNativeZoomableView>
        // </TouchableWithoutFeedback>
        // </View>
    )
}

export default Notes;

const styles = StyleSheet.create({
    btncontainer: {
        position: 'absolute',
        top: '7%',
        width: '100%',

    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        zIndex: 999999,
        paddingTop: 10
    },
    button: {
        zIndex: 9999999,
        width: '10%'
    },
    textcontainer: {
        height: '100%',
        width: '100%',
        fontSize: 15,
        position: 'absolute',
        marginTop: "13%"
    }
});