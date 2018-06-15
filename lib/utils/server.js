"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _0x_js_1 = require("0x.js");
var utils_1 = require("@0xproject/utils");
var bodyParser = require("body-parser");
var express = require("express");
var http = require("http");
var websocket_1 = require("websocket");
// Global state
var orders = [];
var socketConnection;
// HTTP Server
var app = express();
app.use(bodyParser.json());
app.get('/v0/orderbook', function (req, res) {
    console.log('HTTP: GET orderbook');
    var baseTokenAddress = req.param('baseTokenAddress');
    var quoteTokenAddress = req.param('quoteTokenAddress');
    res.status(201).send(renderOrderBook(baseTokenAddress, quoteTokenAddress));
});
app.post('/v0/order', function (req, res) {
    console.log('HTTP: POST order');
    var order = req.body;
    orders.push(order);
    if (socketConnection !== undefined) {
        var message = {
            type: 'update',
            channel: 'orderbook',
            requestId: 1,
            payload: order,
        };
        socketConnection.send(JSON.stringify(message));
    }
    res.status(201).send({});
});
app.post('/v0/fees', function (req, res) {
    console.log('HTTP: POST fees');
    var makerFee = new utils_1.BigNumber(2).toString();
    var takerFee = _0x_js_1.ZeroEx.toBaseUnitAmount(new utils_1.BigNumber(0), 18).toString();
    var collector = '0xe36ea790bc9d7ab70c55260c66d52b1eca985f84';
    res.status(201).send({
        feeRecipient: collector,
        makerFee: makerFee,
        takerFee: takerFee,
    });
});
app.listen(3000, function () { return console.log('Standard relayer API (HTTP) listening on port 3000!'); });
// WebSocket server
var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(3001, function () {
    console.log('Standard relayer API (WS) listening on port 3001!');
});
var wsServer = new websocket_1.server({
    httpServer: server,
    autoAcceptConnections: false,
});
wsServer.on('request', function (request) {
    socketConnection = request.accept();
    console.log('WS: Connection accepted');
    socketConnection.on('message', function (message) {
        if (message.type === 'utf8' && message.utf8Data !== undefined) {
            var parsedMessage = JSON.parse(message.utf8Data);
            console.log('WS: Received Message: ' + parsedMessage.type);
            var snapshotNeeded = parsedMessage.payload.snapshot;
            var baseTokenAddress = parsedMessage.payload.baseTokenAddress;
            var quoteTokenAddress = parsedMessage.payload.quoteTokenAddress;
            var requestId = parsedMessage.requestId;
            if (snapshotNeeded && socketConnection !== undefined) {
                var orderbook = renderOrderBook(baseTokenAddress, quoteTokenAddress);
                var returnMessage = {
                    type: 'snapshot',
                    channel: 'orderbook',
                    requestId: requestId,
                    payload: orderbook,
                };
                socketConnection.sendUTF(JSON.stringify(returnMessage));
            }
        }
    });
    socketConnection.on('close', function (reasonCode, description) {
        console.log('WS: Peer disconnected');
    });
});
function renderOrderBook(baseTokenAddress, quoteTokenAddress) {
    var bids = orders.filter(function (order) {
        return (order.takerTokenAddress === baseTokenAddress) &&
            (order.makerTokenAddress === quoteTokenAddress);
    });
    var asks = orders.filter(function (order) {
        return (order.takerTokenAddress === quoteTokenAddress) &&
            (order.makerTokenAddress === baseTokenAddress);
    });
    return {
        bids: bids,
        asks: asks,
    };
}
//# sourceMappingURL=server.js.map