import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
  TouchableHighlight,
  Pressable
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Main = ({connectionState}) => {

    //const {isConnected} = props.isConnected;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Car Buddy</Text>
        <Image style={styles.carpic} source={require('../../assets/car.png')} />
        <View style={styles.bottom}>
            <Pressable onPress={()=>{navigation.navigate("Bluetooth");}}  style={({pressed}) => [ { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'}]}>
                <View style={styles.btnBox}>
                    <View>
                    <Ionicons name="ios-bluetooth" size={34} color={connectionState ? "green" : "red"} />
                    </View>
                    <View>
                    <Text style={styles.bletext}>Connect</Text>
                    </View>
                </View>
            </Pressable>

            <Pressable onPress={()=>{navigation.navigate("Buddy")}}  style={({pressed}) => [ { backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white'}]}>
                <View style={styles.btnBox}>
                    <MaterialCommunityIcons name="account-voice" size={34} color="black" />
                    <Text style={styles.bletext}>Speak</Text>
                </View>
            </Pressable>
        </View>
      </View>
      
    </SafeAreaView>
  );
};
 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 5,
    backgroundColor: 'white'
  },
  title: {
    paddingTop: 40,
    fontSize: 20
  },
  carpic: {

  },
  bottom: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 250,
    paddingTop: 50
    
  },
  item: {
    padding: 70
  },
  bletext: {
    paddingTop: 20
  },
  btnBox: {
    //margin: 40,
    width: 100,
    height: 150,
    
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    
    borderWidth: 0.2,
    borderRadius: 10,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Main;