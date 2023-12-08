const fs = require("node:fs/promises");

// reading & writing all the content in the file
(async () => {
  const fileHandleRead = await fs.open("source.txt", "r");
  const fileHandleWrite = await fs.open("destination.txt", "w");

  const streamRead = fileHandleRead.createReadStream({ highWaterMark: 64 * 1024});
  const streamWrite = fileHandleWrite.createWriteStream();

  streamRead.on("data", (chunk) => {
    // if the buffer is full, and we need to wait for it to drain before the next batch
    if (!streamWrite.write(chunk)) {
        streamRead.pause();
    }
  });

  streamWrite.on("drain", () => {
    streamRead.resume();
  })
})();
