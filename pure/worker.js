'use strict'

let _ = require('lodash');
let zmq = require('zmq');

class Worker {
	constructor(uri) {
		this.worker = zmq.socket('dealer');
		this.worker.identity = 'zmq-worker-' + process.pid;
		this.worker.connect(uri);
		this.worker.on('message', (...args) => this.handleMessage(args));
		this.callbacks = {
			'responseTask': (d) => this.handleResponse(d)
		};
	}
	handleResponse(d) {
		console.log('Got responseTask!', d);
	}
	makeResponse(recipient, data) {
		this.send({
			type: 'responseTask',
			body: data,
			_recipient: recipient
		});
	}
	handleMessage(args) {
		let payload = JSON.parse(args[1]);
		console.log(process.pid, 'worker payload', payload);
		let {
			taskname: taskname,
			params: params,
			_sender: sender
		} = payload;

		let cb = this.callbacks[taskname];
		let result = cb(params);

		taskname !== 'responseTask' && Promise.resolve(result).then((d) => this.makeResponse(sender, d));
	}
	send(message) {
		this.worker.send(['', JSON.stringify(message)])
	}
	addTask(taskname, params) {
		this.send({
			type: 'addTask',
			body: {
				params,
				taskname
			}
		});

		return Promise.resolve();
	}
	listenTask(taskname, callback) {
		this.send({
			type: 'listenTask',
			body: taskname
		});
		this.callbacks[taskname] = callback;
	}
}

module.exports = Worker;
//
// let worker = new Worker('tcp://localhost:5671');
//
// worker.listenTask('task1', (d) => {
// 	return 'gotcha!';
// });
// worker.listenTask('task2');
//
// worker.addTask('task1', {
// 	p: 1
// });
