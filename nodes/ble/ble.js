module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';
    const isBase64 = require('is-base64');
    // const EventEmitter = require('events').EventEmitter;
    // const WebSocketClient = require('../WebSocketClient');
    // const ev = new EventEmitter();
    // const ws = new WebSocketClient(ev);
    // ws.open("ws://localhost:" + RED.settings.redMobileWsPort + "/mobile/ble");

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

    function sendSuccess(node, msg, res){
        msg.payload = res.data;
        node.send(msg);
        node.status({
            fill: "blue",
            shape: "dot",
            text: "success"
        });
    }

    function sendError(node, err){
        const payload = err.response.data.message;
        node.error(payload);
        node.status({
            fill: "red",
            shape: "ring",
            text: payload
        });
    }

    function generateOpts(n){
        let opts = {};
        if (RED.nodes.getNode(n.device)){
            opts.address = RED.nodes.getNode(n.device).address;
        }
        if(n.service){
            opts.service = n.service;
        }
        if(n.characteristic){
            opts.characteristic = n.characteristic;
        }
        return opts;
    }

    function RedMobileBleConnectNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = generateOpts(n);

        node.on('input', function(msg) {
            const json =  {
                method: "ble-connect",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                sendSuccess(node, msg, res);
            }).catch((err) => {
                sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("ble connect", RedMobileBleConnectNode);

    function RedMobileBleDisconnectNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = {};
        node.opts = generateOpts(n);

        node.on('input', function(msg) {
            const json =  {
                method: "ble-disconnect",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                sendSuccess(node, msg, res);
            }).catch((err) => {
                sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("ble disconnect", RedMobileBleDisconnectNode);

    function RedMobileBleWriteNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = generateOpts(n);

        node.on('input', function(msg) {
            if(!isBase64(msg.payload)){
                node.error("msg.payload must Base64 encoded string");
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: "error"
                });
                return;
            }
            const json =  {
                method: "ble-write",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                sendSuccess(node, msg, res);
            }).catch((err) => {
                sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("ble write", RedMobileBleWriteNode);

    function RedMobileBleReadNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;
        node.opts = generateOpts(n);

        node.on('input', function(msg) {
            const json =  {
                method: "ble-read",
                payload: msg.payload,
                opts: node.opts
            };

            axios.request(getPostConfig(json)).then((res) => {
                sendSuccess(node, msg, res);
            }).catch((err) => {
                sendError(node, err);
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
                sendSuccess(node, msg, res);
            }).catch((err) => {
                sendError(node, err);
            });
        });
    }

    RED.nodes.registerType("ble scan", RedMobileBleScanNode);

    function bleDevice(n){
        RED.nodes.createNode(this, n);
        this.address = n.address;
    }
    RED.nodes.registerType("bledevice", bleDevice);

    // function RedMobileBleSubscribeNode(n) {
    //     RED.nodes.createNode(this, n);
    //     let node = this;
    //     node.opts = generateOpts(n);
        
    //     const json =  {
    //         method: "ble-subscribe",
    //         payload: {},
    //         opts: node.opts
    //     };
    //     let timer = setInterval(() => {
    //         axios.request(getPostConfig(json)).then((res) => {
    //             clearInterval(timer);
    //             sendSuccess(node, {}, res);
                
    //             ev.on("message" ,(data) => {
    //                 const payload = JSON.parse(data);
    //                 if(node.opts.address === payload.address &&  
    //                     node.opts.service === payload.service && 
    //                     node.opts.characteristic === payload.characteristic){
    //                         if(payload.status === "subscribed"){
    //                             node.status({
    //                                 fill: "blue",
    //                                 shape: "dot",
    //                                 text: "success"
    //                             });
    //                         }        
    //                         node.send({"payload": payload});
    //                 }
    //             });        
    //         }).catch((err) => {
    //             node.status({
    //                 fill: "red",
    //                 shape: "ring",
    //                 text: err.response.data.message
    //                 });
    //             });
    //         },1000);

    //     node.on('close', function(done) {
    //         clearInterval(timer);
    //         const json =  {
    //             method: "ble-unsubscribe",
    //             payload: {},
    //             opts: node.opts
    //         };
    //         axios.request(getPostConfig(json)).then((res) => {
    //             done();
    //         }).catch((err) => {
    //             done();
    //         });
    //     });
    // }

    // RED.nodes.registerType("ble subscribe", RedMobileBleSubscribeNode);
};
