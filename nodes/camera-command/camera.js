module.exports = function (RED) {
  'use strcit';

  const util = require('../../lib/util');
  util.init(RED);

  function RedMobileCameraOpenNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;
    node.options = {};
    if (n.preview === 'enable') {
      node.options.toBack = false;
    } else {
      node.options.toBack = true;
    }
    if (n.direction) {
      node.options.direction = n.direction;
    } else {
      node.options.direction = 'back';
    }

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'camera-open',
        payload: msg.payload,
        options: node.options,
      };

      util.postRequest(node, msg, json);
    });
  }

  RED.nodes.registerType('camera-open', RedMobileCameraOpenNode);

  function RedMobileCameraCloseNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-close',
      };

      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('camera-close', RedMobileCameraCloseNode);

  function RedMobileTakePictureNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-take-picture',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('take-picture', RedMobileTakePictureNode);

  function RedMobileCameraSwitchNode(n) {
    RED.nodes.createNode(this, n);
    let node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-switch',
      };
      util.getRequest(node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('camera-switch', RedMobileCameraSwitchNode);
};
