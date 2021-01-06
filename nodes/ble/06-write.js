module.exports = (RED) => {
  'use strcit';

  const isBase64 = import('is-base64');
  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileBleWriteNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = util.generateOpts(n);

    node.on('input', (msg) => {
      if (!isBase64(msg.payload)) {
        node.error('msg.payload must Base64 encoded string');
        node.status({
          fill: 'red',
          shape: 'ring',
          text: 'error',
        });
        return;
      }
      const json = {
        id: node.id,
        method: 'ble-write',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('ble write', RedMobileBleWriteNode);
};
