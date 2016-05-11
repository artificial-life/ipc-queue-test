'use strict'

let queue = require('global-queue');

let Worker = require('./worker.js');

let worker = new Worker('tcp://localhost:5671');

queue.addAdapter('task', worker);
queue.listenTask('task1', (d) => {
	return 'gotcha!';
});
