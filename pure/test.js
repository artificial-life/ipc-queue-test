'use strict'
let Worker = require('./worker.js');
let worker = new Worker('tcp://localhost:5671');

let queue = require('global-queue');

queue.addAdapter('task', worker);
queue.listenTask('task1', (d) => {
	return 'External task result';
});
