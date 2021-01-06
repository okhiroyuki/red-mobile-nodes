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

  function RedMobileConfirmNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      if (msg.payload === undefined || typeof msg.payload !== 'object') {
        sendError(node);
        return;
      }
      const json = {
        method: 'confirm',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('confirm', RedMobileConfirmNode);
};
