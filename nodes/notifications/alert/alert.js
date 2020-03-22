module.exports = function(RED) {
    'use strcit';

    const util = require("../../../lib/util");
    util.init(RED);

    function RedMobileAlertNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            if(msg.payload === undefined || typeof msg.payload !== "object"){
                sendError(node);
                return;
            }
            const json =  {
                id: node.id,
                method: "alert",
                payload: msg.payload
            };
            util.postRequest(node, msg, json);
        });
    }

    function sendError(node){
        node.error(RED._("alert.errors.response"));
        node.status({
            fill: "red",
            shape: "ring",
            text: RED._("alert.errors.response")
        });
    }

    RED.nodes.registerType("alert", RedMobileAlertNode);
};
