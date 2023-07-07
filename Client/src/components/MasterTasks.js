import { View, ImageBackground, TextInput, Text, TouchableOpacity, PanResponder, Animated, StyleSheet, Modal, Alert, ToastAndroid, Button, Dimensions, Image } from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
import { useAuth } from "../context/auth";
import clientApi from '../api/clientApi';
import { useTasks } from '../context/Task';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { PinchGestureHandler, State, ScrollView, PanGestureHandler } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const MasterTasks = ({ route }) => {
    const [currentPath, setCurrentPath] = useState([]);
    const [paths, setPaths] = useState([]);
    const [zoomScale, setZoomScale] = useState(1);
    const [text, setText] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('MasterTasks');
    const [auth] = useAuth();
    const { userId, token } = auth;
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");
    const [isTextInputEnabled, setIsTextInputEnabled] = useState(false);
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 200, height: 200 });
    const movePan = useRef(new Animated.ValueXY()).current;
    const resizePan = useRef(new Animated.ValueXY()).current;
    const { updateTasks } = useTasks();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const { height, width } = Dimensions.get('window');

    const handleSave = async () => {
        try {
            if (!userId) {
                console.log('userId is null', userId);
                setModalVisible(false)
                alert("User ID is missing");
                console.log(auth)
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
    function RecordingLine({ recordingLine, index, onRemove }) {
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

        // Add this useEffect hook to reset the playback when it reaches the end
        useEffect(() => {
            const updatePlaybackStatus = async (status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    await sound.setPositionAsync(0);
                }
            };

            const subscription = sound.setOnPlaybackStatusUpdate(updatePlaybackStatus);

            return () => {
                if (subscription) {
                    subscription.remove();
                }
            };
        }, [sound]);
        const handleRemove = () => {
            onRemove(index);
        };
        return (
            <View style={styles.row}>
                <Text style={{ fontWeight: 'bold' }}>Recording {index + 1} - {recordingLine.duration}</Text>
                <TouchableOpacity style={styles.button} onPress={handlePlaybackToggle} >{isPlaying ? <AntDesign name="pausecircle" size={30} color="black" /> : <AntDesign name="play" size={30} color="black" />}</TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => Sharing.shareAsync(recordingLine.file)}><Entypo name="share" size={30} color="black" /></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleRemove} ><MaterialIcons name="remove-circle" size={30} color="black" /></TouchableOpacity>
            </View>
        );
    }
    function getRecordingLines() {
        const handleRemoveRecording = (index) => {
            const updatedRecordings = [...recordings];
            updatedRecordings.splice(index, 1);
            setRecordings(updatedRecordings);
        };
        return recordings.map((recordingLine, index) => {
            return <RecordingLine
                key={index}
                recordingLine={recordingLine}
                index={index}
                sound={recordingLine.sound}
                onRemove={handleRemoveRecording}
            />;
        });
    }
    useEffect(() => {
        if (route.params && route.params.desc) {
            setText(route.params.desc);
            setTitle(route.params.head)
        }
    }, [route.params]);
    const movepanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event([
            null,
            { dx: movePan.x, dy: movePan.y }
        ], { useNativeDriver: false }),
        onPanResponderRelease: () => {
            movePan.flattenOffset(); // This will set the offset to the current value and reset value to zero
        },
        onPanResponderGrant: () => {
            movePan.setOffset({
                x: movePan.x._value,
                y: movePan.y._value
            }); // This will set the offset to the current value when the pan starts
        }
    });

    const resizeHandleResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
            const { dx, dy } = gesture;
            const newWidth = imageSize.width + dx;
            const newHeight = imageSize.height + dy;
            setImageSize((prevSize) => ({
                width: newWidth > 50 ? newWidth : prevSize.width,
                height: newHeight > 50 ? newHeight : prevSize.height,
            }));
        },
    });
    const reverseLastPath = () => {
        if (paths.length > 0) {
            const updatedPaths = [...paths];
            updatedPaths.pop(); // Remove the last path from the array
            setPaths(updatedPaths);
        }
    };
    const imageStyle = {
        width: imageSize.width,
        height: imageSize.height,
        transform: [
            { translateX: movePan.x },
            { translateY: movePan.y },
        ],
    };
    const onTouchMove = (event) => {
        if (event.nativeEvent.touches.length === 1) {
            const newPath = [...currentPath];

            // get current user touches position
            const locationX = event.nativeEvent.locationX;
            const locationY = event.nativeEvent.locationY;

            // create new point
            const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(0)},${locationY.toFixed(0)} `;

            // add the point to older points
            newPath.push(newPoint);
            setCurrentPath(newPath);
        }
    };

    const onTouchEnd = () => {

        const currentPaths = [...paths];
        const newPath = [...currentPath];

        // push new path with old path and clean current path state
        currentPaths.push(newPath);
        setPaths(currentPaths);
        setCurrentPath([]);

    };
    const onPinchGestureEvent = (event) => {
        setZoomScale(event.nativeEvent.scale);
    };

    const onPinchHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            if (zoomScale < 1) {
                setZoomScale(1);
            }
        }
    };

    return (
        <View style={{
            flex: 1,
            backgroundColor: 'white',
            height: "100%"
        }}>

            <PinchGestureHandler
                onGestureEvent={onPinchGestureEvent}
                onHandlerStateChange={onPinchHandlerStateChange}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContentContainer}
                    maximumZoomScale={2}
                    minimumZoomScale={1}
                    scrollEnabled={false}
                    style={{ overflow: 'hidden' }}
                    nestedScrollEnabled={true}
                >

                    <ImageBackground source={require('../../assets/table2.png')} style={{
                        width: '100%',
                        height: windowHeight / 1.1,
                    }}
                        resizeMode="contain" >

                        {isTextInputEnabled ? (
                            <>
                                <TextInput
                                    value={text}
                                    onChangeText={(newtext) => setText(newtext)}
                                    autoFocus
                                    multiline
                                    editable
                                    style={styles.textcontainer} />
                                <Svg height={height} width={width}>
                                    {paths.length > 0 &&
                                        paths.map((item, index) => (
                                            <Path
                                                key={`path-${index}`}
                                                d={item.join('')}
                                                stroke={'black'}
                                                fill={'transparent'}
                                                strokeWidth={5}
                                                strokeLinejoin={'round'}
                                                strokeLinecap={'round'}
                                            />
                                        ))}
                                </Svg>
                            </>) : (<View style={{ width: "100%", height: "100%" }}>
                                <Text style={styles.textcontainer}>{text} </Text>
                                <View style={styles.svgContainer} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                                    <Svg height={height} width={width}>
                                        <Path
                                            d={currentPath.join('')}
                                            stroke={'black'}
                                            fill={'transparent'}
                                            strokeWidth={5}
                                            strokeLinejoin={'round'}
                                            strokeLinecap={'round'}
                                        />

                                        {paths.length > 0 &&
                                            paths.map((item, index) => (
                                                <Path
                                                    key={`path-${index}`}
                                                    d={item.join('')}
                                                    stroke={'black'}
                                                    fill={'transparent'}
                                                    strokeWidth={5}
                                                    strokeLinejoin={'round'}
                                                    strokeLinecap={'round'}
                                                />
                                            ))}
                                    </Svg>
                                </View>

                            </View>)}
                        <View style={[styles.btncontainer]}>
                            <Animated.View style={[styles.imageWrapper, imageStyle]} {...movepanResponder.panHandlers} >
                                {!image ? null : (
                                    <View style={styles.resizeHandle} {...resizeHandleResponder.panHandlers} />
                                )}
                                {image && (
                                    <>
                                        <Image source={{ uri: image }} style={styles.image} />
                                        <TouchableOpacity onPress={removeImage} style={styles.removeButton}>
                                            <FontAwesome name="remove" size={30} color="#B9D5FF" />
                                        </TouchableOpacity>
                                    </>
                                )}
                            </Animated.View>
                        </View>
                        <View
                            style={[
                                styles.btncontainer,
                                {
                                    marginLeft: "70%"
                                },
                            ]}
                        >

                            <View style={{ flexDirection: 'column', justifyContent: 'flex-end', padding: 5 }}>
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
                </ScrollView>
            </PinchGestureHandler>
            <View style={{ alignItems: 'center' }}>
                <View style={styles.buttonview}>

                    <TouchableOpacity style={styles.Touchablebutton} onPress={handleToggleInput}>
                        {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>{isTextInputEnabled ? 'Drawing' : 'Text'}</Text> */}
                        {isTextInputEnabled ? <FontAwesome5 name="pen" size={24} color="#B9D5FF" /> : <MaterialIcons name="text-fields" size={24} color="#B9D5FF" />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.Touchablebutton} onPress={recording ? stopRecording : startRecording}>
                        {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>{recording ? 'Stop Recording' : 'Start Recording'}</Text> */}
                        {recording ? <FontAwesome5 name="stop" size={24} color="#B9D5FF" /> : <MaterialIcons name="multitrack-audio" size={24} color="#B9D5FF" />}

                    </TouchableOpacity>
                    {paths.length > 0 && (
                        <TouchableOpacity onPress={reverseLastPath} style={styles.Touchablebutton}>
                            <Entypo name="back-in-time" size={24} color="#B9D5FF" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => {
                        setPaths([]);
                        setText('')
                    }} style={styles.Touchablebutton}>
                        <AntDesign name="delete" size={24} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={pickImage} style={styles.Touchablebutton} >
                        {/* <Text style={{ fontSize: 15, marginRight: 10, color: 'white' }}>Attachment</Text> */}
                        <MaterialIcons name="attachment" size={24} color="#B9D5FF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Touchablebutton} onPress={() => setModalVisible(true)} >
                        {/* <Text style={{ fontSize: 20, marginRight: 10, color: 'white' }}>Save</Text> */}
                        <FontAwesome name="save" size={24} color="#B9D5FF" />
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    )
}

export default MasterTasks

const styles = StyleSheet.create({
    buttonview: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: '1%',
        backgroundColor: 'black',
        borderRadius: 10,
        width: Dimensions.get('window').width,
    },
    Touchablebutton: {
        width: Dimensions.get('window').width / 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderRadius: 10,
        height: 30
    },
    removeButton: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
    btncontainer: {
        position: 'absolute',
        flexDirection: 'row',
        marginTop: '10%',
    },
    imageContainer: {
        width: 200,
        height: 200,
        // borderWidth: 2,
        // borderColor: 'black',
    },
    imageWrapper: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    resizeHandle: {
        position: 'absolute',
        bottom: -14,
        right: -13,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 10,
    },
    resizeHandleInner: {
        width: 10,
        height: 10,
        backgroundColor: '#B9D5FF',
        borderRadius: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 22,
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
        borderWidth: 1,
        width: "10%"
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
    },

})