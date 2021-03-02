import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function concatFiles(dest, cb, ...srcFiles) {
  const startIndex = 0;
  const initialContent = '';

  readfiles(srcFiles, startIndex, initialContent, (err, data) => {
    if (err) return cb(err);
    fs.writeFile(dest, data, cb);
  })
}

function readfiles(srcFiles, index, content, cb) {
  if (index === srcFiles.length) return cb(null, content);

  return fs.readFile(srcFiles[index], (err, data) => {
    if (err) return cb(err);
    // read next file recursively
    readfiles(srcFiles, index + 1, content + data, cb);
  });
}

// test
const srcFiles = ['file0.txt', 'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt']
.map(fileName => path.join(__dirname, fileName));
const dest = path.join(__dirname, 'result.txt');

concatFiles(dest, (err, data) => {
  if (err) return console.log('Error occured', err);
  console.log('Written to file', dest);
}, ...srcFiles)