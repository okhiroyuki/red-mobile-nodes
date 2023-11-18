import { Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobilePromptNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (msg.payload === undefined || typeof msg.payload !== 'object') {
        sendError(node);
        return;
      }
      const json: UtilJsonDef = {
        id: node.id,
        method: 'prompt',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  function sendError(node: Node) {
    node.error(RED._('prompt.errors.response'));
    node.status({
      fill: 'red',
      shape: 'ring',
      text: RED._('prompt.errors.response'),
    });
  }

  RED.nodes.registerType('prompt', RedMobilePromptNode);
};
