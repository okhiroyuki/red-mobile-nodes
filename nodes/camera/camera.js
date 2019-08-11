module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function RedMobileCameraOpenNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            let config = {
                baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
                url: PATH,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer: " + RED.settings.redMobileAccessKey
                },
                params: {
                    method: "camera-open"
                },
                timeout: 5000
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

    RED.nodes.registerType("camera-open", RedMobileCameraOpenNode);

    function RedMobileCameraCloseNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const json =  {
                method: "camera-close",
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

    RED.nodes.registerType("camera-close", RedMobileCameraCloseNode);

    function RedMobileTakePictureNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            const json =  {
                method: "camera-take-picture",
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

    RED.nodes.registerType("take-picture", RedMobileTakePictureNode);

    // function RedMobileCamerahPreviewNode(n) {
    //     RED.nodes.createNode(this, n);
    //     let node = this;

    //     node.on('input', function(msg) {
    //         const json =  {
    //             method: "camera-preview",
    //             payload: msg.payload
    //         };
    //         let config = {
    //             baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
    //             url: PATH,
    //             method: "post",
    //             data: qs.stringify(json),
    //             headers: {
    //                 'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
    //                 'Content-Type': 'application/x-www-form-urlencoded'
    //             }
    //         };

    //         axios.request(config).then((res) => {
    //             msg.payload = res.data;
    //             node.send(msg);
    //             node.status({
    //                 fill: "blue",
    //                 shape: "dot",
    //                 text: "success"
    //             });
    //         }).catch((error) => {
    //             node.error(RED._("speech-to-text.errors.response"));
    //             node.status({
    //                 fill: "red",
    //                 shape: "ring",
    //                 text: RED._("speech-to-text.errors.response")
    //             });
    //         });
    //     });
    // }

    // RED.nodes.registerType("camera-preview", RedMobileCamerahPreviewNode);
};
