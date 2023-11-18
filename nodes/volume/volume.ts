import { NodeAPI, Node } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { VolumeNodeDef } from '../@types/volume';

module.exports = function (RED: NodeAPI) {
  function RedMobileVolumeGetNode(this: Node, props: VolumeNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json = {
        id: node.id,
        method: 'volume-get',
        payload: msg.payload,
        target: props.target,
      };

      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('volume-get', RedMobileVolumeGetNode);

  function validateVolume(volume) {
    return volume >= 0 && volume <= 100;
  }

  function RedMobileVolumeSetNode(this: Node, props: VolumeNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (props.volume === -1) {
        if (
          msg.payload !== undefined &&
          typeof msg.payload === 'number' &&
          validateVolume(msg.payload)
        ) {
          props.volume = msg.payload;
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
      const json: UtilJsonDef = {
        id: node.id,
        method: 'volume-set',
        payload: msg.payload,
        volume: props.volume,
        target: props.target,
      };

      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('volume-set', RedMobileVolumeSetNode);
};
