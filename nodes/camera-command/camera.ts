import { Node } from 'node-red';
import { getRequest, postRequest } from '../util';
import {
  CameraCommandNodeDef,
  CameraCommandNodeOptions,
} from '../@types/camera-command';
import { UtilJsonDef } from '../@types/util';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileCameraOpenNode(this: Node, props: CameraCommandNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    const options: CameraCommandNodeOptions = {
      toBack: false,
      direction: 'back',
    };
    if (props.preview === 'enable') {
      options.toBack = false;
    } else {
      options.toBack = true;
    }
    if (props.direction) {
      options.direction = props.direction;
    } else {
      options.direction = 'back';
    }

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'camera-open',
        payload: msg.payload,
        options: options,
      };

      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('camera-open', RedMobileCameraOpenNode);

  function RedMobileCameraCloseNode(this: Node, props: CameraCommandNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-close',
      };

      getRequest(RED, node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('camera-close', RedMobileCameraCloseNode);

  function RedMobileTakePictureNode(this: Node, props: CameraCommandNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-take-picture',
      };
      getRequest(RED, node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('take-picture', RedMobileTakePictureNode);

  function RedMobileCameraSwitchNode(this: Node, props: CameraCommandNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const params = {
        id: node.id,
        method: 'camera-switch',
      };
      getRequest(RED, node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('camera-switch', RedMobileCameraSwitchNode);
};
