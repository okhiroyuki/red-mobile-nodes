import { Node, NodeDef } from 'node-red';
import { getRequest, postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import { EventEmitter } from 'ws';
import { open } from '../WebSocketHelper';

import {
  SerialOpenNodeDef,
  SerialOpenNodeOptions,
  SerialWriteNodeDef,
} from '../@types/serial';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  const ev = new EventEmitter();
  open(RED, ev, '/mobile/serial');

  function RedMobileSerialOpenNode(this: Node, props: SerialOpenNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;
    const options: SerialOpenNodeOptions = {
      baudRate: props.baudRate,
      dataBits: props.dataBits,
      stopBits: props.stopBits,
      parity: props.parity,
      dtr: props.dtr,
      rts: props.rts,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'serial-open',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('serial-open', RedMobileSerialOpenNode);

  function RedMobileSerialCloseNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const params: UtilJsonDef = {
        id: node.id,
        method: 'serial-close',
      };
      getRequest(RED, node, msg, params, 5000);
    });
  }

  RED.nodes.registerType('serial-close', RedMobileSerialCloseNode);

  function RedMobileSerialWriteNode(this: Node, props: SerialWriteNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'serial-write',
        payload: props.data,
        dataType: props.dataType,
      };
      if (!props.data) {
        if (msg.payload) {
          json.payload = msg.payload;
          postRequest(RED, node, msg, json);
        } else {
          node.error(RED._('serial-write.errors.payload'));
          node.status({
            fill: 'red',
            shape: 'ring',
            text: RED._('serial-write.errors.payload'),
          });
        }
      }
    });
  }

  RED.nodes.registerType('serial-write', RedMobileSerialWriteNode);

  function RedMobileSerialReadNode(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;
    ev.on('message', (data) => {
      const payload = JSON.parse(data).payload;
      if (payload) {
        node.send({ payload: payload });
      }
    });
  }

  RED.nodes.registerType('serial-read', RedMobileSerialReadNode);
};
