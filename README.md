# Yet Another RF MQTT Gateway

433 MHz sensors are cheap option to build a Smart Home solution, however it's not easy to integrate them with a system like Home Assistant or Domoticz. One can use RF Link http://www.rflink.nl/blog2/, however it requires an additional Adruino Mega which adds some € to the price and what is more important for me, an additional power supply.

Yarf uses Arduno Nano and it's heavily based on excellent Pimatic and its rfcontroljs library https://github.com/pimatic/rfcontroljs. Yarf uses rfcontroljs to read serial data from Arduino Nano equipped with RF receiver. Data is compared against known devices and if fits, Yarf sends it to MQTT. In other words: Yarf is just a wrapper for rfcontroljs :-)

Arduino Nano runs an example program from RFControl https://github.com/pimatic/RFControl - official one did not run on my chinese Nano clone.

# Prerequisities

1. Nodejs installed on a system with a MQTT connection. I use Raspi  with Raspbian/Armbian
2. An Arduino Nano with RF receiver. I use one based on SRX882, very good list of available devices can be found here: http://www.rflink.nl/blog2/wiring

# Arduino sketch

A copy of RFControl compressed.ino is located in folder **arduino**, you need to install arduino-mk and its dependencies 
```
sudo apt-get install arduino-mk
sudo apt-get install python-serial
```
After this, make upload shoould load compiled sketch to your Arduino.

# Install

Setup script installs yarf and load necessary libraries. Systemd unit file yarf.service is installed and enabled at boot.

## Configuration files

In /etc/yarf we have 2 configuration files:
* config.js - MQTT configuration and serial port
* devices.json - devices database

## Discovering your devices

In general, you should start with an empty devices.json.

1. Stop yarf.service: sudo systemctl stop yarf.service
2. Run yarf manually with discovery enabled: yarf --discovery
3. Yarf will print newly discovered devices to stdout. There will be some alternative matches proposed by rfcontroljs.
```json
[
    {
        "protocol": "weather12",
        "values": {
            "id": 152,
            "channel": 3,
            "temperature": 26.9,
            "humidity": 32,
            "lowBattery": true
        }
    },
    {
        "protocol": "weather14",
        "values": {
            "id": 113,
            "channel": 1,
            "temperature": -21.3,
            "lowBattery": true,
            "humidity": 245
        }
    },
    {
        "protocol": "weather15",
        "values": {
            "id": 2446,
            "channel": 2,
            "temperature": 21.2,
            "humidity": 10,
            "lowBattery": false
        }
    }
]
```
In the above case the proper match is:
```json
{
    "protocol": "weather15",
    "values": {
        "id": 2446,
        "channel": 2,
        "temperature": 21.2,
        "humidity": 10,
        "lowBattery": false
    }
}
```
## devices.json format
Each match in devices.json is defined by following entry:
```json
{
    "name": "Name of sensor",
    "type": "type of sensor",
    "ident": "an object which will identify this sensor"
    }
```
In the case above, we will make ident field by removing form discovered match all variable parameters:

```json
{
    "protocol": "weather15",
    "values": {
        "id": 2446,
        "channel": 2        
    }
}
```
An entry for devices.json will look as follows:
```json
{
    "name": "Sensor north",
    "type": "temperature_humidity",
    "ident": {
        "protocol": "weather15",
        "values": {
            "id": 2446,
            "channel": 2        
        }
    }
}
```
Message on MQTT will consist of name, type from above definition plus values field read from device.


