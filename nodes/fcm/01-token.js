module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    util.init(RED);

    function getToken(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const params = {
                id: node.id,
                method: "fcm-token"
            }
            util.getRequest(node, msg, params, 5000);
        });
    }

    RED.nodes.registerType("fcm token", getToken);
};
