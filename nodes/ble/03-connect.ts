import { NodeAPI, Node } from 'node-red';
import { postRequest } from '../util';
import { generateBleOptions } from './common';
import { BleNodeDef } from '../@types/ble';
import { UtilJsonDef } from '../@types/util';

module.exports = function (RED: NodeAPI) {
  function RedMobileBleConnectNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'ble-connect',
        payload: msg.payload,
        options: generateBleOptions(RED, props),
      };

      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('ble connect', RedMobileBleConnectNode);
};
