import { Node } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { CameraNodeDef, CameraNodeOptions } from '../@types/camera';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function takePicture(this: Node, props: CameraNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    const options: CameraNodeOptions = {
      quality: props.quality,
      destinationType: props.destinationType === 'data' ? 0 : 1,
      saveToPhotoAlbum: props.saveToPhotoAlbum,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'camera',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('camera', takePicture);
};
