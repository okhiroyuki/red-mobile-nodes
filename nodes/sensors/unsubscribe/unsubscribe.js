module.exports = function (RED) {
  'use strcit';

  const util = require('../../../lib/util');
  util.init(RED);

  function RedMobileSensorUnSubscribeNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    node.opts = {
      sensor: n.sensor,
    };

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'sensor-unsubscribe',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }
  RED.nodes.registerType('sensor unsubscribe', RedMobileSensorUnSubscribeNode);
};
