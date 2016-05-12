// Beware if pub is started before a subcriber listening, it just goes into /dev/null space
'use strict'
var zmq = require('zmq');



class ZMQPublisher {
  constructor(uri) {
    this.sock = zmq.socket('pub');
    this.sock.connect(uri);
  }
  emit(event_name, data) {
    this.sock.send(`${event_name} ${JSON.stringify(data)}`);
  }
}

module.exports = ZMQPublisher;

let arg = process.argv[2];
let pub = new ZMQPublisher('tcp://127.0.0.1:5556');
console.log(arg);
pub.emit(arg, 'weeeee')