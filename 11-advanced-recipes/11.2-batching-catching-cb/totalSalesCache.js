import { totalSales as totalSalesRaw } from './totalSales.js'

const CACHE_TTL = 30 * 1000 // 30 seconds TTL
const cache = new Map()

export function totalSales (product) {
  if (cache.has(product)) {
    console.log('Cache hit')
    return cache.get(product)
  }

  const resultObserver = totalSalesRaw(product)
  cache.set(product, resultObserver)
  resultObserver.on('finish', () => {
    setTimeout(() => {
      cache.delete(product)
    }, CACHE_TTL)
  })

  return resultObserver
}
