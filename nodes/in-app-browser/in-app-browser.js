module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileInAppBrowserNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'in-app-browser',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('in-app-browser', RedMobileInAppBrowserNode);
};
