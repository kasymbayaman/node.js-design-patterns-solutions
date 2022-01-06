import { createServer } from 'http'
// import { totalSales } from './totalSales.js'
// import { totalSales } from './totalSalesBatch.js'
import { totalSales } from './totalSalesCache.js'

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const product = url.searchParams.get('product')
  console.log(`Processing query: ${url.search}`)

  const resultObserver = totalSales(product);

  // if the calculation is already finished
  if (resultObserver.isFinished()) {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    return res.end(JSON.stringify({ product, sum: resultObserver.getResult() }))
  }

  totalSales(product).on('finish', (sum) => {
    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    return res.end(JSON.stringify({ product, sum }))
  })


}).listen(8000, () => console.log('Server started'))
