import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  ScrollView,
} from 'react-native';


import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const App = () => {

   

  const [devices, setDevices] = useState([]);
  
//   useEffect(() => { 
//     scanForDevice();
//   }, 
//   [])
  
  const scanForDevice = () => {
    
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("failed scaning for devices: ", error);
      }
      if (device && device.name == "B2-GreenDMS") {
        if(devices.filter(d => d.id === device.id).length == 0) 
        {
        setDevices(devices => [...devices, device]);
        }
        //console.log("raw device", device);
      }
    });
    console.log(" devices : ", devices);
  }

  return (
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.heartRateTitleWrapper}>
    //     {connectedDevice ? (
    //       <>
    //         <Text style={styles.heartRateTitleText}>Your Heart Rate Is:</Text>
    //       </>
    //     ) : (
    //       <Text style={styles.heartRateTitleText}>
    //         Please Connect to a Heart Rate Monitor
    //       </Text>
    //     )}
    //   </View>
    //   <TouchableOpacity
    //     onPress={connectedDevice ? disconnectFromDevice : openModal}
    //     style={styles.ctaButton}>
    //     <Text style={styles.ctaButtonText}>
    //       {connectedDevice ? 'Disconnect' : 'Connect'}
    //     </Text>
    //   </TouchableOpacity>
    //   <DeviceModal
    //     closeModal={hideModal}
    //     visible={isModalVisible}
    //     connectToPeripheral={connectToDevice}
    //     devices={allDevices}
    //   />
    // </SafeAreaView>
    <SafeAreaView  >
        <View>
        
        <Text>Devices</Text>
          
          <Button title="Scan" onPress={scanForDevice} />
          <ScrollView>
          {devices.map((device, index) => 
             <Text key={index}>{device.name}</Text> 
          )}
          </ScrollView>
          
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;