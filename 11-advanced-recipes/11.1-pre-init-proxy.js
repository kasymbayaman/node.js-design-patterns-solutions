import EventEmitter from 'events';

function createProxyWithPreInitQueues(target, options) {
  const { isInitProp, initEventName, augmentMethods } = options;

  let queue = [];
  const proxy = new Proxy(target, {
    get: (target, property) => {
      // if no need to queue or target initilized
      if (!augmentMethods.includes(property) || target[isInitProp]) {
        return target[property];
      }

      return (...args) => new Promise((resolve, reject) => {
        console.log('Queued', property);
        queue.push(() => target[property](...args).then(resolve, reject));
      })
      
    }
  });

  target.on(initEventName, async () => {
    console.log(`${initEventName} event fired. Executing queued operations....`);
    for (const op of queue) {
      await op();
    }
    console.log('Done executing queued operations');
    queue = [];
  });

  return proxy;
}

class DB extends EventEmitter {
  connect(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.emit('connect');
        this.connected = true;
        resolve();
      }, 2000);
    })
  }

  disconnect() {
    this.connected = false;
  }

  async find(filter, select) {
    return Promise.resolve({ filter, select });
  }

  async findById(id, select) {
    return Promise.resolve({ id, select });
  }

  async updateOne(id, doc) {
    return Promise.resolve({ id, doc });
  }

  async checkStatus() {
    return Promise.resolve(this.connected ? 'CONNECTED' : 'NOT CONNECTED');
  }
}

// TESTING

const db = new DB();

const dbPreInitQueue = createProxyWithPreInitQueues(
  db,
  {
    isInitProp: 'connected',
    initEventName: 'connect',
    augmentMethods: ['find', 'findById', 'updateOne'],
  });



  dbPreInitQueue.find({ name: 1 }, { _id: 0 }).then(console.log);
  dbPreInitQueue.findById('ID2', { _id: 0 }).then(console.log);
  dbPreInitQueue.find({ name: 3 }, { _id: 0 }).then(console.log);
  dbPreInitQueue.updateOne('ID4', { prop: 0 }).then(console.log);

  dbPreInitQueue.checkStatus().then(console.log);

  await dbPreInitQueue.connect('url');


  dbPreInitQueue.find({ name: 6 }, { _id: 2 }).then(console.log);
  dbPreInitQueue.updateOne('ID8', { prop: 3 }).then(console.log);

  dbPreInitQueue.checkStatus().then(console.log);

