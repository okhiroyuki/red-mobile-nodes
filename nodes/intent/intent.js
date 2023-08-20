module.exports = function (RED) {
  'use strcit';

  const util = require('../../lib/util');
  util.init(RED);

  function RedMobileStartActivityNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'intent-start-activity',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('start-activity', RedMobileStartActivityNode);
};
