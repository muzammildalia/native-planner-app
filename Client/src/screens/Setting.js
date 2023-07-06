import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions, PanResponder, Image } from 'react-native';
import React, { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';

const Setting = () => {
    const [image, setImage] = useState(null);
    const [imageSize, setImageSize] = useState({ width: 200, height: 200 });
    const movePan = useRef(new Animated.ValueXY()).current;
    const resizePan = useRef(new Animated.ValueXY()).current;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
            setImageSize({ width: 200, height: 200 });
            movePan.setValue({ x: 0, y: 0 });
            resizePan.setValue({ x: 0, y: 0 });
        }
    };

    const removeImage = () => {
        setImage(null);
    };

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

    const imageStyle = {
        width: imageSize.width,
        height: imageSize.height,
        transform: [
            { translateX: movePan.x },
            { translateY: movePan.y },
        ],
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
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
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={pickImage} style={styles.attachButton}>
                    <MaterialIcons name="attachment" size={24} color="#B9D5FF" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
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
        bottom: -10,
        right: -10,
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
        borderRadius: 5,
    },
    removeButton: {
        position: 'absolute',
        top: -15,
        right: -15,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    attachButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#B9D5FF',
        borderRadius: 30,
    },
});

export default Setting;