module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileBleConnectNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = util.generateOpts(n);

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'ble-connect',
        payload: msg.payload,
        opts: node.opts,
      };

      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('ble connect', RedMobileBleConnectNode);
};
