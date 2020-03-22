module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    const axios = require('axios');

     function RedMobileBleUnsubscribeNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
        let node = this;
        node.opts = util.generateOpts(n);
        
        node.on("input" , (msg) =>{
            const json =  {
                id: node.id,
                method: "ble-unsubscribe",
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

    RED.nodes.registerType("ble unsubscribe", RedMobileBleUnsubscribeNode);
};
