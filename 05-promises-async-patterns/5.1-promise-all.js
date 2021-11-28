/*
Implement your own version of Promise.
all() leveraging promises, async/await, or a combination of the two.
The function must be functionally equivalent to its original counterpart.
*/

// 1. Promise.all using async await
async function promiseAll(promises) {
  try {
    for (const promise of promises) {
      await promise;
    }
  } catch (e) {
    console.log('Error in promiseAll', e);
  }
}

//  2. Promise.all using promises
async function promiseAll2(promises) {
  return new Promise((resolve, reject) => {

    let resolvedPromises = 0;
    promises.forEach((promise) => {

      promise.then(() => {
        resolvedPromises++;
        if (resolvedPromises === promises.length) resolve();
      }, reject);

    })
  });
}



// testing
function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Resolved ${ms}`);
      resolve('Resolved successfully');
    }, ms);
  });
}

promiseAll2([wait(150), wait(399), wait(1500), wait(400), wait(5000), wait(5000)]).then(() => {
  console.log('ALL promises are resolved');
})