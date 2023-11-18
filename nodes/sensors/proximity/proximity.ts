import { NodeAPI, Node, NodeDef } from 'node-red';
import { EventEmitter } from 'events';
import { open } from '../common';

module.exports = function (RED: NodeAPI) {
  const ev = new EventEmitter();
  open(RED, ev);
  function RedMobileProximityNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    ev.on('message', (data) => {
      const payload = JSON.parse(data).payload;
      node.send({ payload: payload });
    });
  }

  RED.nodes.registerType('proximity', RedMobileProximityNode);
};
