module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function RedMobileSensorSubscribeNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = {
      sensor: n.sensor,
      freq: n.freq,
    };

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'sensor-subscribe',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('sensor subscribe', RedMobileSensorSubscribeNode);
};
