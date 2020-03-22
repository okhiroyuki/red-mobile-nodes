module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function RedMobileSpeechToTextNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const json =  {
                id: node.id,
                method: "speech-to-text",
                payload: msg.payload
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
                node.error(RED._("speech-to-text.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("speech-to-text.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("speech-to-text", RedMobileSpeechToTextNode);
};
