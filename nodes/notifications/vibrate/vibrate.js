module.exports = function (RED) {
  'use strcit';

  const util = require('../../../lib/util');
  util.init(RED);

  function sendError(node) {
    node.error(RED._('vibrate.errors.response'));
    node.status({
      fill: 'red',
      shape: 'ring',
      text: RED._('vibrate.errors.response'),
    });
  }

  function RedMobileVibrateNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      if (msg.payload === undefined || !Array.isArray(msg.payload)) {
        sendError(node);
        return;
      }
      const json = {
        id: node.id,
        method: 'vibrate',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('vibrate', RedMobileVibrateNode);
};
