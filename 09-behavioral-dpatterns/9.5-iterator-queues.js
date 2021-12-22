class AsyncQueue {
  constructor() {
    this._queue = [];
  }

  enqueue(task) {
    this._queue.push(task);
  }

  async* [Symbol.asyncIterator]() {
    while (this._queue.length) {
      const task = this._queue.shift();
      yield await task();
    }
  }
}

// Testing

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Resolved ${ms}`);
    }, ms);
  });
}

function taskCreator (ms) {
  return async function () {
    return await wait(ms);
  }
}

const queue = new AsyncQueue();

[taskCreator(10), taskCreator(3000), taskCreator(1000), taskCreator(500), taskCreator(3000)].forEach((task) => {
  queue.enqueue(task);
})

for await (const taskResult of queue) {
  console.log(taskResult);
}
