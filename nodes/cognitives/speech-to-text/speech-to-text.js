module.exports = (RED) => {
  'use strcit';

  const util = import('../../../lib/util');
  util.init(RED);

  function RedMobileSpeechToTextNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'speech-to-text',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('speech-to-text', RedMobileSpeechToTextNode);
};
