import { Node } from 'node-red';
import { postRequest } from '../util';
import { BleNodeDef } from '../@types/ble';
import { UtilJsonDef } from '../@types/util';
import { generateBleOptions } from './common';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileBleScanNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'ble-scan',
        payload: msg.payload,
        options: generateBleOptions(RED, props),
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('ble scan', RedMobileBleScanNode);
};
