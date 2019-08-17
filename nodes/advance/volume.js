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
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(RED._("in-app-browser.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("in-app-browser.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("volume-get", RedMobileVolumeGetNode);

    const targets = ["alarm","dtmf","music","system","voiceCall","notification","all","ringer"];

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
                if(msg.volume !== undefined && validateVolume(msg.volume)){
                    node.volume = msg.volume;
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
            if(node.target === "msg"){
                if(msg.target !== undefined && targets.indexOf(msg.target)){
                    node.target = msg.target;
                }else{
                    node.error(RED._("volume.errors.target"));
                    node.status({
                        fill: "red",
                        shape: "ring",
                        text: RED._("volume.errors.target")
                    });
                    return;
                }
            }
            const json =  {
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
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(RED._("in-app-browser.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("in-app-browser.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("volume-set", RedMobileVolumeSetNode);
};
