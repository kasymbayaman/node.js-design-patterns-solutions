import { Transform } from 'stream';

export class CountCrimesByParam extends Transform {
  constructor(options = {}) {
    options.objectMode = true
    super(options)
    this.param = options.param;
    this.crimesByParam = {};
  }

  _transform(row, enc, cb) {
    try {
      if (!row || row.year === 'year') return cb(); // skip header
      const paramVal = row[this.param];
      if (!this.crimesByParam[paramVal]) this.crimesByParam[paramVal] = 0;
      this.crimesByParam[paramVal] += Number(row.value);
      cb()
    } catch (e) {
      cb(e);
    }

  }

  _flush(cb) {
    try {
      this.push(Object.entries(this.crimesByParam));
      cb()
    } catch (e) {
      cb(e);
    }
  }
}