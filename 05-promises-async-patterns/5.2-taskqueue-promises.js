/* Migrate the TaskQueue class internals from
promises to async/await where possible. Hint: you won't be able to use
async/await everywhere.
*/

export class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  // cannot be migrated to async because of error handling issues
  runTask(task) {
    return new Promise((resolve, reject) => {
      this.queue.push(() => {
        return task().then(resolve, reject)
      })

      process.nextTick(this.next.bind(this))
    })
  }

  async next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      this.running++
      try {
        await task();
      } finally {
        this.running--
        this.next()
      }
    }
  }
}

const MAX_CONCURRENCY = 4;
const queue = new TaskQueue(MAX_CONCURRENCY);

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