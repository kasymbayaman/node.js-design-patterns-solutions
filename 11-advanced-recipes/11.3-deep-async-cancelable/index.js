import { asyncRoutine } from './asyncRoutine.js'
import { createAsyncCancelable } from './createAsyncCancelable.js'
import { CancelError } from './cancelError.js'

const cancelableNested = createAsyncCancelable(function * () {
  const resA = yield asyncRoutine('B:1')
  console.log(resA)
  const resB = yield asyncRoutine('B:2')
  console.log(resB)
  const resC = yield asyncRoutine('B:3')
  console.log(resC)
})


const cancelable = createAsyncCancelable(function * () {
  const resA = yield asyncRoutine('A')
  console.log(resA)
  // yielding whole iterator
  const resB = yield* cancelableNested().generatorObject;
  console.log(resB)
  const resC = yield asyncRoutine('C')
  console.log(resC)
})

const { createPromise, cancel } = cancelable()
createPromise().catch(err => {
  if (err instanceof CancelError) {
    console.log('Function canceled')
  } else {
    console.error(err)
  }
})

setTimeout(() => {
  cancel()
}, 200)

/* Outputs:

Starting async routine A
Async routine A completed
Async routine A result
Starting async routine B:1
Async routine B:1 completed
Async routine B:1 result
Starting async routine B:2
Function canceled
Async routine B:2 completed
*/