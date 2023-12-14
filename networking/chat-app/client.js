const net = require("net");
// provides an interface for reading data from a Readable stream one line at a time
const readline = require("readline/promises");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// UI stuff
/*basically converting them to promise functions so you can call them with await
  and not have to do a huge callback loop
*/
const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

// returns a net.Socket class
const socket = net.createConnection({ host: "127.0.0.1", port: 3008 }, () => {
  console.log("Connected to the server!");

  const ask = async () => {
    // a promise that returns the message that user types in the console
    const message = await rl.question("Enter a message > ");
    // moving the cursor one line up (to the previous line)
    await moveCursor(0, -1);
    // clear the current line that the cursor is in
    await clearLine(0);
    //sending the message to the server as 'data'
    socket.write(message);
  };

  ask();

  // when receiving a message from the server
  socket.on("data", async (data) => {
    console.log(); // log an empty line
    await moveCursor(0, -1); // move the cursor up to the "Enter a message>"
    await clearLine(0); // clear the typed in message
    console.log(data.toString("utf-8"));

    ask();
  });
});

socket.on("end", () => {
  console.log("Connection was ended");
});
