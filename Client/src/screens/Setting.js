import { StyleSheet, Text, View, Button } from 'react-native'
import React, { useState } from 'react'


const Setting = () => {


    return (
        <View style={styles.container}>
            <Text>Settings</Text>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});