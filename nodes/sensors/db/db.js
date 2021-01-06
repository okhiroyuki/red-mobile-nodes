module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function RedMobileDBNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const params = {
        id: node.id,
        method: 'db',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('db', RedMobileDBNode);
};
