// creating a transform stream that'll decrypt our data

const { Transform } = require("node:stream");
const fs = require("node:fs/promises");

class Decrypt extends Transform {
  // other methods, like write, read, destroy, final etc are not needed
  // since the transform class already takes care of those
  _transform(chunk, encoding, callback) {
    // getting the original data back (refer to what we used for encryption we're reversing it)
    for (let i = 0; i < chunk.length; ++i) {
      if (chunk[i] != 255) {
        chunk[i] = chunk[i] - 1;
      }
    }
    // same thing as: this.push(chunk);
    callback(null, chunk);
  }
}

(async () => {
  const readFileHandle = await fs.open("write.txt", "r");
  const writeFileHandle = await fs.open("decrypted.txt", "w");

  const readStream = readFileHandle.createReadStream();
  const writeStream = writeFileHandle.createWriteStream();

  const decrypt = new Decrypt();

  // getting data from read stream, piping it to encryption transform stream, then piping it to a write stream
  readStream.pipe(decrypt).pipe(writeStream);
})();
