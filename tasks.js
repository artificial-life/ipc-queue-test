var zmq = require('zmq'),
  sock = zmq.socket('push');

sock.bindSync('tcp://127.0.0.1:3000');
console.log('Producer bound to port 3000');

var int = setInterval(function() {
  // console.log('sending work');
  sock.send('some work');
}, 1);

// worker.js
var seck = zmq.socket('pull');

seck.connect('tcp://127.0.0.1:3000');
console.log('Worker connected to port 3000');
var counter = 0;

seck.on('message', function(msg) {
  counter += 1;
  // console.log('work: %s', msg.toString());
});


setTimeout(function() {
  clearInterval(int);
  console.log(counter);
}, 10000);