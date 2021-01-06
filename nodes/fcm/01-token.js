module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function getToken(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const params = {
        id: node.id,
        method: 'fcm-token',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('fcm token', getToken);
};
