// for connections using tcp server
const net = require("net");

// returns a net.Server class (which is an EventEmitter)
const server = net.createServer();
// Keeping track of client socket objects
const clients = [];

// events
server.on("connection", (socket) => {
  // will create a new socket for each new client
  // socket is a duplex stream, so you can read AND write to it
  socket.on("data", (data) => {
    // // re-send the user input (msg) - the client will receive as 'data'
    // // this will only send data to the socket that send the msg
    // socket.write(data);

    // writing to all connected sockets
    clients.map((socket) => {
      socket.write(data);
    });
  });

  clients.push(socket);
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on", server.address());
});
