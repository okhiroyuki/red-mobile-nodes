import { Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileSpeechToTextNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'speech-to-text',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('speech-to-text', RedMobileSpeechToTextNode);
};
