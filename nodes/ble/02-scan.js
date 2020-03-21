module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    const axios = require('axios');

    function RedMobileBleScanNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
        let node = this;
        node.opts = {
            timeout: n.timeout
        };

        node.on('input', function(msg) {
            const json =  {
                method: "ble-scan",
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

    RED.nodes.registerType("ble scan", RedMobileBleScanNode);
};
