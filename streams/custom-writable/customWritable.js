// for EDUCATIONAL PURPOSE ONLY: implementing our OWN writable STREAM, using the stream module (don't reinvent the wheel)
// REFER TO NODE DOCS ON HOW TO IMPLEMENT !!!

const { Writable } = require("node:stream");
const fs = require("node:fs");

// our custom writable stream (refer to node docs on how to extend Writable & requirements)
class FileWriteStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });

    this.fileName = fileName;
    this.fd = null;
    
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  /*our own implementations, with _ in front, so we don't overwrite the original methods
        by putting _ in front, Node will know that it's your own implementation of a certain method;

        Super important to call the callbacks!
    */

  // this will run after the constructor, and it'll put off calling all the other methods
  // until we call the callback function
  _construct(callback) {
    fs.open(this.fileName, "w", (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback(); // if no error was passed (i.e. no argument means it was successful)
      }
    });
  }
  _write(chunk, encoding, callback) {
    // write operation
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;

    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) {
          return callback(err);
        }
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount; // tracking how many writes we have
        callback();
      });
    } else {
      // when done, call the callback function
      callback();
    }
  }
  // this optional func will be called before the stream closes, delaying the 'finish' event until callback is called
  _final(callback) {
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) return callback(err);

      this.chunks = [];
      callback();
    });
  }

  // only happens after the _final() call
  _destroy(error, callback) {
    console.log("Number of writes: ", this.writesCount);
    if (this.fd) {
      fs.close(this.fd, (err) => {
        callback(err | error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWriteStream({
  highWaterMark: 1800,
  fileName: "text.txt",
});
stream.write(Buffer.from("this is some string."));
stream.end(Buffer.from("Our last write"));

// this logs the "Number of writes: writesCount", per _destroy method, and also logs "Stream was finished"
stream.on("finish", () => {
  console.log("Stream was finished");
});
