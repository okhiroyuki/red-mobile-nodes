module.exports = function (RED) {
  'use strcit';

  const util = require('../../../lib/util');
  util.init(RED);

  function RedMobileSpeechToTextNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
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
