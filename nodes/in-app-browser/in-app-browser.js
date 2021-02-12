module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    util.init(RED);

    function BrowserOpen(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.payload = n.url;
        node.options = n.options;
        node.target = n.target;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "browser-open",
                payload: node.payload ? node.payload : msg.payload,
                target: node.target === "blank" ? "_blank" : "_system",
                options: node.options ? node.options : msg.options,
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("browser open", BrowserOpen);

    function BrowserClose(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "browser-close",
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("browser close", BrowserClose);
};
