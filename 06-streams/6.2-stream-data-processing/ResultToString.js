import { Transform } from 'stream';

export class ResultToString extends Transform {
  constructor(options = {}) {
    options.objectMode = true
    super(options)
    this.label = options.label || '';
  }

  _transform(arr, enc, cb) {
    let text = `\n${this.label}\n`;
    for (const entry of arr) {
      text = text + `${entry[0]}: ${entry[1]}\n`;
    }
    this.push(text);
    cb();
  }
}