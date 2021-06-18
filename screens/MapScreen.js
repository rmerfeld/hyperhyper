import React, { useLayoutEffect } from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'

const MapScreen = ({ navigation, route }) => {

    const { id, NAME, ALERTS } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: NAME,
            headerBackTitle: "Hyper",
        });
    }, [navigation]);

    return (
        <View>
            <StatusBar style="light"></StatusBar>
        </View>
    )
}

export default MapScreen

const styles = StyleSheet.create({})
