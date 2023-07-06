import React from "react";
import { StyleSheet, View, Text } from "react-native";
import "@expo/match-media";
import { useMediaQuery } from "react-responsive";

export default function Contacts() {
    const isTabletOrMobileDevice = useMediaQuery({
        query: "(max-device-width: 3000px)",
    });
    const isDeviceWidth2048_2732 = useMediaQuery({
        query: "(min-device-width:1300) and (max-device-width:2732)",
    });
    const isDeviceWidth800_1280 = useMediaQuery({
        query: "(min-device-width:800) and (max-device-width:1280)",
    });


    if (isTabletOrMobileDevice) {
        if (isDeviceWidth800_1280) {
            return (
                <View style={styles.media295_359.button}>
                    <Text style={styles.media295_359.buttonText}>Mobile Device</Text>
                </View>
            );
        } else if (isDeviceWidth2048_2732) {
            return (
                <View style={styles.media360_374.button}>
                    <Text style={styles.media360_374.buttonText}>Ipad Device</Text>
                </View>
            );
        } else {
            return (
                <View>
                    <Text> Device</Text>
                </View>
            );
        }
    }
    return <View style={styles.button}>
        <Text style={styles.buttonText}>desktop</Text>
    </View>
}
const styles = StyleSheet.create({
    media295_359: {
        button: {
            height: 70,
            margin: 4,
        },
        buttonText: {
            fontSize: 12,
        },
    },
    media360_374: {
        button: {
            height: 86,
            margin: 6,
        },
        buttonText: {
            fontSize: 15,
        },
    },
    media375_811: {
        button: {
            height: 86,
            margin: 6,
        },
        buttonText: {
            fontSize: 15,
        },
    },
    button: {
        height: 86,
        margin: 6,
    },
    buttonText: {
        fontSize: 15,
    },
});