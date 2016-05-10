'use strict';

var cluster = require('cluster'),
  zmq = require('zmq');

const NBR_WORKERS = 1;

function main() {
  var broker = zmq.socket('router');
  broker.bindSync('tcp://*:5671');

  var endTime = Date.now() + 50,
    workersFired = 0;

  broker.on('message', function() {
    var args = Array.apply(null, arguments),
      identity = args[0],
      data = args[2],
      now = Date.now();
    console.log('identity', identity.toString('utf8'));
    console.log('worker said', data.toString('utf8'));

    if (now < endTime) {
      broker.send([identity, '', 'Work harder']);
    } else {
      broker.send([identity, '', 'Fired!']);
      workersFired++;
      if (workersFired === NBR_WORKERS) {
        setImmediate(function() {
          broker.close();
        });
      }
    }
  });


}

main();