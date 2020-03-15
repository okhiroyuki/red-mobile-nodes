module.exports = function(RED) {
    'use strcit';

    const util = require("./lib/util");
    const axios = require('axios');

    function RedMobileSensorSubscribeNode(n) {
        RED.nodes.createNode(this, n);
        util.init(RED);
        let node = this;
        node.opts = {
            sensor: n.sensor,
            freq: n.freq
        };
        
        node.on('input', function(msg) {
            const json =  {
                method: "sensor-subscribe",
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

    RED.nodes.registerType("sensor subscribe", RedMobileSensorSubscribeNode);
};
