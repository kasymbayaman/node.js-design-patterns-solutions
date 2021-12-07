import { Transform } from 'stream';

export class SortAndLimit extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);

    this.sortDirection = options.sortDirection || 'desc';
    this.limit = options.limit;
  }

  _transform(arr, enc, cb) {
    try {
      arr.sort((a, b) => this.sortDirection === 'desc' ? b[1] - a[1] : a[1] - b[1]);
      const result = this.limit ? arr.slice(0, this.limit) : arr;
      this.push(result);
      cb();
    } catch (e) {
      cb(e);
    }
  }
}
