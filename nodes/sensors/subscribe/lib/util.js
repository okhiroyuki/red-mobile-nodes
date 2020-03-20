let settings;
let nodes;
const qs = require('qs');
const BASE_URL = 'http://127.0.0.1';
const PATH =  '/mobile';

function getPostConfig(json){
    const config = {
        baseURL: BASE_URL + ":" + settings.redMobilePort,
        url: PATH,
        method: "post",
        data: qs.stringify(json),
        headers: {
            'Authorization': "Bearer: " + settings.redMobileAccessKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    return config;
}

function sendSuccess(node, msg, res){
    if(res.data){
        msg.payload = res.data;
    }
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

module.exports = {
    init: function(_runtime){
        nodes = _runtime.nodes;
        settings = _runtime.settings
    },
    getPostConfig: getPostConfig,
    sendSuccess: sendSuccess,
    sendError: sendError
}
