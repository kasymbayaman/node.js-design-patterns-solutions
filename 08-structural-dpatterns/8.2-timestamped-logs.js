import chalk from 'chalk';

const logMethods = ['log', 'debug', 'info', 'error'];

const consoleWithTimestamp = new Proxy(console, {
  get: (target, prop) => {
    if (!logMethods.includes(prop)) return target[prop];

    return (...args) => {
      const timestamp = chalk.green(new Date().toLocaleString());
      target[prop](timestamp, ...args);
    }
  }
});

// TESTING
consoleWithTimestamp.log('Foo', 'And', 'Bar', 'Went', 'To', 'A', 'Bar');
consoleWithTimestamp.error('ERROR');