module.exports = function(RED) {
    'use strcit';

    const util = require('../../lib/util');
    util.init(RED);

    function takePicture(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            quality: n.quality,
            destinationType: n.destinationType === "data" ? 0 : 1,
            saveToPhotoAlbum: n.saveToPhotoAlbum 
        };

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "camera-open",
                payload: msg.payload,
                options: node.opts
            };
            
            util.postRequest(node, msg, json);
        });
    }

    RED.nodes.registerType("camera", takePicture);
}
