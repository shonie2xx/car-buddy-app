import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
} from "react-native";

import { BleManager, Device } from "react-native-ble-plx";

const bleManager = new BleManager();

const App = () => {
  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [uuid, setUUID] = useState("");
  const scanForDevices = async () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning...")
      //console.log(device);

      if (error) {
        console.log("Error while scanning :", error)
        return
      }

      if (device && device.name?.includes('B2-GreenDMS')) {
        console.log("Connecting to hm-10");
        bleManager.stopDeviceScan();
        device.serviceUUIDs?.map((item) => setUUID(item));
        setScannedDevice(device);
      }
    })
  }

  const connectToDevice = async () => {
    if(scannedDevice) {
      console.log("id", scannedDevice.id);
      
      const device = await bleManager.connectToDevice(scannedDevice.id, {requestMTU: 187});
      await device.discoverAllServicesAndCharacteristics();
      
      console.log("services", await device.services())

    }
  }

  const sendCommand1 = async () => {
    //console.log("connected device and sending", scannedDevice)
    // scannedDevice?.wri('0000ffe0-0000-1000-8000-00805f9b34fb','0xFFE1','Ng==')
    console.log("E tva kvo e? : ", await scannedDevice?.characteristicsForService("0000ffe0-0000-1000-8000-00805f9b34fb"))
    scannedDevice?.writeCharacteristicWithResponseForService(
      "0000ffe0-0000-1000-8000-00805f9b34fb",
      "0000ffe1-0000-1000-8000-00805f9b34fb",
      "MQ=="
    )
  }
  const sendCommand2 = async () => {
    //console.log("connected device and sending", scannedDevice)
    // scannedDevice?.wri('0000ffe0-0000-1000-8000-00805f9b34fb','0xFFE1','Ng==')
    console.log("E tva kvo e? : ", await scannedDevice?.characteristicsForService("0000ffe0-0000-1000-8000-00805f9b34fb"))
    scannedDevice?.writeCharacteristicWithResponseForService(
      "0000ffe0-0000-1000-8000-00805f9b34fb",
      "0000ffe1-0000-1000-8000-00805f9b34fb",
      "Mg=="
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        
        <Button title="Scan" onPress={scanForDevices} />

        <Text >Devices available: {scannedDevice?.name}</Text>
        <Button title="Connect" onPress={connectToDevice} />
        <Button title="Light On" onPress={sendCommand1} />
        <Button title="Light Of" onPress={sendCommand2} />
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

export default App;
