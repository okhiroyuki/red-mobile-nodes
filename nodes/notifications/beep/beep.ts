import { Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileBeepNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (msg.payload === undefined || typeof msg.payload !== 'number') {
        sendError(node);
        return;
      }
      const json: UtilJsonDef = {
        id: node.id,
        method: 'beep',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });

    function sendError(node: Node) {
      node.error(RED._('beep.errors.response'));
      node.status({
        fill: 'red',
        shape: 'ring',
        text: RED._('beep.errors.response'),
      });
    }
  }
  RED.nodes.registerType('beep', RedMobileBeepNode);
};
