import { Node } from 'node-red';
import { BleNodeDef } from '../@types/ble';
import { RedNodeAPI } from '../@types/nodeAPI';
import { open } from '../WebSocketHelper';
import { EventEmitter } from 'ws';

module.exports = function (RED: RedNodeAPI) {
  const ev = new EventEmitter();
  open(RED, ev, '/mobile/ble');

  function RedMobileBleNotificationNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    ev.on('message', (data) => {
      node.send({ payload: JSON.parse(data).payload });
    });
  }

  RED.nodes.registerType('ble notification', RedMobileBleNotificationNode);
};
