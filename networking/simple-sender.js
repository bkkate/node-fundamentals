const net = require("net");

// can create a connection with any TCP server,
// specifying the host addresses & port
const socket = net.createConnection({host: "127.0.0.1", port: 3099}, 
    () =>{
        // writing to a socket stream
        socket.write("A simple message coming from a simple sender!");
}
);