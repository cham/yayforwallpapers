const cluster = require('cluster');
const config = require('../config');
const os = require('os');

const startInitial = () => {
  let numToBoot = os.cpus().length;
  let numBooted = 0;

  if (process.env.NODE_ENV === 'development') {
    numToBoot = 1;
  }

  function increment() {
    numBooted += 1;

    if (numBooted === numToBoot) {
      console.info(`${numToBoot} workers listening.`);
    }
  }

  for (let i = 0; i < numToBoot; i += 1) {
    cluster.fork().once('listening', increment);
  }
};

const handleExit = (worker) => {
  console.error(`Worker died. PID: ${worker.process.pid}`);

  const newWorker = cluster.fork().once('listening', () => {
    console.info(`Replacement worker spawned. PID: ${newWorker.process.pid}`);
  });
};

// Restart dead workers
cluster.on('exit', handleExit);

config.required();
startInitial();
