import net from 'net';
import { createWriteStream, write } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
let writeStream;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    // first chunk is filename
    // ideally fixed byte length should be allocated
    if (!writeStream) {
      const file = data.toString();
      writeStream = createWriteStream(join(__dirname, file));
      console.log('Started accepting file', file);
      return;
    }

    writeStream.write(data);
  });

  socket.on('close', () => {
    writeStream.destroy();
    writeStream = null;
    console.log('closed')
  })

  socket.on('error', (e) => {
    console.log('Error', e)
  })
})

server.listen(3000);
