module.exports = function(RED) {
    'use strcit';

    const util = require("../../../lib/util");
    util.init(RED);

    function RedMobileSensorSubscribeNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            sensor: n.sensor,
            freq: n.freq
        };
        
        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "sensor-subscribe",
                payload: msg.payload,
                opts: node.opts
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("sensor subscribe", RedMobileSensorSubscribeNode);
};
