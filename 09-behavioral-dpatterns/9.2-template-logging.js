import chalk from 'chalk';
import fs from 'fs';

class LogTemplate {
  debug(log) {
    throw Error('Please, use concrete implementation');
  }

  warn(log) {
    throw Error('Please, use concrete implementation');
  }

  info(log) {
    throw Error('Please, use concrete implementation');
  }

  error(log) {
    throw Error('Please, use concrete implementation');
  }
}

class ConsoleLog extends LogTemplate {
  debug(msg) {
    const log = `${chalk.cyan('DEBUG')} ${msg}`;
    console.debug(log);
  }

  warn(msg) {
    const log = `${chalk.blue('WARN')} ${msg}`;
    console.warn(log);
  }

  info(msg) {
    const log = `${chalk.green('INFO')} ${msg}`;
    console.info(log);
  }

  error(msg) {
    const log = `${chalk.red('ERROR')} ${msg}`;
    console.error(log);
  }
}

class FileLog extends LogTemplate {
  constructor(filePath) {
    super();
    this.filePath = filePath;
  }

  _writeLine(msg) {
    fs.appendFileSync(this.filePath, msg);
  }

  debug(msg) {
    this._writeLine(`DEBUG ${msg}\n`);
  }

  warn(msg) {
    this._writeLine(`WARN ${msg}\n`);
  }

  info(msg) {
    this._writeLine(`INFO ${msg}\n`);
  }

  error(msg) {
    this._writeLine(`ERROR ${msg}\n`);
  }
}

// TESTING
const logFile = new FileLog('logs.txt');

logFile.error('Cannot read property of undefined');
logFile.warn('Package is deprecated');
logFile.info('DB connected');
logFile.debug(JSON.stringify({ a: 12, b: false }));

const logConsole = new ConsoleLog();

logConsole.error('Cannot read property of undefined');
logConsole.warn('Package is deprecated');
logConsole.info('DB connected');
logConsole.debug(JSON.stringify({ a: 12, b: false }));

const logTemplate = new LogTemplate();
logTemplate.info('DB connected'); // throws an error 
