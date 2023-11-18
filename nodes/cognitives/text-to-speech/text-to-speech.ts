import { NodeAPI, Node, NodeDef } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';

module.exports = function (RED: NodeAPI) {
  function RedMobileTextToSpeechNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'text-to-speech',
        payload: msg.payload,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('text-to-speech', RedMobileTextToSpeechNode);
};
