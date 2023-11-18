import { NodeAPI, Node } from 'node-red';
import { BleNodeDef } from '../@types/ble';

module.exports = function (RED: NodeAPI) {
  function bleDevice(this: Node, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    this['address'] = props.address;
  }
  RED.nodes.registerType('bledevice', bleDevice);
};
