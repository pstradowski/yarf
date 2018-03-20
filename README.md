# Yet Another RF MQTT Gateway

433 MHz sensors are cheap option to build a Smart Home solution, however it's not easy to integrate them with a system like Home Assistant or Domoticz. One can use RF Link http://www.rflink.nl/blog2/, however it requires an additional Adruino Mega which adds some € to the price and what is more important for me, an additional power supply.

Yarf uses Arduno Nano and it's heavily based on excellent Pimatic and its rfcontroljs library https://github.com/pimatic/rfcontroljs. Yarf uses rfcontroljs to read serial data from Arduino Nano equipped with RF receiver. Data is compared against known devices and if fits, Yarf sends it to MQTT. In other words: Yarf is just a wrapper for rfcontroljs :-)

Arduino Nano runs an example program from RFControl https://github.com/pimatic/RFControl - official one did not run on my chinese Nano clone.

# Prerequisities

1. Nodejs installed on a system with a MQTT connection. I use Raspi  with Raspbian/Armbian
2. An Arduino Nano with RF receiver. I use one based on SRX882, very good list of available devices can be found here: http://www.rflink.nl/blog2/wiring

# Arduino sketch



# Install

Setup script installs yarf and load necessary libraries. Systemd unit file yarf.service is installed and enabled at boot.

# Configuration files

In /etc/yarf we have 2 configuration files:
* config.js - MQTT configuration and serial port
* devices.json - devices database

# Adding your devices to devices.json

1. Stop yarf.service: sudo systemctl stop yarf.service
2. Run yarf manually: node /srv/yarf/gateway.js
3. Yarf will print newly discovered devices to stdout. There will be some alternative matches proposed by rfcontroljs.

