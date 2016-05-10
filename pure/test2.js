'use strict'

let Worker = require('./worker.js');

let worker = new Worker('tcp://localhost:5671');



worker.addTask('task1', {
	p: 1
});
