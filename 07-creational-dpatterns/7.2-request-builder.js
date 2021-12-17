import { request } from 'https';
import { URL } from 'url';

class BuildRequest {
  constructor() {
    this.body = '';
  }

  setMethod(method) {
    if (!method) {
      throw new Error('Provided wrong http method');
    }

    this.method = method;
    return this;
  }

  setUrl(urlStr) {
    this.url = new URL(urlStr);
    return this;
  }

  setQueryParams(query) {
    Object.entries(query).forEach(([key, val]) => this.url.searchParams.set(key, val));
    return this;
  }

  setHeaders(headers) {
    this.headers = headers;
    return this;
  }

  setBody(body) {
    this.body = JSON.stringify(body) || '';
    return this;
  }

  validateRequestParams() {
    return this.url && this.method;
  }
  setPort(port) {
    this.port = port;
    return this;
  }

  invoke() {
    const options = {
      host: this.url.host,
      path: `${this.url.pathname}?${this.url.searchParams.toString()}`,
      method: this.method,
      headers: {
        Accept: 'application/json',
        ...this.headers,
      }
    };

    if (!this.validateRequestParams()) throw Error('Please provide at least method and url');

    return new Promise((resolve, reject) => {
      const req = request(options, (res) => {
        let resAccum = '';
        res.on('data', (chunk) => {
          resAccum += chunk.toString();
        });
        res.on('end', () => resolve(JSON.parse(resAccum)));
        res.on('error', reject);
      });

      req.on('error', reject);
      req.write(this.body);
      req.end();
    })
  }
}

new BuildRequest()
  .setMethod('GET')
  .setUrl('https://api.urbandictionary.com/v0/define')
  .setQueryParams({ term: 'wat' })
  .invoke()
  .then((res) => {
    console.log('REQUEST finished', res);
  })

