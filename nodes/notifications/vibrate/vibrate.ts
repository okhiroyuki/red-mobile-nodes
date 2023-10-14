import { Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function sendError(node: Node) {
    node.error(RED._('vibrate.errors.response'));
    node.status({
      fill: 'red',
      shape: 'ring',
      text: RED._('vibrate.errors.response'),
    });
  }

  function RedMobileVibrateNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (msg.payload === undefined || !Array.isArray(msg.payload)) {
        sendError(node);
        return;
      }
      const json: UtilJsonDef = {
        id: node.id,
        method: 'vibrate',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('vibrate', RedMobileVibrateNode);
};
