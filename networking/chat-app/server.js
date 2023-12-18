// for connections using tcp server
const net = require("net");

// returns a net.Server class (which is an EventEmitter)
const server = net.createServer();
// Keeping track of client objects (with id string & socket obj)
const clients = [];

// events
server.on("connection", (socket) => {
  console.log("A new connection to the server!");

  // assigning a client ID for the new client
  const clientId = clients.length + 1;

  // Broadcast a message to everyone when someone joins the chatroom
  clients.map((client) => {
    client.socket.write(`User ${clientId} joined!`);
  });

  // sending the client ID information
  socket.write(`id-${clientId}`);

  // create a new socket for each new client
  // socket is a duplex stream, so you can read AND write to it
  socket.on("data", (data) => {
    // // re-send the user input (msg) - the client will receive as 'data'
    // // this will only send data to the socket that send the msg
    // socket.write(data);

    // writing to all connected sockets
    clients.map((client) => {
      // extracting needed data from the message
      // (which would come in the format of ${id#}-message-${message})
      const dataString = data.toString("utf-8");
      const id = dataString.substring(0, dataString.indexOf("-"));
      const msg = dataString.substring(dataString.indexOf("-message-" + 9));

      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  // when a client exits/ disconnects,
  socket.on("end", () => {
    // Broadcast a message to everyone when someone leaves the chatroom
    clients.map((client) => {
      client.socket.write(`User ${clientId} left!`);
    });
  });

  clients.push({ id: clientId.toString(), socket });
});

server.listen(3008, "127.0.0.1", () => {
  console.log("Opened server on", server.address());
});
