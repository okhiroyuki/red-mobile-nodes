import { Node, NodeDef } from 'node-red';
import { EventEmitter } from 'events';
import { open } from '../../WebSocketHelper';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  const ev = new EventEmitter();
  open(RED, ev, '/mobile/compass');

  function RedMobileCompassNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    ev.on('message', (data) => {
      const payload = JSON.parse(data).payload;
      node.send({ payload: payload });
    });
  }

  RED.nodes.registerType('compass', RedMobileCompassNode);
};
