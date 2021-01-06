module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function textRecognizer(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'text-recognizer',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('text recognizer', textRecognizer);

  function imageLabeler(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'image-labeler',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('image labeler', imageLabeler);

  function barcodeDetector(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'barcode-detector',
        payload: msg.payload,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('barcode detector', barcodeDetector);
};
