import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
} from 'react-native';

import Voice from 'react-native-voice';
import * as Speech from 'expo-speech';
import { sendCommandTemperature } from './PageBluetooth';

const PageSpeech = ({temp}) => {

  //Voice recognition
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
 
  const [sayHi, setSayHi] = useState(false);
  const [sayYes, setSayYes] = useState(false);
  const [temperature_val, setTemperature_val] = useState('');


  useEffect(() => {
    
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect( () => {
    findHeyBuddyInResults();
    findTempCommand();
  }, [results] )

  useEffect(() => {
    tellHi();
  }, [sayHi])

  useEffect(() => {
    tellYes();
  }, [sayYes])


  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    setStarted('√');
  };
 
  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    //console.log('onSpeechEnd: ', e);
    setEnd('√');
  };
 
  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    setError(JSON.stringify(e.error));
  };
 
  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    setResults(e.value);
  };
 
  const onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed
    //console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };
 
  const startRecognizing = async () => {
    //const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    //if(status === Permissions.AUDIO_RECORDING) return;
    //Starts listening for speech for a specific locale
    try {
      await Voice.start('en-US');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      //setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
 
  const stopRecognizing = async () => {
    //Stops listening for speech
    try {
      await Voice.stop();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
 
  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
 
  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      //setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const tellHi = async () => {
    const thingToSay = 'Hey, what can I do for you?';
    let options = { voice: "com.apple.voice.compact.en-US.Samantha", onDone: () => {
      setSayHi(false)
      destroyRecognizer()
    }}

    if(sayHi) {
    Speech.speak(thingToSay, options)
    }
    
  };
    
  const tellYes = async () => {
    const thingToSay = `Yes my master.....I am setting the temperature to ${temperature_val}`;
    let options = { voice: "com.apple.voice.compact.en-US.Samantha", onDone: () => {
      setSayYes(false)
      temp(temperature_val);
      destroyRecognizer()
    }}

    if(sayYes) {
    Speech.speak(thingToSay, options)
    }
  }

  const findHeyBuddyInResults = async () => {
    let isFound = results.toString().search(/hey buddy/i);
    if(isFound !== -1) {
      setSayHi(true);
    }
  }

  const findTempCommand = async () => {
    const directory = results.toString();
    //looking for key words in the command
    var keyWord = directory.search(/temperature/i);
    
    //looking for 2 digit number with regex
    let pattern = /\d{2}/;
    let number = directory.match(pattern);
    //console.log("number" + number);
    if(keyWord !== -1 && number !== null)
    {
      console.log("number:", number)
      setTemperature_val(number);
      // destroyRecognizer();
      setSayYes(true);
      
      //console.log(temperature_val);
      //console.log("results: ", results)
    }
  }

  
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
      <Text>Welcome to the speech recognizer</Text>
      <View style={styles.headerContainer}>
          <Text style={styles.textWithSpaceStyle}>
            {`Started: ${started}`}
          </Text>
          <Text style={styles.textWithSpaceStyle}>
            {`End: ${end}`}
          </Text>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.textWithSpaceStyle}>
            {`Pitch: \n ${pitch}`}
          </Text>
          <Text style={styles.textWithSpaceStyle}>
            {`Error: \n ${error}`}
          </Text>
        </View>
        <Button onPress={startRecognizing} title="Start" />

        <Text style={styles.textStyle}>
          Results
        </Text>
        <ScrollView style={{marginBottom: 42}}>
          {results.map((result, index) => {
            return (
              <Text
                key={`result-${index}`}
                style={styles.textStyle}>
                {result}
              </Text>
            );
          })}
          <Text>Temperature - {temperature_val}</Text>
        </ScrollView>
        <View style={styles.horizontalView}>
          <Button onPress={stopRecognizing} style={styles.buttonStyle} title="Stop recognizing"/> 
          <Button onPress={cancelRecognizing} style={styles.buttonStyle} title="Cancel" />
          <Button onPress={destroyRecognizer} style={styles.buttonStyle} title="Destroy"/>
        
      </View>
      </View>
    </SafeAreaView>
  );
};
 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  horizontalView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
  },
  textStyle: {
    textAlign: 'center',
    padding: 12,
  },
  imageButton: {
    width: 50,
    height: 50,
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#B0171F',
  },
});

export default PageSpeech;