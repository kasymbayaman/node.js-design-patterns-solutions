import chalk from 'chalk';
import fs from 'fs/promises';

// Middleware manager
class LogManager {
  constructor() {
    this._middlewares = [];
  }

  use(middleware) {
    if (typeof middleware !== 'function') {
      throw new Error('Invalid type of middleware. Should be a function');
    }

    this._middlewares.push(middleware);
  }

  async log(message) {
    let result = message;
    for (const middleware of this._middlewares) {
      result = await middleware(result);
    }
  }
}

// Middlewares
const createColorizeMiddleware = ({ color }) => {
  if (!chalk[color]) {
    throw new Error('Color is unavailable, pick another', color);
  }

  return message => chalk[color](message);
};

const prependTimestampMiddleware = (message) => `${new Date().toLocaleString()} ${message}`;

const createWriteToFileMiddleware = ({ path }) => async (message) => {
  await fs.appendFile(path, message + '\n');
  return message;
}


// Usage
const logger = new LogManager();
logger.use(createColorizeMiddleware({ color: 'green' }));
logger.use(prependTimestampMiddleware);
logger.use(createWriteToFileMiddleware({ path: 'logs.txt' }));
logger.use(console.log);

logger.log('Hello World! Hope you get better'); // logs colored message with timestamp, writes to file
