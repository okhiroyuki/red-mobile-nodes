module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    const axios = require('axios');

     function RedMobileBleSubscribeNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
        let node = this;
        node.opts = util.generateOpts(n);
        
        node.on("input" , (msg) =>{
            const json =  {
                method: "ble-subscribe",
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

    RED.nodes.registerType("ble subscribe", RedMobileBleSubscribeNode);
};
