import chalk from 'chalk';
import fs from 'fs';

class LogContext {
  constructor(logStrategy) {
    this.logStrategy = logStrategy;
  }

  debug(log) {
    this.logStrategy.debug(log);
  }

  warn(log) {
    this.logStrategy.warn(log);
  }

  info(log) {
    this.logStrategy.info(log);
  }

  error(log) {
    this.logStrategy.error(log);
  }
}

class ConsoleStrategy {
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

class FileStrategy {
  constructor(filePath) {
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

const consoleStrategy = new ConsoleStrategy();
const fileStrategy = new FileStrategy('logs.txt');

const logFile = new LogContext(fileStrategy);
const logConsole = new LogContext(consoleStrategy);

logFile.error('Cannot read property of undefined');
logFile.warn('Package is deprecated');
logFile.info('DB connected');
logFile.debug(JSON.stringify({ a: 12, b: false }));

logConsole.error('Cannot read property of undefined');
logConsole.warn('Package is deprecated');
logConsole.info('DB connected');
logConsole.debug(JSON.stringify({ a: 12, b: false }));
