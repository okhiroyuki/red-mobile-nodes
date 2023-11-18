import { NodeAPI, Node } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { ClipboardNodeDef, ClipboardNodeOptions } from '../@types/clipboard';

module.exports = function (RED: NodeAPI) {
  function RedMobileClipboardNode(this: Node, props: ClipboardNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    const options: ClipboardNodeOptions = {
      mode: props.mode,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: this.id,
        method: 'clipboard',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }
  RED.nodes.registerType('clipboard', RedMobileClipboardNode);
};
