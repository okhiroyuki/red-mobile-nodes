import { Node } from 'node-red';
import { postRequest } from '../util';
import { BleNodeDef } from '../@types/ble';
import { generateBleOptions } from './common';
import { UtilJsonDef } from '../@types/util';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileBleReadNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'ble-read',
        payload: msg.payload,
        options: generateBleOptions(RED, props),
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('ble read', RedMobileBleReadNode);
};
