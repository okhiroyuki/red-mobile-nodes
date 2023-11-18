import { NodeAPI, Node } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { QRCodeNodeDef, QRCodeNodeOptions } from '../@types/qrcode';
module.exports = function (RED: NodeAPI) {
  function startQRCode(this: Node, props: QRCodeNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;
    const options: QRCodeNodeOptions = {
      preferFrontCamera: props.camera == 'front',
      showFlipCameraButton: props.showFlipCameraButton,
      showTorchButton: props.showTorchButton,
      torchOn: props.torchOn,
      orientation: props.orientation,
      prompt: props.prompt,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'qrcode-scan',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('qrcode scan', startQRCode);
};
