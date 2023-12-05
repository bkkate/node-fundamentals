const fs = require("fs/promises");

(async () => {
  const commandFileHandler = await fs.open("./command.txt", "r");

  // adding an event
  commandFileHandler.on("change", async () => {
    // setting variables for parameters for reading file method:
    // get the size of our file
    const size = (await commandFileHandler.stat()).size;
    // allocate our buffer with the size of the file
    const buff = Buffer.alloc(size);
    // the location at which we want to start filling our buffer (should be 0)
    const offset = 0;
    // how many bytes we want to read
    const length = buff.byteLength;
    // the position that we want to start reading the file from
    const position = 0; // should always be 0 (start from the first character!)

    // allocating a buffer of exact size, and reading the whole content (from beg to end)
    const content = await commandFileHandler.read(
      buff,
      offset,
      length,
      position
    );
    console.log(content);
  });

  const watcher = fs.watch("./command.txt");

  /* async iterator (for await.. of) iterates over async iterable objects, 
    only in contexts where await can be used */
  for await (const event of watcher) {
    if (event.eventType == "change") {
      commandFileHandler.emit("change");
    }
  }
})();
