module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    const axios = require('axios');
    const isBase64 = require('is-base64');

    function RedMobileBleWriteNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
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
                method: "ble-write",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(util.getPostConfig(json)).then((res) => {
                util.sendSuccess(node, msg, res);
            }).catch((err) => {
                util.sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("ble write", RedMobileBleWriteNode);
};
