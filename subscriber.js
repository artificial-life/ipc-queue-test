'use strict'

var zmq = require('zmq');

class ZMQSubscriber {
  constructor(uri) {
    this.sock = zmq.socket('sub');
    this.sock.connect(uri);
    this.sock.on('message', (d) => this.handleEvent(d));
  }
  handleEvent(d) {
    let data = d.toString('utf8');
    let pos = data.indexOf(' ');
    if (-1 == pos) throw new Error('wrong event format');

    let event_name = data.slice(0, pos);
    let event_data = data.slice(pos + 1);

    this.callback && this.callback(event_name, event_data);
  }
  on(event_name, cb) {
    this.callback = cb;
    this.sock.subscribe(event_name);
  }
}

module.exports = ZMQSubscriber;


let arg = process.argv[2];
let pub = new ZMQSubscriber('tcp://127.0.0.1:5555');

pub.on(arg, (name, data) => {
  console.log(name, data);
})