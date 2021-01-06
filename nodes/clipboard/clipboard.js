module.exports = (RED) => {
  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileClipboardNode(n) {
    RED.nodes.createNode(this, n);
    this.mode = n.mode;
    const node = this;

    node.options = {
      mode: this.mode,
    };

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'clipboard',
        payload: msg.payload,
        options: node.options,
      };
      util.postRequest(node, msg, json);
    });
  }
  RED.nodes.registerType('clipboard', RedMobileClipboardNode);
};
