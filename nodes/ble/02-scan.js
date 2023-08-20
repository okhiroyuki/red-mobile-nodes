module.exports = function (RED) {
  'use strcit';

  const util = require('../../lib/util');
  util.init(RED);

  function RedMobileBleScanNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    node.opts = {
      timeout: n.timeout,
    };

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'ble-scan',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('ble scan', RedMobileBleScanNode);
};
