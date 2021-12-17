import { Buffer } from 'buffer';

function createLazyBuffer(size) {
  let actualBuffer = null;

  // use {} as a placeholder
  return new Proxy({}, {
    get: (target, prop) => {
      if (actualBuffer) {
        return actualBuffer[prop].bind(actualBuffer);
      }

      if (prop !== 'write') {
        // since Buffer has only method properties
        return () => {
          throw new Error(`${prop} method cannot be called. Please write to buffer first`);
        }
      }

      // If it's first write
      actualBuffer = Buffer.allocUnsafe(size);
      return (data) => {
        actualBuffer.write(data);
      }
    },
  });
}

// TESTING
const buffer = createLazyBuffer(20);

try {
  console.log('Log buffer:', buffer.toString()); // throws an error
} catch(e) {
  console.error('Error', e);
}

buffer.write('Hello to buffer');

console.log('Log buffer:', buffer.toString()); // success