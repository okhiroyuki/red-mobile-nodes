module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const EventEmitter = require('events').EventEmitter;
    const WebSocketClient = require('../WebSocketClient');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function getPostConfig(json){
        const config = {
            baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
            url: PATH,
            method: "post",
            data: qs.stringify(json),
            headers: {
                'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        return config;
    }

    function RedMobileBleConnectNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.opts = {
            notification: n.notification
        };
        if (RED.nodes.getNode(n.device)){
            node.opts.deviceId = RED.nodes.getNode(n.device).deviceId;
        }

        node.on('input', function(msg) {
            const json =  {
                method: "ble-connect",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(error.message);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("ble connect", RedMobileBleConnectNode);

    function RedMobileBleDisconnectNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {};
        if (RED.nodes.getNode(n.device)){
            node.opts.deviceId = RED.nodes.getNode(n.device).deviceId;
        }

        node.on('input', function(msg) {
            const json =  {
                method: "ble-disconnect",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(error.message);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("ble disconnect", RedMobileBleDisconnectNode);

    function RedMobileBleWriteNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            service_uuid: n.serviceUuid,
            characteristic_uuid: n.characteristicUuid
        };
        if (RED.nodes.getNode(n.device)){
            node.opts.deviceId = RED.nodes.getNode(n.device).deviceId;
        }
        node.opts.response = n.response;

        node.on('input', function(msg) {
            const json =  {
                method: "ble-write",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(error.message);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("ble write", RedMobileBleWriteNode);

    function RedMobileBleReadNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            service_uuid: n.serviceUuid,
            characteristic_uuid: n.characteristicUuid
        };
        if (RED.nodes.getNode(n.device)){
            node.opts.deviceId = RED.nodes.getNode(n.device).deviceId;
        }

        node.on('input', function(msg) {
            const json =  {
                method: "ble-read",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(error.message);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("ble read", RedMobileBleReadNode);

    function RedMobileBleScanNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            timeout: n.timeout
        };

        node.on('input', function(msg) {
            const json =  {
                method: "ble-scan",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                msg.payload = res.data;
                node.send(msg);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                node.error(error.message);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("ble scan", RedMobileBleScanNode);

    function bleDevice(n){
        RED.nodes.createNode(this, n);
        this.deviceId = n.deviceId;
    }
    RED.nodes.registerType("bledevice", bleDevice);

    function RedMobileBleNotificationNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {
            notification: n.notification
        };
        const ev = new EventEmitter();
        const ws = new WebSocketClient(ev);

        ws.open("ws://localhost:" + RED.settings.redMobileWsPort + "/mobile/ble");
        ev.on("open",() => {
            node.status({fill: "blue",shape: "dot",text: "connect"});
        });
        ev.on("close", () => {
            node.status({fill: "green",shape: "dot",text: "close"});
        });
        ev.on("error", (e)=>{
            node.status({fill: "red",shape: "dot",text: "error"});
            node.send({payload:e});
        });
        ev.on("message" ,(data)=>{
            node.send({payload: JSON.parse(data)});
        });
    }

    RED.nodes.registerType("ble notification", RedMobileBleNotificationNode);
};
