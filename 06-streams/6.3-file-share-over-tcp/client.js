import { createReadStream } from 'fs';
import net from 'net';
import { pipeline } from 'stream';
import path from 'path';

const filePath = process.argv[2] || '/home/baiaman_dev/Documents/spider.jpg';
const filename = path.basename(filePath);

const client = net.createConnection({ port: 3000 }, () => {
  console.log('Connection listener');
})

client.on('connect', () => {
  client.write(filename);
  pipeline(createReadStream(filePath), client, (err) => {
    if (err) console.log(err);

    client.end();
  })
})