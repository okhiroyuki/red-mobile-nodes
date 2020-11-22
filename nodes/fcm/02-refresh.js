module.exports = function(RED) {
    'use strcit';

    const EventEmitter = require('events').EventEmitter;
    const WebSocketClient = require('../WebSocketClient');
    const ev = new EventEmitter();
    const ws = new WebSocketClient(ev);
    if(RED.settings.redMobileWsPort){
        const port = RED.settings.redMobileWsPort;
        ws.open("ws://localhost:" + port + "/firebase/refresh");
    }

    function onRefreshToken(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        ev.on("message" ,(data) => {
            const payload = JSON.parse(data).payload;
            node.send({"payload": payload});    
        });
    }
    RED.nodes.registerType("fcm refresh token", onRefreshToken);
};
