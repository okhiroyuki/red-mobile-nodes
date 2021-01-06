module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function RedMobileSensorUnSubscribeNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = {
      sensor: n.sensor,
    };

    node.on('input', (msg) => {
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
