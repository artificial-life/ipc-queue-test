'use strict'

var zmq = require('zmq');
var worker = zmq.socket('dealer');

worker.identity = 'worker-' + process.pid;

worker.connect('tcp://localhost:5671');
let message = {
  "type": "ready",
  "data": ["task1", "task2"]
};

worker.send(['', JSON.stringify(message)]);

setTimeout(() => {
  worker.send(['', JSON.stringify({
    type: 'addTask',
    data: {
      params: 1,
      taskname: 'task1'
    }
  })]);
}, 3000);

worker.on('message', (a, b, c) => {
  console.log(a && a.toString('utf8'));
  console.log(b && b.toString('utf8'));
  console.log(c && c.toString('utf8'));
})