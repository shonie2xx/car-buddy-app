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
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  //const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  //   useEffect(() => {
  //     scanForDevice();
  //   },
  //   [])

  // //check for duplicates
  // const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
  //   devices.findIndex(device => nextDevice.id === device.id) > -1;

  // const scanForDevice = () => {
  //   bleManager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //       console.log(error);
  //     }
  //     if (device && device.name?.includes('B2-GreenDMS')) {
  //       setAllDevices((prevState: Device[]) => {
  //         if (!isDuplicteDevice(prevState, device)) {
  //           return [...prevState, device];
  //         }
  //         return prevState;
  //       });
  //     }
  // })
  // };

  // const connectToDevice = async (device: Device) => {
  //   try {
  //     console.log("DEVICE: ", device.name + device.id)
  //     await device.cancelConnection();
  //     const deviceConnection = await bleManager.connectToDevice(device.id);
  //     setConnectedDevice(deviceConnection);
  //     await deviceConnection.discoverAllServicesAndCharacteristics();
  //     bleManager.stopDeviceScan();
  //     console.log("connected device", deviceConnection)
  //     //startStreamingData(deviceConnection);
  //   } catch (e) {
  //     console.log('FAILED TO CONNECT', e);
  //   }
  // };

  // const disconnectFromDevice = () => {
  //   if (connectedDevice) {
  //     bleManager.cancelDeviceConnection(connectedDevice.id);
  //     setConnectedDevice(null);
  //   }
  // };

  const [scanedDevice, setScannedDevice] = useState<Device | null>(null);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  
  const scanForDevices = async () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      console.log("Scanning...")
      console.log(device);

      if (error) {
        console.log("Error while scanning :", error)
        return
      }

      if (device && device.name?.includes('B2-GreenDMS')) {
        console.log("Connecting to hm-10");
        bleManager.stopDeviceScan();
        setScannedDevice(device);
      }
    })
  }

  const connectToDevice = async () => {
    if(scanedDevice) {
      const connected = await scanedDevice.connect();
      
      console.log("Discovering services and characteristics");
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);
      const services = await connected.services();
      services.forEach(async service => {
        const characteristics = await connected.characteristicsForService(service.uuid);
        characteristics.forEach(console.log);
      });
      //console.log("INFO", info);
//       await device.discoverAllServicesAndCharacteristics();
// const services = await device.services();
// services.forEach(async service => {
//    const characteristics = await device.characteristicsForService(service.uuid);
//    characteristics.forEach(console.log);
// });
    }
  }

  const sendCommand = async () => {
    connectedDevice?.writeCharacteristicWithResponseForService('0000ffe0-0000-1000-8000-00805f9b34fb','0xFFE0',"MQ==")
  }
//10795694912
//0000ffe0-0000-1000-8000-00805f9b34fb
  const getInfo = async () => {
   
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
        
        <Button title="Scan" onPress={scanForDevices} />

        <Text >Devices available: {scanedDevice?.name}</Text>
        <Button title="Connect" onPress={connectToDevice} />
        <Button title="Send" onPress={sendCommand} />
        {/* <View>
            { allDevices.map((device, index) => 
              {
                return (
                 
                  <View key={index}>
                  <Text>{device.name}</Text>
                  { connectedDevice ? 
                  <Button title="Disconnect" onPress={disconnectFromDevice}/>  
                  :
                  <Button title="Connect" onPress={() => connectToDevice(device)}/>
                }
                </View>
                )
              }
              )}
          </View> */}
        {/* {device ? (
          <Button title="Connect" onPress={connectToDevice} />
        ) : (
          <Button
            title="Can't connect"
            onPress={() => console.log("can't connect")}
          />
        )} */}
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
