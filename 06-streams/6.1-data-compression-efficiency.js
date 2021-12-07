/*
6.1 Data compression efficiency: Write a command-line script that takes a
file as input and compresses it using the different algorithms available in the
zlib module (Brotli, Deflate, Gzip). You want to produce a summary table
that compares the algorithm's compression time and compression efficiency
on the given file. Hint: This could be a good use case for the fork pattern, but
remember that we made some important performance considerations when
we discussed it earlier in this chapter.
*/

import { PassThrough, pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliCompress, createGzip, createDeflate } from 'zlib';
import path from 'path';
import { hrtime } from 'process';

class Profiler {
  constructor(label) {
    this.label = label
  }
  start = () => {
    this.startTime = hrtime.bigint();
  }
  end = () => {
    const endTime = hrtime.bigint();
    const diff = endTime - this.startTime;
    console.log(`${this.label} took ${diff / BigInt(1000000)} ms`);
    return diff;
  }
}

const sourceFilePath = process.argv[2];
const destinationPath = path.dirname(sourceFilePath);

const compress = (algoritm) => {
  let label;
  let createCompressStream;
  if (algoritm === 'gzip') {
    [label, createCompressStream] = ['Gzip', createGzip];
  } else if (algoritm === 'brotli') {
    [label, createCompressStream] = ['Brotli', createBrotliCompress];
  } else if (algoritm === 'deflate') {
    [label, createCompressStream] = ['Deflate', createDeflate];
  } else {
    throw new Error('Invalid algorithm', algoritm);
  }
  const profiler = new Profiler(label);

  const readStream = createReadStream(sourceFilePath);
  const compressStream = createCompressStream();
  const writeStream = createWriteStream(path.join(destinationPath, `book${algoritm}.gz`));

  let size = 0;
  const passThrough = new PassThrough();
  passThrough.on('data', (chunk) => {
    size += chunk.length;
  })
  const cb = (err) => {
    if (err) throw err;
    console.log('====================================')
    profiler.end();
    console.log(`Total byte size is ${size}`);
  }

  profiler.start();
  pipeline(readStream, compressStream, passThrough, writeStream, cb);
}

// Algorithms data compression test should be done isolated
// In fork mode slowest algorithm slows down others
compress('gzip');
compress('brotli');
compress('deflate');

/* Sample output
====================================
Deflate took 288 ms
Total byte size is 4540894
====================================
Gzip took 295 ms
Total byte size is 4540906
====================================
Brotli took 12788 ms
Total byte size is 4208085
*/