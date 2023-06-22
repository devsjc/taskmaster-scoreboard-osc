const osc = require("osc"),
    express = require("express"),
    ws = require("ws");

/****************
 * OSC Over UDP *
 ****************/
const getIPAddresses = function () {
    const os = require("os"),
        interfaces = os.networkInterfaces(),
        ipAddresses = [];

    for (const deviceName in interfaces) {
        const addresses = interfaces[deviceName];
        for (let i = 0; i < addresses.length; i++) {
            const addressInfo = addresses[i];
            if (addressInfo.family === "IPv4" && !addressInfo.internal) {
                ipAddresses.push(addressInfo.address);
            }
        }
    }

    return ipAddresses;
};

/******************
 * UDP Connection *
 ******************/

const oscServer = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121
});

oscServer.on("ready", function () {
    const ipAddresses = getIPAddresses();

    console.log("Backend: Listening for OSC over UDP.");
    ipAddresses.forEach(function (address) {
        console.log(" Host:", address + ", Port:", oscServer.options.localPort);
    });
});

oscServer.on("error", function (err) {
    console.log("Backend: " + err.toString());
});

oscServer.open();


/*******************
 * WebSocket Relay *
 *******************/

// Create an Express-based Web Socket server to which OSC messages will be relayed.
const app = express(),
    server = app.listen(8081),
    wsServer = new ws.WebSocketServer({
        server: server
    });

app.use("/", express.static("../frontend"));

wsServer.on('connection', (socket) => {

    console.log(`Backend: WebSocket client connected`);

    oscServer.on("message", function (oscMessage) {
        console.log(`Backend: Received OSC message: ${oscMessage.address}, ${oscMessage.args}. Forwarding to websocket`);

        // Forward the OSC message to WebSocket clients
        socket.send(JSON.stringify(oscMessage))
    });


    socket.on('message', (message) => {
        console.log(`Backend: Received WebSocket message: ${message}`);
    });

    socket.on('close', () => {
        console.log('Backend: WebSocket client disconnected');
    });

});