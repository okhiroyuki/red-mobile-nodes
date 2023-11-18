import { NodeAPI } from 'node-red';
import WebSocketClient from '../WebSocketClient';
import { EventEmitter } from 'ws';

export function open(RED: NodeAPI, ev: EventEmitter) {
  const ws = new WebSocketClient(ev);
  if (RED.settings['redMobileWsPort']) {
    const port = RED.settings['redMobileWsPort'];
    ws.open('ws://localhost:' + port + '/mobile/gyroscope');
  }
}
