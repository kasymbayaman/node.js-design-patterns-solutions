import { EventEmitter } from 'events';

// 1 main ticker function
function ticker(timer, callback) {
  const eventEmitter = new EventEmitter();
  let tick = 0;
  const TICK_INTERVAL = 50;

  const tickStart = new Date();

  const emitTick = () => {
    emitter.emit('tick', tick);
    tick++;
  }

  setTimeout(function recursiveTimeout() {
    // if timer has passed, terminate and return result
    if (new Date() - tickStart >= timer) {
      return callback(null, tick);
    }

    emitTick();

    // call recursively for next emit
    setTimeout(recursiveTimeout, TICK_INTERVAL);
  }, TICK_INTERVAL);

  return eventEmitter;
}

// 2 initialize ticker event emitter
const emitter = ticker(1200, (err, tick) => {
  if (err) {
    return console.log('Callback error', err);
  }
  console.log(`Totally ticked ${tick} times`);
});

// 3 add listeners
emitter
.on('error', err => console.log('Emitted error', err))
.on('tick', (result) => console.log('Tick #', result));