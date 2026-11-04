export const STARTER_SKETCH_FILENAME = "blink.ino";

export const STARTER_SKETCH = `// Arduino UNO starter sketch
// Press Run to compile, upload and start the simulator.

void setup() {
  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("led on (D13)");
  delay(1000);

  digitalWrite(LED_BUILTIN, LOW);
  Serial.println("led off (D13)");
  delay(1000);
}
`;
