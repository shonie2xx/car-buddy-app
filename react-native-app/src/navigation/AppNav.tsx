import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PageSpeech from "../screens/PageSpeech";
import PageBluetooth from "../screens/PageBluetooth";

import { BleManager, Device } from "react-native-ble-plx";

const bleManager = new BleManager();

import { Alert } from "react-native";
import Main from "../screens/Main";

const base64 = require("base-64");

export const AppNav = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();
  const [device, setDevice] = useState<Device | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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
        setDevice(device);
      }
    });
  };

  const connectToDevice = async () => {
    if (device) {
      console.log("id", device.id);

      const connected = await bleManager.connectToDevice(device.id, {
        requestMTU: 187,
      });
      await connected.discoverAllServicesAndCharacteristics();

      if (await connected.isConnected()) {
        Alert.alert(`Connected to device ${device.name}`);
        setIsConnected(true);
      }
      console.log("services", await device.services());
    }
  };

  const commandLightsOn = async () => {
    const lightson = base64.encode("1");
    console.log("command on", lightson);
    try {
      const service = device?.serviceUUIDs;
      if (service) {
        const info = await device?.characteristicsForService(`${service[0]}`);
        if (info) {
          device?.writeCharacteristicWithResponseForService(
            `${info[0].serviceUUID}`,
            `${info[0].uuid}`,
            `${lightson}`
          );
        }
      }
    } catch (error) {
      console.log("error sending command", error);
      Alert.alert("Not connected or bluetooth is off");
    }
  };

  const commandLightsOff = async () => {
    const lightsoff = base64.encode("2");
    console.log("command off", lightsoff);
    try {
      console.log("off");

      const service = device?.serviceUUIDs;
      if (service) {
        const info = await device?.characteristicsForService(`${service[0]}`);
        if (info) {
          device?.writeCharacteristicWithResponseForService(
            `${info[0].serviceUUID}`,
            `${info[0].uuid}`,
            `${lightsoff}`
          );
        }
      }
    } catch (error) {
      console.log("error sending command", error);
      Alert.alert("Not connected or bluetooth is off");
    }
  };

  const commandTemperature = async (num: any) => {
    let temp = "";
    switch (num) {
      case "15":
        temp = base64.encode("3");
        break;
      case "16":
        temp = base64.encode("4");
        break;
      case "17":
        temp = base64.encode("5");
        break;
      case "18":
        temp = base64.encode("6");
        break;
      case "19":
        temp = base64.encode("7");
        break;
      case "20":
        temp = base64.encode("8");
        break;
      case "21":
        temp = base64.encode("9");
        break;
      case "22":
        temp = base64.encode("10");
        break;
      case "23":
        temp = base64.encode("11");
        break;
    }
    console.log("tempnum", num);
    try {
      const service = device?.serviceUUIDs;
      if (service) {
        const info = await device?.characteristicsForService(`${service[0]}`);
        if (info) {
          device?.writeCharacteristicWithResponseForService(
            `${info[0].serviceUUID}`,
            `${info[0].uuid}`,
            `${temp}`
          );
        }
      }
    } catch (error) {
      console.log("error sending command", error);
      Alert.alert("Not connected or bluetooth is off");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={() => <Main connectionState={isConnected} />}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Buddy"
          component={() => (
            <PageSpeech
              commandTemp={commandTemperature}
              ligthsOn={commandLightsOn}
              ligthsOff={commandLightsOff}
            />
          )}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="Bluetooth"
          component={() => (
            <PageBluetooth
              device={device}
              scan={scanForDevices}
              connect={connectToDevice}
              temp={commandTemperature}
              ligthsOn={commandLightsOn}
              ligthsOff={commandLightsOff}
            />
          )}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNav;
