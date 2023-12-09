// copying from one file to the other, using simple read/write of fs and using streams (of our own AND using built in node stream)

const fs = require("node:fs/promises");

/*
1. storing all the file buffer in memory, then doing one huge write: quite fast, but memory usage is AW FUL
    ex) file size copied: 1GB
    Memory usage: 1GB (high!!)
    Execution time: 900 ms
*/
(async () => {
  // opening the destination file to copy over
  const destFile = await fs.open("text-copy.txt", "w");
  // opening the file to read from: readFile opens the file AND returns all the content as buffers
  const result = await fs.readFile("original-text.txt");

  // this will take up a lot of memory, and even crash the program if the text is super huge + takes a lot of time
  await destFile.write(result);

})();


/*
2. setting up stream of our own, without using the stream object:
    - multiple writes by setting up a stream, so it takes longer, BUT memory usage is great

     ex) file size copied: 1GB
    Memory usage: 30MB 
    Execution time: 2 s
*/
(async () => {
   const srcFile = await fs.open("original-text.txt", "r");
   const destFile = await fs.open("text-copy.txt", "w");
  
   let bytesRead = -1;

   // since it reads a chunk (~16kb) at a time, we keep executing .read() in the while loop 
   // until we finish reading the whole thing
   while(bytesRead !== 0) {
    const readResult = await srcFile.read();
    bytesRead = readResult.bytesRead;

    destFile.write(readResult.buffer);
   }
   
  })();

  /*
3. Using node STREAMS and piping: use this over previous options
    
     ex) file size copied: 1GB
    Memory usage: 30MB 
    Execution time: ~ 1 s  (a bit faster than #2)
*/
(async () => {
    const srcFile = await fs.open("original-text.txt", "r");
    const destFile = await fs.open("text-copy.txt", "w");
   
   // create read and write streams
   const readStream = srcFile.createReadStream();
   const writeStream = destFile.createWriteStream();

   readStream.pipe(writeStream);

   readStream.on('end', () => {
    console.timeEnd("copy");
   })
    
    
   })();

