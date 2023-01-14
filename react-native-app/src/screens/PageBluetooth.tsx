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


const PageBluetooth = () => {
  
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);

const scanForDevices = async () => {
  bleManager.startDeviceScan(null, null, (error, device) => {
    console.log("Scanning...");
    if (error) {
      console.log("Error while scanning :", error);
      return;
    }

    if (device && device.name?.includes("CarBuddy")) {
      console.log("Connecting to hm-10");
      bleManager.stopDeviceScan();
      setScannedDevice(device);
    }
  });
};

const connectToDevice = async () => {
  if (scannedDevice) {
    console.log("id", scannedDevice.id);

    const device = await bleManager.connectToDevice(scannedDevice.id, {
      requestMTU: 187,
    });
    await device.discoverAllServicesAndCharacteristics();

    if(await device.isConnected()) {
      Alert.alert(`Connected to device ${device.name}`)
    }
    console.log("services", await device.services());
  }
};

const sendCommand1 = async () => {
  try {
    const service = scannedDevice?.serviceUUIDs;
    if (service) {
      const info = await scannedDevice?.characteristicsForService(
        `${service[0]}`
      );
      if (info) {
        scannedDevice?.writeCharacteristicWithResponseForService(
          `${info[0].serviceUUID}`,
          `${info[0].uuid}`,
          "MQ=="
        );
      }
    }
  } catch (error) {
    console.log("error sending command", error);
    Alert.alert('Not connected or bluetooth is off');
  }
};

const sendCommand2 = async () => {
  try {
    const service = scannedDevice?.serviceUUIDs;
    if (service) {
      const info = await scannedDevice?.characteristicsForService(
        `${service[0]}`
      );
      if (info) {
        scannedDevice?.writeCharacteristicWithResponseForService(
          `${info[0].serviceUUID}`,
          `${info[0].uuid}`,
          "Mg=="
        );
      }
    }
  } catch (error) {
    console.log("error sending command", error);
    Alert.alert('Not connected or bluetooth is off');
  }
};

  const sendCommandTemperature = async (number: any) => {
  try {
    const service = scannedDevice?.serviceUUIDs;
    if (service) {
      const info = await scannedDevice?.characteristicsForService(
        `${service[0]}`
      );
      if (info) {
        scannedDevice?.writeCharacteristicWithResponseForService(
          `${info[0].serviceUUID}`,
          `${info[0].uuid}`,
          `${base64.encode(number)}`
        );
      }
    }
  } catch (error) {
    console.log("error sending command", error);
    Alert.alert('Not connected or bluetooth is off');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Scan" onPress={scanForDevices} />

        <Text>Devices available: {scannedDevice?.name}</Text>
        <Button title="Connect" onPress={connectToDevice} />
        <Button title="Light On" onPress={sendCommand1} />
        <Button title="Light Off" onPress={sendCommand2} />
        <Button title="Display" onPress={sendCommandTemperature} />
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


