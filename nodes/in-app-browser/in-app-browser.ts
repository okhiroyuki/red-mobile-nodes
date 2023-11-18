import { Node, NodeDef } from 'node-red';
import { postRequest } from '../util';
import { UtilJsonDef } from '../@types/util';
import {
  InAppBrowserNodeDef,
  InAppBrowserNodeMessageInFlow,
} from '../@types/in_app_browser';
import { RedNodeAPI } from '../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function BrowserOpen(this: Node, props: InAppBrowserNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg: InAppBrowserNodeMessageInFlow) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'browser-open',
        payload: props.url ? props.url : msg.payload,
        target: props.target === 'blank' ? '_blank' : '_system',
        options: props.options ? props.options : msg.options,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('browser open', BrowserOpen);

  function BrowserClose(this: Node, props: NodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'browser-close',
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('browser close', BrowserClose);
};
