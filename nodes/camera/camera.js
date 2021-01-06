module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function takePicture(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.opts = {
      quality: n.quality,
      destinationType: n.destinationType === 'data' ? 0 : 1,
      saveToPhotoAlbum: n.saveToPhotoAlbum,
    };

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'camera',
        payload: msg.payload,
        options: node.opts,
      };

      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('camera', takePicture);
};
