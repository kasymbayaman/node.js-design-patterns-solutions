import EventEmitter from 'events';

export class ResultObserver extends EventEmitter {
  constructor() {
    super();
    this._result = null;
    this._status = 'pending';
  }

  finishOperation(result) {
    this._result = result;
    this._status = 'finish';
    this.emit('finish', result);
  }

  isFinished() {
    return this._status === 'finish';
  }

  getResult() {
    return this._result;
  }
}