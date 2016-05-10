var zmq = require('zmq');

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomString() {
  var source = 'abcdefghijklmnopqrstuvwxyz',
    target = [];

  for (var i = 0; i < 20; i++) {
    target.push(source[randomBetween(0, source.length)]);
  }
  return target.join('');
}

function workerTask() {
  var dealer = zmq.socket('dealer');
  dealer.identity = randomString();

  dealer.connect('tcp://localhost:5671');

  var total = 0;

  var sendMessage = function() {
    dealer.send(['', 'Hi Boss']);
  };

  //  Get workload from broker, until finished
  dealer.on('message', function onMessage() {
    var args = Array.apply(null, arguments);
    var workload = args[1].toString('utf8');
    console.log(workload);

    if (workload === 'Fired!') {
      console.log('Completed: ' + total + ' tasks (' + dealer.identity + ')');
      dealer.removeListener('message', onMessage);
      dealer.close();
      return;
    }
    total++;
    sendMessage();
  });

  //  Tell the broker we're ready for work
  dealer.send(['', 'Worker ready']);
}

workerTask()