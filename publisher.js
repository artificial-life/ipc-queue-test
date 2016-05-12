// Beware if pub is started before a subcriber listening, it just goes into /dev/null space
'use strict'
var arg = process.argv[2];
console.log(arg);
var zmq = require('zmq');
var sock = zmq.socket('pub');

// Instead of binding our pub socket, we connect to the PUB -> XSUB
sock.connect('tcp://127.0.0.1:5556');
let event = {
	name: 'wololo',
	data: {
		p: 'payload'
	}
};
console.log('sending', JSON.stringify(event));
sock.send(`${arg} ${JSON.stringify(event)}`);
