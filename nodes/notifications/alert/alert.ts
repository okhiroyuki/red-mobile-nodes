import { Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileAlertNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      if (msg.payload === undefined || typeof msg.payload !== 'object') {
        sendError(node);
        return;
      }
      const json: UtilJsonDef = {
        id: node.id,
        method: 'alert',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  function sendError(node: Node) {
    node.error(RED._('alert.errors.response'));
    node.status({
      fill: 'red',
      shape: 'ring',
      text: RED._('alert.errors.response'),
    });
  }

  RED.nodes.registerType('alert', RedMobileAlertNode);
};