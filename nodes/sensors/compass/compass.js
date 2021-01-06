module.exports = (RED) => {
  'use strcit';

  const { EventEmitter } = import('events');
  const WebSocketClient = import('../../WebSocketClient');
  const ev = new EventEmitter();
  const ws = new WebSocketClient(ev);
  if (RED.settings.redMobileWsPort) {
    const port = RED.settings.redMobileWsPort;
    ws.open(`ws://localhost:${port}/mobile/compass`);
  }

  function RedMobileCompassNode(n) {
    RED.nodes.createNode(this, n);
    const node = this;

    ev.on('message', (data) => {
      const { payload } = JSON.parse(data);
      node.send({ payload });
    });
  }

  RED.nodes.registerType('compass', RedMobileCompassNode);
};
