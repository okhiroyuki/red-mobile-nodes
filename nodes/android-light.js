module.exports = function(RED) {
    'use strcit';

    const axios = require('axios');
    const BASE_URL = 'http://localhost';
    const PATH =  '/light';

    function AndroidLightNode(n) {
        RED.nodes.createNode(this, n);
        let node = this;

        node.on('input', function(msg) {
            let config = {
                baseURL: BASE_URL + "/" + RED.settings.port,
                url: PATH,
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                },
                auth: {
                    username: RED.settings.adminAuth.users[0].username,
                    password: RED.settings.adminAuth.users[0].passowrd
                }
            };

            axios.request(config).then((res) => {
                console.log(res);
                node.status({
                    fill: "blue",
                    shape: "dot",
                    text: "success"
                });
            }).catch((error) => {
                console.log(error);
                node.status({
                    fill: "red",
                    shape: "ring",
                    text: error.message
                });
            });
        });
    }

    RED.nodes.registerType("android-light", AndroidLightNode);
};
