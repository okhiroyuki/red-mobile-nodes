module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function sendError(node) {
    node.error(RED._('beep.errors.response'));
    node.status({
      fill: 'red',
      shape: 'ring',
      text: RED._('beep.errors.response'),
    });
  }

  function RedMobileBeepNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      if (msg.payload === undefined || typeof msg.payload !== 'number') {
        sendError(node);
        return;
      }
      const json = {
        id: node.id,
        method: 'beep',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }
  RED.nodes.registerType('beep', RedMobileBeepNode);
};
