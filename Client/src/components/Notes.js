import { View, Text, TextInput, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import {
    DrawWithOptions,
    DrawProvider,
} from '@archireport/react-native-svg-draw';
import { LinearGradient } from 'expo-linear-gradient';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import * as MediaLibrary from 'expo-media-library';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { ToastAndroid } from 'react-native';

const Notes = () => {
    const [notes, setNotes] = useState('')

    const saveSnapshot = async (uri) => {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
            await MediaLibrary.saveToLibraryAsync(uri); // Save the snapshot to the device's photo library on Android
            console.log('Snapshot saved successfully:', uri);
        } else {
            console.log('Permission to access media library not granted.');
        }
    };

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
                style={{
                }}
            >
                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start'
                }} >
                    <ImageBackground source={require('../../assets/not2.jpg')} style={{
                        width: '100%',
                        height: 560,
                        position: 'absolute',
                        top: -295,
                        left: -362,

                    }}
                        resizeMode="cover" >
                        <DrawProvider>
                            <DrawWithOptions
                                linearGradient={LinearGradient}

                                close={() => true}
                                takeSnapshot={(snap) => {
                                    snap.then((uri) => {
                                        saveSnapshot(uri);
                                        ToastAndroid.show(uri, ToastAndroid.SHORT);
                                    });
                                }}
                            />
                        </DrawProvider>
                    </ImageBackground>
                </View>
            </ReactNativeZoomableView>
        </View>
    )
}

export default gestureHandlerRootHOC(Notes)