module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileBleSubscribeNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = util.generateOpts(n);

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'ble-subscribe',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('ble subscribe', RedMobileBleSubscribeNode);
};
