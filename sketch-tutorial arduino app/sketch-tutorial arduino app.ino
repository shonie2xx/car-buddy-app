#include <SoftwareSerial.h>
#include "Display.h"

SoftwareSerial BTSerial(2, 3); //RX|TX

void setup(){
  Serial.begin(9600);
  BTSerial.begin(9600); // default baud rate
  Serial.println("AT commands: ");

  // led
  pinMode(13, OUTPUT);
}

void loop(){
  
  //Read from the HM-10 and print in Serial Moniter
    if(BTSerial.available()) {
      
      // Serial.write(BTSerial.read());
      char command = BTSerial.read();
     
      switch (command) {
        case '1' :
        digitalWrite(13, HIGH);
        break;
        case '2' :
        digitalWrite(13, LOW);
        break;
        case '3' :
        Display.show(15);
        break;
        case '4' :
        Display.show(16);
        break;
        case '5' :
        Display.show(17);
        break;
        case '6' :
        Display.show(18);
        break;
        case '7' :
        Display.show(19);
        break;
        case '8' :
        Display.show(20);
        break;
        case '9' :
        Display.show(21);
        break;
        case '10' :
        Display.show(22);
        break;
        case '11' :
        Display.show(23);
        break;
      }
  }

  //Read from the Serial Moniter and print to the HM-10
  if(Serial.available()) {
      BTSerial.write(Serial.read());
  }
}