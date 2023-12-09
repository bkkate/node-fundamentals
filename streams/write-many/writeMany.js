const fs = require('node:fs/promises');

/*
using PROMISE:
    Execution time: 8s
    CPU usage: 100% (1 core)
    Memory Usage: 50MB
*/
// calling the async function right away
(async() => {
    console.time("writeMany");
    const fileHandle = fs.open("test.txt", "w");

    for (let i=0; i<1000000; i++) {
        (await fileHandle).write(` ${i} `);
    }
    console.timeEnd("writeMany");
})();

/*
using CALLBACK: much faster in time than promise
note: if you use async write, memory usage will be super high (adding too many events to call)
      if you use sync (writeSync), memory usage will be fine
    Execution time: 1.8s
    CPU usage: 100% (1 core)
    Memory Usage: 50MB
*/
const fs = require('node:fs');
(async() => {
    console.time("writeMany");
   
    fs.open("test.txt", "w", (err, fd) => {
        for (let i=0; i < 1000000; i++) {
            fs.writeSync(fd, `${i}`);
        }
    })
    console.timeEnd("writeMany");
})();

/*
using STREAMS: FASTEST!!! way way faster; BUT, uses a LOT of memory
    Execution time: 270ms
    CPU usage: 100% (1 core)
    Memory Usage: ~2000 MB 
*/
// NOTE: NOT GOOD PRACTICE! DON'T DO IT THIS WAY! not memory efficient
const fs = require('node:fs');
(async() => {
    console.time("writeMany");
    
    const fileHandle = await fs.open("test.txt", 'w');
    
    const stream = fileHandle.createWriteStream();
   
    for (let i=0; i < 1000000; i++) {
        const buff = Buffer.from(`${i}`, "utf-8");
        stream.write(buff);
    }

    console.timeEnd("writeMany");
})();

