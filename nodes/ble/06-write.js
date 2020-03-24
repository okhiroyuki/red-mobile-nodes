module.exports = function(RED) {
    'use strcit';

    const isBase64 = require('is-base64');
    const util = require("../../lib/util");
    util.init(RED);

    function RedMobileBleWriteNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = util.generateOpts(n);

        node.on('input', function(msg) {
            if(!isBase64(msg.payload)){
                node.error("msg.payload must Base64 encoded string");
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: "error"
                });
                return;
            }
            const json =  {
                id: node.id,
                method: "ble-write",
                payload: msg.payload,
                opts: node.opts
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("ble write", RedMobileBleWriteNode);
};
