module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

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
            let config = {
                baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
                url: PATH,
                method: "post",
                data: qs.stringify(json),
                headers: {
                    'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            axios.request(config).then((res) => {
                msg.payload = Number(res.data);
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(RED._("in-app-browser.errors.response-get"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("in-app-browser.errors.response-get")
                });
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
            let config = {
                baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
                url: PATH,
                method: "post",
                data: qs.stringify(json),
                headers: {
                    'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            axios.request(config).then((res) => {
                msg.payload = Number(res.data);
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(RED._("in-app-browser.errors.response-set"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("in-app-browser.errors.response-set")
                });
            });
        });
    }

    RED.nodes.registerType("volume-set", RedMobileVolumeSetNode);
};
