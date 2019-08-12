module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function RedMobileCameraOpenNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.options = {};
        if(this.preview === "enable"){
            node.options.onBack = false;
        }else{
            node.options.onBack = true;
        }

        node.on('input', function(msg) {
            const json =  {
                method: "camera-open",
                payload: msg.payload,
                options: node.options
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
                node.error(RED._("camera-open.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("camera-open.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("camera-open", RedMobileCameraOpenNode);

    function RedMobileCameraCloseNode(n) {
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
                    method: "camera-close"
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
                node.error(RED._("camera-close.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("scamera-close.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("camera-close", RedMobileCameraCloseNode);

    function RedMobileTakePictureNode(n) {
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
                    method: "camera-take-picture"
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
                node.error(RED._("take-picture.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("take-picture.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("take-picture", RedMobileTakePictureNode);

    function RedMobileCameraSwitchNode(n) {
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
                    method: "camera-switch"
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
                node.error(RED._("camera-switch.errors.response"));
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: RED._("camera-switch.errors.response")
                });
            });
        });
    }

    RED.nodes.registerType("camera-switch", RedMobileCameraSwitchNode);
};
