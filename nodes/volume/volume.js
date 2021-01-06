module.exports = (RED) => {
  'use strcit';

  const util = import('../../lib/util');
  util.init(RED);

  function RedMobileVolumeGetNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.target = n.target;

    node.on('input', (msg) => {
      const json = {
        id: node.id,
        method: 'volume-get',
        payload: msg.payload,
        target: node.target,
      };

      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('volume-get', RedMobileVolumeGetNode);

  function validateVolume(volume) {
    return typeof volume === 'number' && volume >= 0 && volume <= 100;
  }

  function RedMobileVolumeSetNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;
    node.volume = Number(n.volume);
    node.target = n.target;

    node.on('input', (msg) => {
      if (node.volume === -1) {
        if (msg.payload !== undefined && validateVolume(msg.payload)) {
          node.volume = msg.payload;
        } else {
          node.error(RED._('volume.errors.volume'));
          node.status({
            fill: 'red',
            shape: 'ring',
            text: RED._('volume.errors.volume'),
          });
          return;
        }
      }
      const json = {
        id: node.id,
        method: 'volume-set',
        payload: msg.payload,
        volume: node.volume,
        target: node.target,
      };

      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('volume-set', RedMobileVolumeSetNode);
};
