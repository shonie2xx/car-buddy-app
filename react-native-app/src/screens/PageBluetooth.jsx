import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Alert
} from "react-native";

import { BleManager, Device } from "react-native-ble-plx";

const base64 = require('base-64');

const bleManager = new BleManager();


const PageBluetooth = ({device, scan, connect, temp, ligthsOn, ligthsOff}) => {
  


  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Scan" onPress={scan} />

        <Text>Devices available: {device?.name}</Text>
        <Button title="Connect" onPress={connect} />
        <Button title="Light On" onPress={ligthsOn} />
        <Button title="Light Off" onPress={ligthsOff} />
        <Button title="Display" onPress={()=>temp(15)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    color: "black",
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: "purple",
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default PageBluetooth;


