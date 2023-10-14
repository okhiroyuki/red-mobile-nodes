import { NodeDef, Node } from 'node-red';
import { getRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileBatteryNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'battery',
      };
      getRequest(RED, node, msg, json, 5000);
    });
  }

  RED.nodes.registerType('battery', RedMobileBatteryNode);
};
