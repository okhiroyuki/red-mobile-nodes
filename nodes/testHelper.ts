import { createServer, Server } from 'http';
import { parse } from 'url';
import { WebSocketServer, WebSocket } from 'ws';

let websocket: WebSocket;
let wss: WebSocketServer;

export default class TestServer {
  private server: Server;

  constructor(port: number, path: string) {
    this.server = createServer();
    wss = new WebSocketServer({ noServer: true });

    this.server.on('upgrade', function upgrade(request, socket, head) {
      const { pathname } = parse(request.url as string, false);

      if (pathname === path) {
        wss?.handleUpgrade(request, socket, head, function done(ws) {
          websocket = ws;
        });
      } else {
        socket.destroy();
      }
    });
    this.server.listen(port);
  }

  send(payload: string) {
    websocket?.send(JSON.stringify({ payload: payload }));
  }

  close() {
    websocket?.close();
    wss?.close();
    this.server.close();
  }
}
