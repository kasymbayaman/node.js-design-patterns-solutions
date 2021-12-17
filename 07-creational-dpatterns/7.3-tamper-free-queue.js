class Queue {
  constructor(executor) {
    const queue = [];
    let resolveQueue = [];

    const enqueue = (item) => {
      queue.push(item);
      if (resolveQueue.length) {
        const resolve = resolveQueue.shift();
        resolve(queue.shift());
      }
    }

    executor(enqueue);

    this.dequeue = () => {
      if (queue.length) {
        const item = queue.shift();
        if (resolveQueue.length) {
          const resolve = resolveQueue.shift();
        resolve(queue.shift());
        }
        return Promise.resolve(item);
      }

      return new Promise((resolve, reject) => {
        resolveQueue.push(resolve);
      });
    }
  }
}


const queue = new Queue((enqueue) => {
  enqueue(1);
  enqueue(3);

  setTimeout(() => enqueue(6), 2000);
  setTimeout(() => enqueue(3), 0);
})

console.log(await queue.dequeue());
console.log(await queue.dequeue());
console.log(await queue.dequeue());
console.log(await queue.dequeue());

