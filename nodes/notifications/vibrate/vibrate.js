module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function sendError(node){
        node.error(RED._("vibrate.errors.response"));
        node.status({
            fill: "red",
            shape: "ring",
            text: RED._("vibrate.errors.response")
        });
    }

    function RedMobileVibrateNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            if(msg.payload === undefined || !Array.isArray(msg.payload)){
                sendError(node);
                return;
            }
            const json =  {
                method: "vibrate",
                payload: msg.payload
            };
            let config = {
                baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
                url: PATH,
                method: 'post',
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
                sendError(node);
            });
        });
    }

    RED.nodes.registerType("vibrate", RedMobileVibrateNode);
};