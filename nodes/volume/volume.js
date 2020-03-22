module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const util = require("../../lib/util");
    util.init(RED);

    function RedMobileVolumeGetNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.target = n.target;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "volume-get",
                payload: msg.payload,
                target: node.target
            };

            axios.request(util.getPostConfig(json)).then((res) => {
                msg.payload = Number(res.data);
                util.sendSuccess(node, msg);
            }).catch((err) => {
                util.sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("volume-get", RedMobileVolumeGetNode);

    function validateVolume(volume){
        return typeof volume === "number" && volume >= 0 && volume <= 100;
    }

    function RedMobileVolumeSetNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.volume = Number(n.volume);
        node.target = n.target;

        node.on('input', function(msg) {
            if(node.volume === -1){
                if(msg.payload !== undefined && validateVolume(msg.payload)){
                    node.volume = msg.payload;
                }else{
                    node.error(RED._("volume.errors.volume"));
                    node.status({
                        fill: "red",
                        shape: "ring",
                        text: RED._("volume.errors.volume")
                    });
                    return;
                }
            }
            const json =  {
                id: node.id,
                method: "volume-set",
                payload: msg.payload,
                volume: node.volume,
                target: node.target
            };

            axios.request(util.getPostConfig(json)).then((res) => {
                msg.payload = Number(res.data);
                util.sendSuccess(node, msg);
            }).catch((err) => {
                util.sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("volume-set", RedMobileVolumeSetNode);
};
