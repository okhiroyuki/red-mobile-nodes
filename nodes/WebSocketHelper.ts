import WebSocketClient from './WebSocketClient';
import { EventEmitter } from 'ws';
import { RedNodeAPI } from './@types/nodeAPI';

export function open(RED: RedNodeAPI, ev: EventEmitter, path: string) {
  const ws = new (WebSocketClient as any)(ev);
  const port = RED.settings.redMobileWsPort;
  if (port) {
    ws.open(`ws://localhost:${port}${path}`, RED.settings.forceClose);
  }
}
