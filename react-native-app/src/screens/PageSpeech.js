import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
} from "react-native";

import Voice from "react-native-voice";
import * as Speech from "expo-speech";
import { debounce } from "lodash";

const PageSpeech = ({ commandTemp, ligthsOn, ligthsOff }) => {
  //Voice recognition
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState([]);

  const [sayHi, setSayHi] = useState(false);
  const [tempResponse, setTempResponse] = useState(false);
  const [temperature_val, setTemperature_val] = useState("");

  const [sayLightsOn, setSayLightsOn] = useState(false);
  const [sayLightsOff, setSayLightsOff] = useState(false);

  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    setStarted("√");
  };
  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log("ENDS");
    setEnd("√");
  };
  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    setResults(e.value);
  };
  const startRecognizing = async () => {
    try {
      await Voice.start("en-US");
      setStarted("");
      setResults([]);
      //setPartialResults([]);
      setEnd("");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };
  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
      setStarted("");
      setResults([]);
      //setPartialResults([]);
      setEnd("");
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };

  const onCountStopChanging = () => {
    console.log("count has stopped changing");
    recognizeHeyCommand(); // recognize
    recognizeTempCommand();
    recognizeLightsOnCommand();
    recognizeLightsOffCommand();
  };

  const debouncedOnResultsStopChanging = debounce(onCountStopChanging, 1000);
  useEffect(() => {
    debouncedOnResultsStopChanging();
  }, [results]);

  useEffect(() => {
    tellHi();
  }, [sayHi]);

  useEffect(() => {
    tellYes();
  }, [tempResponse]);

  useEffect(() => {
    tellLightsOff();
  }, [sayLightsOff]);

  useEffect(() => {
    tellLightsOn();
  }, [sayLightsOn]);

  const tellHi = async () => {
    const thingToSay = "Hey, what can I do for you?";
    let options = {
      voice: "com.apple.voice.compact.en-US.Samantha",
      onDone: () => {
        setSayHi(false);
        destroyRecognizer();
      },
    };

    if (sayHi) {
      Speech.speak(thingToSay, options);
    }
  };

  const tellYes = async () => {
    const thingToSay = `Yes my master.....I am setting the temperature to ${temperature_val}`;
    let options = {
      voice: "com.apple.voice.compact.en-US.Samantha",
      onDone: () => {
        setTempResponse(false);
        commandTemp(temperature_val);
        destroyRecognizer();
      },
    };

    if (tempResponse) {
      Speech.speak(thingToSay, options);
    }
  };

  const tellLightsOn = async () => {
    const thingToSay = "Lights are on";
    let options = {
      voice: "com.apple.voice.compact.en-US.Samantha",
      onDone: () => {
        setSayLightsOn(false);
        ligthsOn();
        destroyRecognizer();
      },
    };
    if (sayLightsOn) {
      Speech.speak(thingToSay, options);
    }
  };

  const tellLightsOff = async () => {
    const thingToSay = "Lights are off";
    let options = {
      voice: "com.apple.voice.compact.en-US.Samantha",
      onDone: () => {
        setSayLightsOff(false);
        ligthsOff();
        destroyRecognizer();
      },
    };
    if (sayLightsOff) {
      Speech.speak(thingToSay, options);
    }
  };

  const recognizeHeyCommand = async () => {
    let isFound = results.toString().search(/hey buddy/i);
    if (isFound !== -1) {
      setSayHi(true);
    }
  };

  const recognizeTempCommand = async () => {
    const directory = results.toString();
    //looking for key words in the command
    var keyWord = directory.search(/temperature/i);

    //looking for 2 digit number with regex
    let pattern = /\d{2}/;
    let number = directory.match(pattern);
    //console.log("number" + number);
    if (keyWord !== -1 && number !== null) {
      console.log("number:", number);

      setTemperature_val(number[0]);
      // destroyRecognizer();
      setTempResponse(true);

      //console.log(temperature_val);
      //console.log("results: ", results)
    }
  };

  const recognizeLightsOnCommand = async () => {
    const directory = results.toString();
    var keyWord = directory.search(/lights on/);
    var keyWord1 = directory.search(/light on/);
    if (keyWord !== -1 || keyWord1 !== -1) {
      setSayLightsOn(true);
    }
  };

  const recognizeLightsOffCommand = async () => {
    const directory = results.toString();
    var keyWord = directory.search(/lights off/);
    var keyWord1 = directory.search(/light off/);
    if (keyWord !== -1 || keyWord1 !== -1) {
      setSayLightsOff(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text>Welcome to the speech recognizer</Text>
        <View style={styles.headerContainer}>
          <Text style={styles.textWithSpaceStyle}>{`Started: ${started}`}</Text>
          <Text style={styles.textWithSpaceStyle}>{`End: ${end}`}</Text>
        </View>

        <Text style={styles.textStyle}>Results</Text>
        <ScrollView style={{ marginBottom: 42 }}>
          {results.map((result, index) => {
            return (
              <Text key={`result-${index}`} style={styles.textStyle}>
                {result}
              </Text>
            );
          })}
        </ScrollView>
        <View style={styles.horizontalView}>
          {/* <Button onPress={stopRecognizing} style={styles.buttonStyle} title="Stop recognizing"/>  */}
          {/* <Button onPress={cancelRecognizing} style={styles.buttonStyle} title="Cancel" /> */}
          <Button onPress={startRecognizing} title="Start" />
          <Button
            onPress={destroyRecognizer}
            style={styles.buttonStyle}
            title="Stop"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
  },
  buttonStyle: {
    flex: 1,
    justifyContent: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#8ad24e",
    marginRight: 2,
    marginLeft: 2,
  },
  buttonTextStyle: {
    color: "#fff",
    textAlign: "center",
  },
  horizontalView: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
  },
  textStyle: {
    textAlign: "center",
    padding: 12,
  },
  imageButton: {
    width: 50,
    height: 50,
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: "center",
    color: "#B0171F",
  },
});

export default PageSpeech;
