import { NodeAPI, Node } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { SensorNodeDef, SensorNodeOptions } from '../../@types/sensor';

module.exports = function (RED: NodeAPI) {
  function RedMobileSensorSubscribeNode(this: Node, props: SensorNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;
    const options: SensorNodeOptions = {
      sensor: props.sensor,
      freq: props.freq,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'sensor-subscribe',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }

  RED.nodes.registerType('sensor subscribe', RedMobileSensorSubscribeNode);
};
