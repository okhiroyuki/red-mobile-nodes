module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function startQRCode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = {
      preferFrontCamera: n.camera === 'front',
      showFlipCameraButton: n.showFlipCameraButton,
      showTorchButton: n.showTorchButton,
      torchOn: n.torchOn,
      orientation: n.orientation,
      prompt: n.prompt,
    };

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'qrcode-scan',
        payload: msg.payload,
        opts: node.opts,
      };
      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('qrcode scan', startQRCode);
};
