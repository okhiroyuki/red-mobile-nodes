import { Node, NodeDef } from 'node-red';
import { getRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileDBNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'db',
      };
      getRequest(RED, node, msg, json, 5000);
    });
  }

  RED.nodes.registerType('db', RedMobileDBNode);
};
