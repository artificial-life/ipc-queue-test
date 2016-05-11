'use strict'
let queue = require('global-queue');

let Worker = require('./worker.js');

let worker = new Worker('tcp://localhost:5671');

queue.addAdapter('task', worker);
queue.listenTask('other', (d) => {
	return 'other'
})
queue.addTask('task1', {
	p: 1
}).then((d) => console.log(process.pid, d));

queue.addTask('other', {
	p: 1
}).then((d) => console.log(process.pid, d));
