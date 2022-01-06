import { totalSales as totalSalesRaw } from './totalSales.js'

const runningRequests = new Map()

export function totalSales (product) {
  if (runningRequests.has(product)) {
    console.log('Batching')
    return runningRequests.get(product)
  }

  const resultObserver = totalSalesRaw(product)
  runningRequests.set(product, resultObserver)
  resultObserver.on('finish', () => {
    runningRequests.delete(product)
  })

  return resultObserver
}
