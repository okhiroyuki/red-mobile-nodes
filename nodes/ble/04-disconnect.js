module.exports = function (RED) {
  'use strcit';

  const util = require('../../lib/util');
  util.init(RED);

  function RedMobileBleDisconnectNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    node.opts = util.generateOpts(n);

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'ble-disconnect',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('ble disconnect', RedMobileBleDisconnectNode);
};
