#include <DHT.h>
#include <Wire.h>
#include <BH1750.h>

#define DHTTYPE DHT11   // DHT 11

int soundPin = 26; // Use Pin 10 as Sound Input (Analog)
int gasPin = 24; // Use pin 0 as CO Input (Analog)
int tempPin = 16; //Use pin 0 as Temp Input (Digital)
String rpta = "";
String numMicro = "1";
/* El sensor de luz utiliza comunicación I2C (SDA y SCL)*/

/* Constantes para calcular PPM*/
const static unsigned RL = 10000;              // Ohms
const static unsigned R0 = 2000;               // Ohms
const static float    VCC_HEATER = 5.29;       // Volts
const static float    COEF_A = -1.6;          // See MQ7 documentation :
const static float    CONSTANT_B = 100;        // log(ppmCO) = COEF_A * log(Rs/R0) + log(CONSTANT_B)


DHT dht(tempPin, DHTTYPE);
BH1750 Luxometro;

void setup()
{
Serial.begin(9600);  //Inicializa la comunicación serial (9600 baudios)
dht.begin();         //Inicializa la libreria del sensor de temperatura
Wire.begin();        //Inicializa la comunicacion I2C
Luxometro.begin(BH1750_CONTINUOUS_HIGH_RES_MODE); //Inicializa la libreria del sensor de luminosidad

}

void loop()
{
//////////////////////  Medición de la temperatura  /////////////////////////////

   float t = dht.readTemperature(); //Realiza la medición de la temperatura

 //Imprime la temperatura medida

   rpta = rpta +t;
   rpta = rpta +"\t";
   rpta = rpta +"C";
   rpta = rpta +"\t";


 //////////////////////  Medición del sonido  /////////////////////////////

  int soundValue = analogRead(soundPin);   //Realiza una lectura del sensor
  //double db = 20.0 * log10(soundValue / 5.0) ;
  double db = -16.801 * log(soundValue/1023.) + 9.872;

   //Imprime la luminosidad medida
  rpta = rpta +db;
  rpta = rpta +"\t";
  rpta = rpta +"dB";
  rpta = rpta +"\t";


//////////////////////  Medición del CO  /////////////////////////////

  int GasSensorValue = analogRead(gasPin);   //Realiza una lectura del sensor
  int gasVoltage = (5*GasSensorValue)/1024;
  double COGas = (CONSTANT_B * pow((((float)RL / R0) * ((VCC_HEATER / gasVoltage) - 1)), COEF_A));

   //Imprime la luminosidad medida
  rpta = rpta +COGas;
  rpta = rpta +"\t";
  rpta = rpta +"ppm";
  rpta = rpta +"\t";


//////////////////////  Medición de la luminosidad  /////////////////////////////
  uint16_t lux = Luxometro.readLightLevel(); //Realiza una lectura del sensor

  //Imprime la luminosidad medida
  rpta = rpta +lux;
  rpta = rpta +"\t";
  rpta = rpta +"lx";
  rpta = rpta +"\t";

// Añade el número de MicroControlador
  rpta = rpta +"MicroControlador Num:";
  rpta = rpta +"\t";
  rpta = rpta + numMicro;
  rpta = rpta +"\n";
  
  Serial.print(rpta);
  rpta = "";
  delay(15000);

}
