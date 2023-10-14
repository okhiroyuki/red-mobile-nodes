import WebSocket, { CloseEvent, EventEmitter } from 'ws';
import os from 'node:os';

export default function WebSocketClient(this: any, ev: EventEmitter) {
  this.number = 0; // Message number
  this.autoReconnectInterval = 5 * 1000; // ms
  this.ev = ev;
}

WebSocketClient.prototype.open = function (url: string) {
  this.url = url;
  this.instance = new WebSocket(this.url);
  this.instance.on('open', () => {
    this.onopen();
  });

  this.instance.on('message', (data: string, flags: string) => {
    this.number++;
    this.onmessage(data, flags, this.number);
  });

  this.instance.on('close', (e: CloseEvent) => {
    if (e.code == 1000) {
      console.log('WebSocket: closed');
    } else {
      this.reconnect(e);
    }
    this.onclose(e);
  });

  this.instance.on('error', (e: CloseEvent) => {
    if (e.code == os.constants.errno.ECONNREFUSED) {
      this.reconnect(e);
    } else {
      this.onerror(e);
    }
  });
};

WebSocketClient.prototype.send = function (data: string, option: string) {
  try {
    this.instance.send(data, option);
  } catch (e) {
    this.instance.emit('error', e);
  }
};

WebSocketClient.prototype.reconnect = function (e: CloseEvent) {
  console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
  this.instance.removeAllListeners();
  const that = this;

  setTimeout(function () {
    that.open(that.url);
  }, this.autoReconnectInterval);
};

WebSocketClient.prototype.onopen = function () {
  this.ev.emit('open');
};

WebSocketClient.prototype.onmessage = function (data: string) {
  this.ev.emit('message', data);
};

WebSocketClient.prototype.onerror = function (e: CloseEvent) {
  this.ev.emit('error', e);
};

WebSocketClient.prototype.onclose = function () {
  this.ev.emit('close');
};
