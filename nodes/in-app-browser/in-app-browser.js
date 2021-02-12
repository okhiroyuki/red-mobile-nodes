module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    util.init(RED);

    function RedMobileInAppBrowserNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.target = n.target;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "in-app-browser",
                payload: msg.payload,
                target: node.target,
                options: msg.options,
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("in-app-browser", RedMobileInAppBrowserNode);
};
