/*
5.3 Producer-consumer with promises: Update the TaskQueuePC class
internal methods so that they use just promises, removing any use of the
async/await syntax. Hint: the infinite loop must become an asynchronous
recursion. Beware of the recursive Promise resolution memory leak!
*/

export class TaskQueuePC {
  constructor(concurrency) {
    this.taskQueue = [];
    this.consumerQueue = [];

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer();
    }
  }

  async consumer() {
  // ===== changed lines
    return new Promise((resolve, reject) => {
      const consumeTask = () => {
        this.getNextTask()
        .then(task => task())
        .then(() => consumeTask())
        .catch(error => reject(error));
      }

      consumeTask();
    });
    // ======
  }

  async getNextTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift());
      }

      this.consumerQueue.push(resolve);
    })
  }

  async runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(resolve, reject);
        return taskPromise;
      }

      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift();
        consumer(taskWrapper);
      } else {
        this.taskQueue.push(taskWrapper);
      }
    })
  }

}

// === TESTING

const MAX_CONCURRENCY = 4;
const queue = new TaskQueuePC(MAX_CONCURRENCY);

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Resolved ${ms}`);
      resolve('Resolved successfully');
    }, ms);
  });
}

function taskCreator (ms) {
  return async function () {
    await wait(ms);
  }
}

[taskCreator(3000), taskCreator(3000), taskCreator(3000), taskCreator(3000), taskCreator(3000)].forEach((task) => {
  queue.runTask(task);
})