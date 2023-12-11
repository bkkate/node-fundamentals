// creating a transform stream that'll encrypt our data

const { Transform } = require('node:stream');
const fs = require("node:fs/promises");

class Encrypt extends Transform {
    // other methods, like write, read, destroy, final etc are not needed
    // since the transform class already takes care of those
    _transform(chunk, encoding, callback) {
        
        // adding +1 to each of 2 hexadecimals (= representing 8 bits or 1 byte) as our "encryption"
        // ex) Buffer <34, ff, a4, 11, 22...> ->  Buffer <34+1, ff+1, a4+1, 11+1, 22+1 ...> 
        for (let i=0; i<chunk.length; ++i) {
            if (chunk[i]!=255) {
                chunk[i] = chunk[i]+1;
            }
        }
        // same thing as: this.push(chunk);
        callback(null, chunk);
    }   
}

(async() => {
    const readFileHandle = await fs.open("read.txt", "r");
    const writeFileHandle = await fs.open("write.txt", "w");

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const encrypt = new Encrypt();

    // getting data from read stream, piping it to encryption transform stream, then piping it to a write stream
    readStream.pipe(encrypt).pipe(writeStream);
})();