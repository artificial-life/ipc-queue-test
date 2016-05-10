'use strict'

console.log('worker in');
let Worker = require('./worker.js');

let worker = new Worker('tcp://localhost:5671');

worker.listenTask('task1', (d) => {
	return 'gotcha!';
});
