module.exports = function(RED) {
    "use strict";
    const axios = require('axios');
    const qs = require('qs');
    const BASE_URL = 'http://127.0.0.1';
    const PATH =  '/mobile';

    function SqliteNodeIn(n) {
        RED.nodes.createNode(this,n);
        this.sqlquery = n.sqlquery||"msg.topic";
        this.sql = n.sql;
        var node = this;
        node.status({});

        var bind = [];

        var doQuery = function(msg) {
            if (node.sqlquery == "msg.topic") {
                if (typeof msg.topic === 'string') {
                    if (msg.topic.length > 0) {
                        bind = Array.isArray(msg.payload) ? msg.payload : [];
                        exec(msg.topic, bind, function(err, row) {
                            if (err) { node.error(err,msg); }
                            else {
                                msg.payload = row;
                                node.send(msg);
                            }
                        });
                    }
                }
                else {
                    node.error("msg.topic : the query is not defined as a string",msg);
                    node.status({fill:"red",shape:"dot",text:"msg.topic error"});
                }
            }
            if (node.sqlquery == "batch") {
                if (typeof msg.topic === 'string') {
                    if (msg.topic.length > 0) {
                        batch(msg.topic, function(err) {
                            if (err) { node.error(err,msg);}
                            else {
                                msg.payload = [];
                                node.send(msg);
                            }
                        });
                    }
                }
                else {
                    node.error("msg.topic : the query is not defined as string", msg);
                    node.status({fill:"red", shape:"dot",text:"msg.topic error"});
                }
            }
            if (node.sqlquery == "fixed") {
                if (typeof node.sql === 'string') {
                    if (node.sql.length > 0) {
                        exec(node.sql, bind, function(err, row) {
                            if (err) { node.error(err,msg); }
                            else {
                                msg.payload = row;
                                node.send(msg);
                            }
                        });
                    }
                }
                else {
                    if (node.sql === null || node.sql == "") {
                        node.error("SQL statement config not set up",msg);
                        node.status({fill:"red",shape:"dot",text:"SQL config not set up"});
                    }
                }
            }
            if (node.sqlquery == "prepared") {
                if (typeof node.sql === 'string' && typeof msg.params !== "undefined" && typeof msg.params === "object") {
                    if (node.sql.length > 0) {
                        exec(node.sql, msg.params, function(err, row) {
                            if (err) { node.error(err,msg); }
                            else {
                                msg.payload = row;
                                node.send(msg);
                            }
                        });
                    }
                }
                else {
                    if (node.sql === null || node.sql == "") {
                        node.error("Prepared statement config not set up",msg);
                        node.status({fill:"red",shape:"dot",text:"Prepared statement not set up"});
                    }
                    if (typeof msg.params == "undefined") {
                        node.error("msg.params not passed");
                        node.status({fill:"red",shape:"dot",text:"msg.params not defined"});
                    }
                    else if (typeof msg.params != "object") {
                        node.error("msg.params not an object");
                        node.status({fill:"red",shape:"dot",text:"msg.params not an object"});
                    }
                }
            }
        };

        node.on("input", function(msg) {
            if (msg.hasOwnProperty("extension")) {
                loadExtension(msg.extension, function(err) {
                    if (err) { node.error(err,msg); }
                    else { doQuery(msg); }
                });
            }
            else { doQuery(msg); }
        });
    }
    RED.nodes.registerType("sqlite",SqliteNodeIn);

    function exec(sql, params, callback){
        const json =  {
            method: "sqlite-exec",
            payload: sql,
            params: params
        };
        const config = generateConfig(json);
        axios.request(config).then((res) => {
            callback(null, res.data);
        }).catch((err) => {
            callback(err);
        });
    }
    
    function batch(sql, callback){
        const json =  {
            method: "sqlite-batch",
            payload: sql,
        };
        const config = generateConfig(json);
        axios.request(config).then((res) => {
            callback(null);
        }).catch((err) => {
            callback(err);
        });
    }
        
    function loadExtension(extension, callback){
        callback(new Error("extension is not supported"));
    }
        
    function generateConfig(json){
        return {
            baseURL: BASE_URL + ":" + RED.settings.redMobilePort,
            url: PATH,
            method: "post",
            data: qs.stringify(json),
            headers: {
                'Authorization': "Bearer: " + RED.settings.redMobileAccessKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
    }
};
