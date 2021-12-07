import { Transform } from 'stream';

export class TopCategoryPerArea extends Transform {
  constructor(options = {}) {
    options.objectMode = true
    super(options)
    this.countCategoriesByArea = {};
  }

  _transform(row, enc, cb) {
    if (!row || row.year === 'year') return cb(); // skip header
    try {
      const area = this.countCategoriesByArea[row.borough];
      if (area) {
        if (!area[row.major_category]) area[row.major_category] = 0;
        area[row.major_category] += Number(row.value);
      } else {
        this.countCategoriesByArea[row.borough] = {
          [row.major_category]: Number(row.value),
        }
      }
      cb();
    } catch (e) {
      cb(e);
    }
  }

  _flush(cb) {
    try {
      const res = Object.entries(this.countCategoriesByArea).map(([key, val]) => {
        const maxVal = Object.entries(val).sort(([, a], [, b]) => b - a)[0];
        return [`${key}, ${maxVal[0]}`, maxVal[1]]
      });
  
      this.push(res);
      cb();
    } catch (e) {
      cb(e);
    }
  }
}