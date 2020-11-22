module.exports = function(RED) {
    'use strcit';

    const util = require("../../lib/util");
    util.init(RED);

    function startQRCode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            preferFrontCamera: n.camera === "front" ? true : false,
            showFlipCameraButton: n.showFlipCameraButton,
            showTorchButton: n.showTorchButton,
            torchOn: n.torchOn,
            orientation: n.orientation,
            prompt: n.prompt
        };

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "qrcode-scan",
                payload: msg.payload,
                opts: node.opts
            };
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("qrcode scan", startQRCode);
};
