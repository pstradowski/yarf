# Yet Another RF MQTT Gateway

433 MHz sensors are cheap option to build a Smart Home solution, however it's not easy to integrate them with a system like Home Assistant or Domoticz. One can use RF Link http://www.rflink.nl/blog2/, however it requires an additional Adruino Mega which adds some € to the price and what is more important an additional power supply.

Yarf uses Arduno Nano and it's heavily based on an excellent Pimatic and its rfcontroljs library https://github.com/pimatic/rfcontroljs. Yarf uses rfcontroljs to read serial data from Arduino Nano equipped with RF receiver. Data is compared against known devices and if fits, Yarf sends it to MQTT.
Arduino Nano runs a modified version of RFControl https://github.com/pimatic/RFControl - the original one did not run on my chinese Nano clone.

# Install

No installer nor service files for systemd so far :-)
