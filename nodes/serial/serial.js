module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    util.init(RED);

    const EventEmitter = require('events').EventEmitter;
    const WebSocketClient = require('../WebSocketClient');
    const ev = new EventEmitter();
    const ws = new WebSocketClient(ev);

    ws.open("ws://localhost:" + RED.settings.redMobileWsPort + "/mobile/serial");

    function RedMobileSerialOpenNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            baudRate: n.baudRate,
            dataBits: n.dataBits,
            stopBits: n.stopBits,
            parity: n.parity,
            dtr: n.dtr,
            rts: n.rts
        };

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "serial-open",
                payload: msg.payload,
                opts: node.opts
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("serial-open", RedMobileSerialOpenNode);

    function RedMobileSerialCloseNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const params = {
                id: node.id,
                method: "serial-close"
            }
            util.getRequest(node, msg, params, 5000);
        });
    }

    RED.nodes.registerType("serial-close", RedMobileSerialCloseNode);

    function RedMobileSerialWriteNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.data = n.data;
        node.dataType = n.dataType;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "serial-write",
                payload: node.data,
                dataType: node.dataType
            };
            if(!node.data){
                if(msg.payload){
                    json.payload = msg.payload;
                }else{
                    node.error(RED._("serial-write.errors.payload"));
                    node.status({
                        fill: "red",
                        shape: "ring",
                        text: RED._("serial-write.errors.payload")
                    });
                    return;
                }
            }
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("serial-write", RedMobileSerialWriteNode);

    function RedMobileSerialReadNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        ev.on("message" ,(data)=>{
            const payload = JSON.parse(data).payload;
            if(payload){
                node.send({"payload": payload});
            }
        });
    }

    RED.nodes.registerType("serial-read", RedMobileSerialReadNode);
};
