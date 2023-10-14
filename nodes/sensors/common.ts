import WebSocketClient from '../WebSocketClient';
import { EventEmitter } from 'ws';
import { RedNodeAPI } from '../@types/nodeAPI';

export function open(RED: RedNodeAPI, ev: EventEmitter) {
  const ws = new (WebSocketClient as any)(ev);
  if (RED.settings.redMobileWsPort) {
    const port = RED.settings.redMobileWsPort;
    ws.open('ws://localhost:' + port + '/mobile/gyroscope');
  }
}
