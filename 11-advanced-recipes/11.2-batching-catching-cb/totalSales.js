import level from 'level';
import sublevel from 'subleveldown';
import { ResultObserver } from './ResultObserver.js';

const db = level('example-db')
const salesDb = sublevel(db, 'sales', { valueEncoding: 'json' })

export function totalSales(product) {
  const now = Date.now();
  let sum = 0;

  const dbValueStream = salesDb.createValueStream();

  dbValueStream.on('data', (transaction) => {
    if (!product || transaction.product === product) {
      sum += transaction.amount
    }
  });

  const topSalesOberver = new ResultObserver();

  dbValueStream.on('end', () => {
    console.log(`totalSales() took: ${Date.now() - now}ms`)
    topSalesOberver.finishOperation(sum);
  });

  return topSalesOberver;
}
