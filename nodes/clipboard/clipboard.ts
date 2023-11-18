import { Node } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { ClipboardNodeDef, ClipboardNodeOptions } from '../@types/clipboard';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileClipboardNode(this: Node, props: ClipboardNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    const options: ClipboardNodeOptions = {
      mode: props.mode,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'clipboard',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }
  RED.nodes.registerType('clipboard', RedMobileClipboardNode);
};
