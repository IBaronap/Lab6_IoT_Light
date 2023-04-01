const int LED1_PIN = 2;
const int LED2_PIN = 3;

const int LIGHT_SENSOR_PIN = A0;
int LIGHT_SENSOR_Value = 0;
int Previous_SENSOR_Value = LIGHT_SENSOR_Value;

const int LIGHT_THRESHOLD = 200;

void setup() {
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);

  Serial.begin(9600);
}

void loop() {

  if (Serial.available() > 0) {
    receivingData();
  } else {
    sendingData();
  }
  delay(10);

}

void sendingData() {

  LIGHT_SENSOR_Value = analogRead(LIGHT_SENSOR_PIN);

  if (LIGHT_SENSOR_Value > Previous_SENSOR_Value + LIGHT_THRESHOLD || LIGHT_SENSOR_Value < Previous_SENSOR_Value - LIGHT_THRESHOLD) {
    sendSerialMessage('P', 'O', LIGHT_SENSOR_Value);
    Previous_SENSOR_Value = LIGHT_SENSOR_Value;
  }

  delay(100);

  int LED1_status = digitalRead(LED1_PIN);
  int LED2_status =  digitalRead(LED2_PIN);

  if (LED1_status == HIGH) {
    sendSerialMessage('L', 'A', 1);
  } else {
    sendSerialMessage('L', 'A', 0);
  }

  if (LED2_status == HIGH) {
    sendSerialMessage('L', 'B', 1);
  } else {
    sendSerialMessage('L', 'B', 0);
  }

  delay(2000);
}

void receivingData() {
  String inString = "";
  while (Serial.available() > 0) {
    char inByte = Serial.read(); //Lee solo un cáracter del mensaje
    inString += inByte; //Completa el mensaje para que se lea todos los cáracteres
  }

  if (inString == "A0") {
    digitalWrite(LED1_PIN, LOW);
  } else if (inString == "A1") {
    digitalWrite(LED1_PIN, HIGH);
  } else if (inString == "B0") {
    digitalWrite(LED2_PIN, LOW);
  } else if (inString == "B1") {
    digitalWrite(LED2_PIN, HIGH);
  }
  Serial.flush();
}

void sendSerialMessage(char keyA, char keyB, int LIGHT_SENSOR_Value) {
  Serial.print(keyA);
  Serial.print(' ');
  Serial.print(keyB);
  Serial.print(' ');
  Serial.print(LIGHT_SENSOR_Value);
  Serial.print(' ');
  Serial.println();
}
