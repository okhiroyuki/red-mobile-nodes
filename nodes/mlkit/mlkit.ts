import { Node, NodeDef } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function textRecognizer(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'text-recognizer',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('text recognizer', textRecognizer);

  function imageLabeler(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'image-labeler',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('image labeler', imageLabeler);

  function barcodeDetector(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'barcode-detector',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('barcode detector', barcodeDetector);
};
