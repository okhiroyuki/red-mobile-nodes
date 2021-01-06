module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function RedMobileBatteryNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const params = {
        id: node.id,
        method: 'battery',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('battery', RedMobileBatteryNode);
};
