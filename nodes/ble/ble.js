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

        node.opts = {};
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

    // function RedMobileSerialWriteNode(n) {
    //     RED.nodes.createNode(this, n);
    //     let node = this;
    //     node.data = n.data;
    //     node.dataType = n.dataType;

    //     node.on('input', function(msg) {
    //         const json =  {
    //             method: "serial-write",
    //             payload: node.data,
    //             dataType: node.dataType
    //         };
    //         if(!node.data){
    //             if(msg.payload){
    //                 json.payload = msg.payload;
    //             }else{
    //                 node.error(RED._("serial-write.errors.payload"));
    //                 node.status({
    //                     fill: "red",
    //                     shape: "ring",
    //                     text: RED._("serial-write.errors.payload")
    //                 });
    //                 return;
    //             }
    //         }

    //         axios.request(getPostConfig(json)).then((res) => {
    //             msg.payload = res.data;
    //             node.send(msg);
    //             node.status({
    //                 fill: "blue",
    //                 shape: "dot",
    //                 text: "success"
    //             });
    //         }).catch((error) => {
    //             node.error(RED._("serial-write.errors.response"));
    //             node.status({
    //                 fill: "red",
    //                 shape: "ring",
    //                 text: RED._("serial-write.errors.response")
    //             });
    //         });
    //     });
    // }

    // RED.nodes.registerType("serial-write", RedMobileSerialWriteNode);

    // function RedMobileSerialReadNode(n) {
    //     RED.nodes.createNode(this, n);
    //     let node = this;
    //     const ev = new EventEmitter();
    //     const ws = new WebSocketClient(ev);

    //     ws.open("ws://localhost:" + RED.settings.redMobileWsPort + "/mobile/serial");
    //     ev.on("open",() => {
    //         node.status({fill: "blue",shape: "dot",text: "connect"});
    //     });
    //     ev.on("close", () => {
    //         node.status({fill: "green",shape: "dot",text: "close"});
    //     });
    //     ev.on("error", (e)=>{
    //         node.status({fill: "red",shape: "dot",text: "error"});
    //         node.send({payload:e});
    //     });
    //     ev.on("message" ,(data)=>{
    //         node.send({payload: JSON.parse(data)});
    //     });
    // }

    // RED.nodes.registerType("serial-read", RedMobileSerialReadNode);
};
