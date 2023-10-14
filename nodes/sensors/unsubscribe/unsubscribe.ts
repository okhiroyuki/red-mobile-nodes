import { Node } from 'node-red';
import { postRequest } from '../../util';
import { UtilJsonDef } from '../../@types/util';
import { SensorNodeDef, SensorNodeOptions } from '../../@types/sensor';
import { RedNodeAPI } from '../../@types/nodeAPI';

module.exports = function (RED: RedNodeAPI) {
  function RedMobileSensorUnSubscribeNode(this: Node, props: SensorNodeDef) {
    RED.nodes.createNode(this, props);
    const node = this;
    const options: SensorNodeOptions = {
      sensor: props.sensor,
    };

    node.on('input', function (msg) {
      const json: UtilJsonDef = {
        id: node.id,
        method: 'sensor-unsubscribe',
        payload: msg.payload,
        options: options,
      };
      postRequest(RED, node, msg, json);
    });
  }
  RED.nodes.registerType('sensor unsubscribe', RedMobileSensorUnSubscribeNode);
};
