module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    const axios = require('axios');

    function RedMobileBleDisconnectNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
        let node = this;
        node.opts = {};
        node.opts = util.generateOpts(n);

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "ble-disconnect",
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

    RED.nodes.registerType("ble disconnect", RedMobileBleDisconnectNode);
};
