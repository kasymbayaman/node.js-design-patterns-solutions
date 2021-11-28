/*
5.4 An asynchronous map() : Implement a parallel asynchronous version
of Array.map() that supports promises and a concurrency limit. The
function should not directly leverage the TaskQueue or TaskQueuePC
classes we presented in this chapter, but it can use the underlying patterns.
The function, which we will define as mapAsync(iterable, callback,
concurrency) , will accept the following as inputs:
• An iterable , such as an array.
• A callback , which will receive as the input each item of the iterable
(exactly like in the original Array.map() ) and can return either
a Promise or a simple value.
• A concurrency , which defines how many items in the iterable can
be processed by callback in parallel at each given time.
*/

async function mapAsync(iterable, callback, concurrency) {
  // trigger calls while running operations count is less than concurrency
  // when reached concurrency do nothing
  // when all operations resolved return

  // after getting concurrency result decrement running operations
  // if (not reached) trigger calling operations

  let id = 0;
  let runningOps = 0;
  let resolvedOps = 0;
  const resultArr = [];

  return new Promise((resolve, reject) => {
    const runCallbacks = () => {
      while (runningOps < concurrency && id < iterable.length) {
        runningOps++;
        const currentOpId = id;
        callback(iterable[id]).then((result) => {
          resultArr[currentOpId] = result;
          runningOps--;
          resolvedOps++;
          runCallbacks();
        }).catch(reject);
        id++;
      }

      if (resolvedOps === iterable.length) return resolve(resultArr);
    }

    runCallbacks();
  });
}

// TESTING
function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Resolved ${ms}`);
      resolve(`Resolved ${ms}`);
    }, ms);
  });
}


const MAX_CONCURRENCY = 2;

mapAsync([1000, 3000, 500, 1500, 2000], wait, MAX_CONCURRENCY).then((res) => console.log('RESOLVED ALL', res));