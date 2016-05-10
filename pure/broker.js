'use strict';

let zmq = require('zmq');
let _ = require('lodash');

let taskmap = {};
let cursors = {};

class Broker {
  constructor(uri) {
    this.broker = zmq.socket('router');
    console.log('Broker on %s', uri);
    this.broker.bindSync(uri);
    this.broker.on('message', (...args) => this.handleMessage(args));
  }
  handleMessage(args) {
    let identity = args[0].toString('utf8');
    let payload = JSON.parse(args[2].toString('utf8'));
    this[payload.type](identity, payload.data);
  }
  ready(identity, tasks) {
    _.forEach(tasks, task => {
      if (taskmap[task]) {
        taskmap[task].push(identity);
        return;
      }
      taskmap[task] = [identity];
    });

    console.log('ready', taskmap);
  }
  addTask(identity, data) {
    let taskname = data.taskname;
    let params = data.params;
    let free_worker = this.getWorkerForTask(taskname)

    console.log(free_worker);
  }
  getWorkerForTask(taskname) {
    let cursor = cursors[taskname] ? (cursors[taskname] + 1) % cursors[taskname].length : 0;

    return taskmap[taskname][cursor];
  }
}


var broker = new Broker('tcp://*:5671');