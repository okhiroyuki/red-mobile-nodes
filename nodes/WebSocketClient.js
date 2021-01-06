const WebSocket = require('ws');

function WebSocketClient(ev) {
  this.number = 0; // Message number
  this.autoReconnectInterval = 5 * 1000; // ms
  this.ev = ev;
}

WebSocketClient.prototype.open = (url) => {
  this.url = url;
  this.instance = new WebSocket(this.url);
  this.instance.on('open', () => {
    this.onopen();
  });

  this.instance.on('message', (data, flags) => {
    this.number += 1;
    this.onmessage(data, flags, this.number);
  });

  this.instance.on('close', (e) => {
    switch (e.code) {
      case 1000: // CLOSE_NORMAL
        break;
      default: // Abnormal closure
        this.reconnect(e);
        break;
    }
    this.onclose(e);
  });

  this.instance.on('error', (e) => {
    switch (e.code) {
      case 'ECONNREFUSED':
        this.reconnect(e);
        break;
      default:
        this.onerror(e);
        break;
    }
  });
};

WebSocketClient.prototype.send = (data, option) => {
  try {
    this.instance.send(data, option);
  } catch (e) {
    this.instance.emit('error', e);
  }
};

WebSocketClient.prototype.reconnect = () => {
//   console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e);
  this.instance.removeAllListeners();
  const that = this;

  setTimeout(() => {
    // console.log("WebSocketClient: reconnecting...");
    that.open(that.url);
  }, this.autoReconnectInterval);
};

WebSocketClient.prototype.onopen = () => {
  // console.log("WebSocketClient: open", arguments);
  this.ev.emit('open');
};

WebSocketClient.prototype.onmessage = (data) => {
  // console.log("WebSocketClient: message", arguments);
  this.ev.emit('message', data);
};

WebSocketClient.prototype.onerror = (e) => {
  // console.log("WebSocketClient: error", arguments);
  this.ev.emit('error', e);
};

WebSocketClient.prototype.onclose = () => {
  // console.log("WebSocketClient: closed", arguments);
  this.ev.emit('close');
};

module.exports = WebSocketClient;
