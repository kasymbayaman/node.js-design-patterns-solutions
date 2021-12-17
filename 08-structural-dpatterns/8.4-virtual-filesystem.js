import { resolve } from 'path'

// In-Memory Cache
class Cache {
  constructor() {
    this.cache = new Map();
  }

  async putEntry(key, value) {
    return Promise.resolve(this.cache.set(key, value));
  }

  async getValue(key, options, callback) {
    const val = await Promise.resolve(this.cache.get(key));
    if (!val) {
      const err = new Error(`ENOENT, open "${key}"`)
      err.code = 'ENOENT'
      err.errno = 34
      err.path = key
      throw err;
    }
    return val;
  }
}

// FS Adapter
const createFSAdapter = cache => ({
  readFile(filename, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    } else if (typeof options === 'string') {
      options = { encoding: options }
    }

    cache.getValue(resolve(filename))
      .then(val => callback(null, val))
      .catch(callback);
  },

  writeFile(filename, contents, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = {}
    } else if (typeof options === 'string') {
      options = { encoding: options }
    }

    cache.putEntry(resolve(filename), contents)
      .then((res) => callback(null, res))
      .catch(callback)
  }
})

const cache = new Cache();
const fs = createFSAdapter(cache)

fs.writeFile('file.txt', 'Hello!', () => {
  fs.readFile('file.txt', { encoding: 'utf8' }, (err, res) => {
    if (err) {
      return console.error(err)
    }
    console.log('Read result', res)
  })
})

// try to read a missing file
fs.readFile('missing.txt', { encoding: 'utf8' }, (err, res) => {
  console.error(err)
})
