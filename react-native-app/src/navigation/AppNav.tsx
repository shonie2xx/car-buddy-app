import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react"
import { NavigationContainer, useNavigation } from "@react-navigation/native";


import PageSpeech from "../screens/PageSpeech";
import PageBluetooth from "../screens/PageBluetooth";

import { BleManager, Device } from "react-native-ble-plx";
const bleManager = new BleManager();
import {
  Alert
} from "react-native";

const base64 = require('base-64');

export const AppNav = () => {
  
  const Tab = createBottomTabNavigator();

  const [scannedDevice, setScannedDevice] = useState<Device | null>(null);
  
  // bluttoth 
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
      console.log("vliza", number[0]);
      
      const service = scannedDevice?.serviceUUIDs;
      if (service) {
        const info = await scannedDevice?.characteristicsForService(
          `${service[0]}`
        );
        if (info) {
          scannedDevice?.writeCharacteristicWithResponseForService(
            `${info[0].serviceUUID}`,
            `${info[0].uuid}`,
            //`${base64.encode(number[0])}`
            'NTA='
          );
        }
      }
    } catch (error) {
      console.log("error sending command", error);
      Alert.alert('Not connected or bluetooth is off');
    }
  };

  return (
    <NavigationContainer>
        <Tab.Navigator
      initialRouteName="Boosters"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Buddy") {
            iconName = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "Bluetooth") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } 
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0A5172",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {},
      })}
    >
      
      <Tab.Screen
        name="Buddy"
        component={() => <PageSpeech temp={sendCommandTemperature }/>}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Bluetooth"
        component={() => <PageBluetooth funcs={[scanForDevices, connectToDevice, scannedDevice]}/>}
        options={{ headerShown: false }}
      />
        </Tab.Navigator>
    </NavigationContainer>
    
  );
};

export default AppNav;