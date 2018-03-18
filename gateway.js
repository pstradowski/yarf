var config = require('/etc/yarf/config.js')
var mqtt = require('mqtt')
var mqtt_client  = mqtt.connect("mqtt://" + config.mqtt.host)
var isSubset=require('is-subset');
var devices = require('/etc/yarf/devices.json');

const controller = require('rfcontroljs')




function check_rf(data){
    var result = null
    for (var i in data) {
        for (var j in devices) {
            if (isSubset(data[i], devices[j].ident)){
                result = {"name": devices[j].name,
                          "type": devices[j].type,  
                          "values": data[i].values}
                result = JSON.stringify(result) 
            
            }
        }
        
    }
    return(result)
}

function decode_RF(line){
	result = controller.prepareCompressedPulses(line)
	decoded = controller.decodePulses(result.pulseLengths, result.pulses)
	if (decoded.length > 0){
        console.log(JSON.stringify(decoded, null, 4))
        measurement = check_rf(decoded);
        if (measurement != null) {
            mqtt_client.publish(config.mqtt.topic, measurement)
            
        }        
		
		
	}
}	

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const port = new SerialPort(config.serialport, { baudRate: 9600});
const parser = port.pipe(new Readline({ delimiter: '\n' }));
parser.on('data', decode_RF);
