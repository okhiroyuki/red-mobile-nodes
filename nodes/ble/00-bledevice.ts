import { NodeAPI } from 'node-red';
import { BleNode, BleNodeDef } from '../@types/ble';

module.exports = function (RED: NodeAPI) {
  function bleDevice(this: BleNode, props: BleNodeDef) {
    RED.nodes.createNode(this, props);
    this.address = props.address;
  }
  RED.nodes.registerType('bledevice', bleDevice);
};
