import axios from 'axios';

const cache = {};

const axiosWithCache = new Proxy(axios, {
  get: (target, prop) => {
    if (prop !== 'get') return target[prop];
    
    return async (url, config) => {
      if (cache[url]) {
        console.log(`Get request ${url} is found in cache`);
        return Promise.resolve(cache[url]);
      }

      const { data } = await target.get(url, config);
      // request object is too big to store
      cache[url] = { data };
      return cache[url];
    }
  }
})

// TESTING
console.log(await axiosWithCache.get('https://api.urbandictionary.com/v0/define?term=wat', {}));
console.log(await axiosWithCache.get('https://api.urbandictionary.com/v0/define?term=help', {}));
console.log(await axiosWithCache.get('https://api.urbandictionary.com/v0/define?term=wat', {}));

