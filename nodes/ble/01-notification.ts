import { Node } from 'node-red';
import { BleNodeDef } from '../@types/ble';
import { EventEmitter } from 'events';
import { RedNodeAPI } from '../@types/nodeAPI';
import WebSocketClient from '../WebSocketClient';

module.exports = function (RED: RedNodeAPI) {
  const ev = new EventEmitter();
  const ws = new (WebSocketClient as any)(ev);
  if (RED.settings.redMobileWsPort) {
    const port = RED.settings.redMobileWsPort;
    ws.open('ws://localhost:' + port + '/mobile/ble');
  }

  function RedMobileBleNotificationNode(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    ev.on('message', (data) => {
      node.send({ payload: JSON.parse(data).payload });
    });
  }

  RED.nodes.registerType('ble notification', RedMobileBleNotificationNode);
};
