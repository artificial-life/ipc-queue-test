var arg = process.argv[2];
console.log(arg);
var zmq = require('zmq');
var sock = zmq.socket('sub');

// We subscribe to MYCHANNEL only
sock.subscribe(arg);


// We connect our sub -> XPUB channel
sock.connect('tcp://127.0.0.1:5555');

// When a message comes,
sock.on('message', function (data) {
	// data is a SlowBuffer
	// data contains : 'MYCHANNEL' + aspace + 'here is the info'
	console.log(data.toString());
});
