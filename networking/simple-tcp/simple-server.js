// a simple TCP application in Node

// lowest level networking module
const net = require("net");

// Creating a TCP server
const server = net.createServer((socket) => {
    // socket streams
    socket.on('data', (data) => {
        console.log(data.toString("utf-8"));
    })
});

// Starting a TCP server
// port #, IP address where you want to run the app, callback that'll run once server starts
server.listen(3099, "127.0.0.1", () => {
    console.log("opened server on", server.address());
});