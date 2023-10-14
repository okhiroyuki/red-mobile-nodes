import { Node } from 'node-red';
import { postRequest } from '../util';
import { generateBleOptions } from './common';
import { BleNodeDef } from '../@types/ble';
import { UtilJsonDef } from '../@types/util';
import isBase64 from 'is-base64';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileBleWriteNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (typeof msg.payload === 'string' && !isBase64(msg.payload)) {
        node.error('msg.payload must Base64 encoded string');
        node.status({
          fill: 'red',
          shape: 'ring',
          text: 'error',
        });
      } else {
        const json: UtilJsonDef = {
          id: node.id,
          method: 'ble-write',
          payload: msg.payload,
          options: generateBleOptions(RED, props),
        };
        postRequest(RED, node, msg, json);
      }
    });
  }

  RED.nodes.registerType('ble write', RedMobileBleWriteNode);
};
